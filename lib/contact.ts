/** Shared by the contact form and its API route, so it must stay free of server-only imports. */

export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;

/**
 * Submissions faster than this after the form mounts are treated as bots.
 * The client reports the time, so this only stops bots that fill in the page.
 */
export const MIN_FILL_MS = 2000;

/**
 * Hidden field that people never see; anything in it marks the submission as
 * spam. Named so browser autofill won't recognize it.
 */
export const HONEYPOT_FIELD = "bot_field";

export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<"name" | "email" | "message", string>>;

// Rejecting `,;<>` keeps address lists and display names out of `replyTo`.
const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;

const tooLong = (label: string, limit: number) =>
  `Keep your ${label} under ${limit.toLocaleString("en-US")} characters.`;

export function validateContact(input: ContactInput): ContactErrors {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const errors: ContactErrors = {};

  if (!name) errors.name = "Name is required.";
  else if (/[\r\n]/.test(name)) errors.name = "Name must be a single line.";
  else if (name.length > CONTACT_LIMITS.name) errors.name = tooLong("name", CONTACT_LIMITS.name);

  if (!email) errors.email = "Email is required.";
  else if (email.length > CONTACT_LIMITS.email) errors.email = tooLong("email", CONTACT_LIMITS.email);
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";

  if (!message) errors.message = "Message is required.";
  else if (message.length > CONTACT_LIMITS.message)
    errors.message = tooLong("message", CONTACT_LIMITS.message);

  return errors;
}
