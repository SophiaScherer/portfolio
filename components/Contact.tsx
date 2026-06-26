"use client";

import { useState } from "react";

type Errors = { name?: string; email?: string; message?: string };
type Status = { kind: "idle" } | { kind: "success" } | { kind: "error"; message: string };

function validate(name: string, email: string, message: string): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Name is required.";
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!message.trim()) errors.message = "Message is required.";
  return errors;
}

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ name: boolean; email: boolean; message: boolean }>({
    name: false,
    email: false,
    message: false,
  });
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [sending, setSending] = useState(false);

  const showError = (field: keyof Errors) => touched[field] && Boolean(errors[field]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    setTouched({ name: true, email: true, message: true });
    const v = validate(name, email, message);
    setErrors(v);

    if (Object.keys(v).length > 0) {
      setStatus({ kind: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setSending(true);
    setStatus({ kind: "idle" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        errors?: Errors;
        error?: string;
      };

      if (res.ok && data.ok) {
        setStatus({ kind: "success" });
        setName("");
        setEmail("");
        setMessage("");
        setTouched({ name: false, email: false, message: false });
        setErrors({});
        return;
      }

      if (data.errors) {
        setErrors(data.errors);
        setStatus({ kind: "error", message: "Please fix the highlighted fields." });
      } else {
        setStatus({
          kind: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section-pad" id="contact" style={{ paddingBottom: "48px" }}>
      <div className="container">
        <div className="card contact-card">
          <div className="contact-grid">
            <div>
              <span className="label-cap">Contact</span>
              <h2 className="h2">
                Get in <span className="text-accent">touch.</span>
              </h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  marginTop: "16px",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  maxWidth: "380px",
                }}
              >
                I'm currently seeking internship and research opportunities in software engineering,
                data visualization, and high-performance computing. If you're interested in collaborating
                on a project or discussing opportunities, I'd be glad to connect.
              </p>
              <div className="contact-links">
                <a href="mailto:sophiasch@gmail.com" className="contact-link">
                  <div className="contact-link-icon">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <span className="contact-link-text">sophiasch@gmail.com</span>
                </a>
                <div className="contact-link" style={{ cursor: "default" }}>
                  <div className="contact-link-icon">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <span className="contact-link-text">Woodinville, WA</span>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (touched.name) setErrors(validate(e.target.value, email, message));
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, name: true }));
                    setErrors(validate(name, email, message));
                  }}
                  aria-invalid={showError("name")}
                  aria-describedby={showError("name") ? "name-error" : undefined}
                  disabled={sending}
                />
                {showError("name") && (
                  <span id="name-error" className="form-error">
                    {errors.name}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) setErrors(validate(name, e.target.value, message));
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, email: true }));
                    setErrors(validate(name, email, message));
                  }}
                  aria-invalid={showError("email")}
                  aria-describedby={showError("email") ? "email-error" : undefined}
                  disabled={sending}
                />
                {showError("email") && (
                  <span id="email-error" className="form-error">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Your message..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (touched.message) setErrors(validate(name, email, e.target.value));
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, message: true }));
                    setErrors(validate(name, email, message));
                  }}
                  aria-invalid={showError("message")}
                  aria-describedby={showError("message") ? "message-error" : undefined}
                  disabled={sending}
                />
                {showError("message") && (
                  <span id="message-error" className="form-error">
                    {errors.message}
                  </span>
                )}
              </div>

              {status.kind === "success" && (
                <div className="form-status success" role="status">
                  Message sent! Thanks for reaching out.
                </div>
              )}
              {status.kind === "error" && (
                <div className="form-status error" role="alert">
                  {status.message}
                </div>
              )}

              <button className="btn-send" type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
