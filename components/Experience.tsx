import { SKILL_GROUPS, TIMELINE } from "../lib/experience";

/** `_experience.scss` fades the dots through `.dim-1` to `.dim-3`. */
const MAX_DIM = 3;

export default function Experience() {
  return (
    <section
      className="experience-section panel-section section-pad"
      id="experience"
    >
      <div className="container">
        <div className="exp-grid">
          <div>
            <span className="label-cap reveal">Skills</span>
            <h2 className="h2 reveal reveal-delay-1">Technical Skills</h2>
            <div className="skills-groups reveal reveal-delay-2">
              {SKILL_GROUPS.map((group) => (
                <div key={group.label} className="skills-group">
                  <h3 className="skills-group-label">{group.label}</h3>
                  <ul className="skills-cloud" role="list">
                    {group.skills.map((skill) => (
                      <li key={skill} className="tag">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="label-cap reveal">Work</span>
            <h2 className="h2 reveal reveal-delay-1">Experience</h2>
            <ol className="timeline reveal reveal-delay-2" role="list">
              {TIMELINE.map((item, i) => (
                <li key={`${item.title}-${item.dates}`} className="timeline-item">
                  <div
                    className={`timeline-dot${i > 0 ? ` dim-${Math.min(i, MAX_DIM)}` : ""}`}
                    aria-hidden="true"
                  />
                  <div className="timeline-header">
                    <span className="timeline-title">{item.title}</span>
                    <span className="timeline-date">{item.dates}</span>
                  </div>
                  <p className="timeline-org">{item.org}</p>
                  <p className="timeline-desc">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
