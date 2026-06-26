"use client";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" type="text" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button className="btn-send" type="submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
