import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Interests from "../components/Interests";
import Contact from "../components/Contact";
import { getProjectGalleryMap, getProjectImageMap } from "../lib/content";
import { SOCIAL_LINKS } from "../lib/links";
import { PROJECTS, warnOnDuplicateVariants, withCmsImages } from "../lib/projects";
import { SITE_NAME, SITE_URL } from "../lib/site";

/** Structured data so search engines can show a profile card. */
const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  affiliation: { "@type": "CollegeOrUniversity", name: "Oregon State University" },
  sameAs: SOCIAL_LINKS.map((link) => link.href),
};

export default async function Home() {
  const [projectImages, projectGalleries] = await Promise.all([
    getProjectImageMap(),
    getProjectGalleryMap(),
  ]);

  const projects = withCmsImages(PROJECTS, projectImages);
  warnOnDuplicateVariants(projects);

  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(PERSON_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Projects projects={projects} projectGalleries={projectGalleries} />
      <Experience />
      <Interests />
      <Contact />
    </main>
  );
}
