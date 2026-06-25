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
              <span className="label-cap">Get in Touch</span>
              <h2 className="h2">
                Let&apos;s build <span className="text-accent">together.</span>
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
                I&apos;m always open to discussing technical projects, research
                opportunities, or just chatting about the future of CS. Based in
                Woodinville, WA.
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
                <label htmlFor="name">Your Name</label>
                <input id="name" type="text" placeholder="Alex Chen" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="alex@example.com" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell me about your magic system..."
                ></textarea>
              </div>
              <button className="btn-send" type="submit">
                Send Connection Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
