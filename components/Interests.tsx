"use client";

import { useReveal } from "../hooks/useReveal";
import { useCarouselIndex } from "../hooks/useCarouselIndex";
import { INTERESTS } from "../lib/interests";
import { toIndexLabel } from "../lib/format";

export default function Interests() {
  const sectionRef = useReveal<HTMLElement>();
  const { trackRef, activeIndex, scrollToIndex } =
    useCarouselIndex<HTMLDivElement>();

  return (
    <section className="section-pad" id="interests" ref={sectionRef}>
      <div className="container">
        <span className="label-cap reveal">Beyond the Code</span>
        <h2 className="h2 reveal reveal-delay-1">Interests</h2>

        {/* Grid on larger screens, swipe carousel on phones. */}
        <div className="interests-grid carousel-track" ref={trackRef}>
          {INTERESTS.map((interest, i) => (
            <div
              key={interest.id}
              className={`card interest-card reveal reveal-delay-${i + 1}`}
            >
              <span className="interest-card-eyebrow">{toIndexLabel(i)}</span>
              <div className="interest-icon">
                <span className="material-symbols-outlined">{interest.icon}</span>
              </div>
              <h3 className="h3">{interest.title}</h3>
              <p>{interest.description}</p>
            </div>
          ))}
        </div>

        <div className="carousel-dots" role="group" aria-label="Choose an interest">
          {INTERESTS.map((interest, i) => (
            <button
              key={interest.id}
              type="button"
              className="carousel-dot"
              aria-label={`Show ${interest.title}`}
              aria-current={activeIndex === i ? "true" : undefined}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
