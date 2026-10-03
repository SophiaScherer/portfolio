import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { HONEYPOT_FIELD, MIN_FILL_MS, validateContact } from "../../../lib/contact";
import { createRateLimiter } from "../../../lib/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 20_000;
const UNAVAILABLE = "Messaging is temporarily unavailable. Please try again later.";

const limiter = createRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  elapsedMs?: unknown;
  [HONEYPOT_FIELD]?: unknown;
};

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Vercel overwrites `x-forwarded-for`; behind another proxy it could be spoofed. */
function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Reads the body as text, or returns null once it passes `limit` bytes. */
async function readText(req: Request, limit: number): Promise<string | null> {
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

const tooLarge = () =>
  NextResponse.json(
    { ok: false, error: "Your message is too long. Please shorten it and try again." },
    { status: 413 }
  );

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return tooLarge();

  // Content-Length can be absent (chunked uploads), so cap the actual read too.
  const raw = await readText(req, MAX_BODY_BYTES);
  if (raw === null) return tooLarge();

  let body: ContactPayload;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error();
    body = parsed as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Pretend success so bots don't learn they were caught.
  const honeypot = body[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot !== "") {
    return NextResponse.json({ ok: true });
  }

  const elapsed = body.elapsedMs;
  if (typeof elapsed !== "number" || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return NextResponse.json(
      { ok: false, error: "Please take a moment before sending." },
      { status: 400 }
    );
  }

  const name = asString(body.name);
  const email = asString(body.email);
  const message = asString(body.message);

  const errors = validateContact({ name, email, message });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT ?? "587";
  const port = Number.parseInt(portRaw, 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO ?? user;

  if (!host || !user || !pass) {
    console.error("Contact form is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.");
    return NextResponse.json({ ok: false, error: UNAVAILABLE }, { status: 500 });
  }

  if (!Number.isFinite(port) || port <= 0 || port > 65535) {
    console.error(`Contact form has an invalid SMTP_PORT value: ${portRaw}`);
    return NextResponse.json({ ok: false, error: UNAVAILABLE }, { status: 500 });
  }

  // Counted only for messages that are actually sent, so typos and outages
  // don't use up a visitor's quota.
  const ip = clientIp(req);
  if (!limiter.take(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again in an hour." },
      { status: 429 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    const subject = `Portfolio contact from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    limiter.refund(ip);
    console.error("Failed to send contact message", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
