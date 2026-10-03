import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMail, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn();
  return { sendMail, createTransport: vi.fn(() => ({ sendMail })) };
});
vi.mock("nodemailer", () => ({ default: { createTransport } }));

type Handler = typeof import("./route").POST;
let POST: Handler;

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello there.",
  bot_field: "",
  elapsedMs: 5000,
};

const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.1", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );

beforeEach(async () => {
  // A fresh module gives each test a fresh rate limiter.
  vi.resetModules();
  ({ POST } = await import("./route"));
  sendMail.mockReset().mockResolvedValue({});
  createTransport.mockClear();
  vi.stubEnv("SMTP_HOST", "smtp.test");
  vi.stubEnv("SMTP_PORT", "587");
  vi.stubEnv("SMTP_USER", "sender@example.com");
  vi.stubEnv("SMTP_PASS", "test-password");
  vi.stubEnv("CONTACT_TO", "inbox@example.com");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/contact", () => {
  it("sends the message with the visitor as replyTo", async () => {
    const res = await post({ ...valid, email: "  ada@example.com " });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.test",
        port: 587,
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      })
    );
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "inbox@example.com",
        replyTo: "ada@example.com",
        subject: "Portfolio contact from Ada Lovelace",
      })
    );
  });

  it("escapes HTML in the email body", async () => {
    await post({ ...valid, message: "<script>alert(1)</script>" });
    expect(sendMail.mock.calls[0][0].html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("rejects an oversized Content-Length with 413", async () => {
    const res = await post(valid, { "content-length": "20001" });
    expect(res.status).toBe(413);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects an oversized body without Content-Length with 413", async () => {
    const res = await post({ ...valid, message: "a".repeat(25_000) });
    expect(res.status).toBe(413);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rate limits each IP to 5 requests per hour", async () => {
    for (let i = 0; i < 5; i++) expect((await post(valid)).status).toBe(200);

    const blocked = await post(valid);
    expect(blocked.status).toBe(429);
    expect((await blocked.json()).error).toMatch(/too many/i);
    expect(sendMail).toHaveBeenCalledTimes(5);

    expect((await post(valid, { "x-forwarded-for": "198.51.100.7, 203.0.113.1" })).status).toBe(200);
  });

  it("stops reading a streamed body once it passes the cap", async () => {
    let pulled = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled++;
        controller.enqueue(new Uint8Array(8_000));
        if (pulled === 100) controller.close();
      },
    });
    const res = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        body: stream,
        duplex: "half",
      } as RequestInit)
    );
    expect(res.status).toBe(413);
    expect(pulled).toBeLessThan(10);
  });

  it("refunds the quota when sending fails", async () => {
    sendMail.mockRejectedValue(new Error("smtp down"));
    for (let i = 0; i < 5; i++) expect((await post(valid)).status).toBe(500);
    sendMail.mockResolvedValue({});
    expect((await post(valid)).status).toBe(200);
  });

  it("doesn't count rejected submissions toward the limit", async () => {
    for (let i = 0; i < 6; i++) await post({ ...valid, email: "not-an-email" });
    expect((await post(valid)).status).toBe(200);
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", async () => {
    const fromRealIp = (ip: string) => post(valid, { "x-forwarded-for": "", "x-real-ip": ip });
    for (let i = 0; i < 5; i++) await fromRealIp("192.0.2.9");
    expect((await fromRealIp("192.0.2.9")).status).toBe(429);
    expect((await fromRealIp("192.0.2.10")).status).toBe(200);
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const res = await post({ ...valid, bot_field: "https://spam.example" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it.each([
    ["too fast", 500],
    ["missing", undefined],
    ["a string", "5000"],
    ["null", null],
  ])("rejects submissions when elapsedMs is %s", async (_label, elapsedMs) => {
    const res = await post({ ...valid, elapsedMs });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "Please take a moment before sending." });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const res = await post({ ...valid, name: "Ada\nBcc: x@y.z", email: "a,b@x.y", message: " " });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      errors: {
        name: "Name must be a single line.",
        email: "Please enter a valid email address.",
        message: "Message is required.",
      },
    });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it.each(["{not json", "null", "[]", "42"])("rejects the malformed body %j", async (body) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Invalid JSON body");
  });

  it("returns a generic 500 when mail config is missing", async () => {
    vi.stubEnv("SMTP_PASS", "");
    const res = await post(valid);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data).toEqual({
      ok: false,
      error: "Messaging is temporarily unavailable. Please try again later.",
    });
    expect(JSON.stringify(data)).not.toMatch(/SMTP/);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("SMTP_HOST"));
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns a generic 500 when the SMTP port is invalid", async () => {
    vi.stubEnv("SMTP_PORT", "99999");
    const res = await post(valid);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Messaging is temporarily unavailable. Please try again later.");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns 500 when sending fails", async () => {
    sendMail.mockRejectedValue(new Error("SMTP down"));
    const res = await post(valid);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Failed to send message. Please try again later.");
  });
});
