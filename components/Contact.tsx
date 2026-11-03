"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  CONTACT_LIMITS,
  HONEYPOT_FIELD,
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "../lib/contact";

type FieldName = keyof ContactInput;
type FieldElement = HTMLInputElement | HTMLTextAreaElement;
type Status = { kind: "idle" } | { kind: "success" } | { kind: "error"; message: string };
type ContactResponse = { ok?: boolean; errors?: ContactErrors; error?: string };

const FIELD_ORDER: FieldName[] = ["name", "email", "message"];
const EMPTY: ContactInput = { name: "", email: "", message: "" };
const UNTOUCHED: Record<FieldName, boolean> = { name: false, email: false, message: false };
const ALL_TOUCHED: Record<FieldName, boolean> = { name: true, email: true, message: true };
const FIX_FIELDS = "Please fix the highlighted fields.";
const GENERIC_ERROR = "Something went wrong. Please try again.";
const SUCCESS_MESSAGE = "Message sent! Thanks for reaching out.";

async function readResponse(res: Response): Promise<ContactResponse | null> {
  if (!res.headers.get("content-type")?.includes("json")) return null;
  try {
    return (await res.json()) as ContactResponse;
  } catch {
    return null;
  }
}

type FieldProps = {
  name: FieldName;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  readOnly: boolean;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
  inputRef: (el: FieldElement | null) => void;
  onChange: (name: FieldName, value: string) => void;
  onBlur: (name: FieldName) => void;
};

function Field({
  name,
  label,
  placeholder,
  value,
  error,
  readOnly,
  multiline,
  type = "text",
  autoComplete,
  inputRef,
  onChange,
  onBlur,
}: FieldProps) {
  const errorId = `${name}-error`;
  const shared = {
    id: name,
    name,
    placeholder,
    value,
    readOnly,
    maxLength: CONTACT_LIMITS[name],
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onChange: (e: React.ChangeEvent<FieldElement>) => onChange(name, e.target.value),
    onBlur: () => onBlur(name),
  };

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {multiline ? (
        <textarea {...shared} ref={inputRef} rows={4} />
      ) : (
        <input {...shared} ref={inputRef} type={type} autoComplete={autoComplete} />
      )}
      {error && (
        <span id={errorId} className="form-error">
          {error}
        </span>
      )}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState(UNTOUCHED);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [sending, setSending] = useState(false);

  const fieldRefs = useRef<Partial<Record<FieldName, FieldElement | null>>>({});
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const visibleError = (field: FieldName) => (touched[field] ? errors[field] : undefined);

  const showErrors = (next: ContactErrors) => {
    // Commit synchronously so the error text is linked before focus lands on the field.
    flushSync(() => {
      setTouched(ALL_TOUCHED);
      setErrors(next);
      setStatus({ kind: "error", message: FIX_FIELDS });
    });
    const first = FIELD_ORDER.find((f) => next[f]);
    if (first) fieldRefs.current[first]?.focus();
  };

  const handleChange = (field: FieldName, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validateContact(next));
    if (status.kind !== "idle") setStatus({ kind: "idle" });
  };

  const handleBlur = (field: FieldName) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateContact(values));
  };

  const bindRef = (field: FieldName) => (el: FieldElement | null) => {
    fieldRefs.current[field] = el;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const clientErrors = validateContact(values);
    if (Object.keys(clientErrors).length > 0) {
      showErrors(clientErrors);
      return;
    }

    setTouched(ALL_TOUCHED);
    setErrors({});
    setSending(true);
    setStatus({ kind: "idle" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - mountedAt.current,
        }),
      });
      const data = await readResponse(res);

      if (res.ok && data?.ok) {
        setStatus({ kind: "success" });
        setValues(EMPTY);
        setTouched(UNTOUCHED);
        setErrors({});
        return;
      }

      if (data?.errors && Object.keys(data.errors).length > 0) {
        showErrors(data.errors);
      } else {
        setStatus({ kind: "error", message: data?.error ?? GENERIC_ERROR });
      }
    } catch (err) {
      console.error("Failed to submit contact form", err);
      setStatus({
        kind: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const fieldProps = (field: FieldName) => ({
    name: field,
    value: values[field],
    error: visibleError(field),
    readOnly: sending,
    inputRef: bindRef(field),
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <section className="section-pad contact-section" id="contact">
      <div className="container">
        <div className="card contact-card">
          <div className="contact-grid">
            <div>
              <h2 className="h2 contact-title">Get in touch</h2>
              <span className="contact-kicker">
                Open to internship &amp; research opportunities
              </span>
              <p className="contact-intro">
                I&apos;m currently seeking internship and research opportunities in software engineering,
                data visualization, and high-performance computing. If you&apos;re interested in collaborating
                on a project or discussing opportunities, I&apos;d be glad to connect.
              </p>
              <div className="contact-links">
                <div className="contact-link">
                  <div className="contact-link-icon">
                    <span className="material-symbols-outlined" aria-hidden="true">location_on</span>
                  </div>
                  <span className="contact-link-text">Woodinville, WA</span>
                </div>
              </div>
            </div>

            {/* `post` keeps a submit that lands before hydration from putting the
                message in the URL. */}
            <form
              className="contact-form"
              method="post"
              onSubmit={handleSubmit}
              noValidate
              aria-busy={sending}
            >
              <Field {...fieldProps("name")} label="Full Name" placeholder="Your name" autoComplete="name" />
              <Field
                {...fieldProps("email")}
                label="Email"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
              />
              <Field {...fieldProps("message")} label="Message" placeholder="Your message..." multiline />

              {/* Honeypot: hidden from people, but naive bots fill it in. */}
              <div className="visually-hidden" aria-hidden="true">
                <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
                <input
                  id={HONEYPOT_FIELD}
                  name={HONEYPOT_FIELD}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  ref={honeypotRef}
                />
              </div>

              {/* Always rendered: screen readers often skip a live region that
                  appears already holding its text. */}
              <p className="visually-hidden" role="status">
                {status.kind === "success" ? SUCCESS_MESSAGE : ""}
              </p>
              {status.kind === "success" && (
                <div className="form-status success" aria-hidden="true">
                  {SUCCESS_MESSAGE}
                </div>
              )}
              {status.kind === "error" && (
                <div className="form-status error" role="alert">
                  {status.message}
                </div>
              )}

              {/* `aria-disabled` rather than `disabled`, which would drop focus. */}
              <button className="btn-primary btn-send" type="submit" aria-disabled={sending}>
                {sending ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
