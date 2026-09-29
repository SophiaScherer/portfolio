import { describe, expect, it } from "vitest";
import { CONTACT_LIMITS, validateContact } from "./contact";

const valid = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there." };

describe("validateContact", () => {
  it("accepts a valid submission", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("trims values before checking them", () => {
    expect(validateContact({ name: "  Ada ", email: " ada@example.com\n", message: " hi " })).toEqual({});
    expect(validateContact({ name: "   ", email: " ", message: "\n\t" })).toEqual({
      name: "Name is required.",
      email: "Email is required.",
      message: "Message is required.",
    });
  });

  it("rejects multi-line names", () => {
    expect(validateContact({ ...valid, name: "Ada\nBcc: x@y.z" }).name).toBe("Name must be a single line.");
    expect(validateContact({ ...valid, name: "Ada\rLovelace" }).name).toBe("Name must be a single line.");
  });

  it.each([
    "not-an-email",
    "a@b",
    "a b@example.com",
    "a,b,c@x.y",
    "a@x.y,b@x.y",
    "a@x.y;b@x.y",
    "Ada <ada@example.com>",
    "<ada@example.com>",
  ])("rejects the invalid email %j", (email) => {
    expect(validateContact({ ...valid, email }).email).toBe("Please enter a valid email address.");
  });

  it("enforces length caps", () => {
    const at = (field: keyof typeof CONTACT_LIMITS, extra: number) =>
      field === "email"
        ? `${"a".repeat(CONTACT_LIMITS.email - "@example.com".length + extra)}@example.com`
        : "a".repeat(CONTACT_LIMITS[field] + extra);

    expect(validateContact({ name: at("name", 0), email: at("email", 0), message: at("message", 0) })).toEqual({});
    expect(validateContact({ name: at("name", 1), email: at("email", 1), message: at("message", 1) })).toEqual({
      name: "Keep your name under 100 characters.",
      email: "Keep your email under 254 characters.",
      message: "Keep your message under 5,000 characters.",
    });
  });
});
