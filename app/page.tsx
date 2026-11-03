import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Interests from "../components/Interests";
import Contact from "../components/Contact";
import { getProjectGalleryMap, getProjectImageMap, getResumeDownload } from "../lib/content";
import { SOCIAL_LINKS } from "../lib/links";
import { PROJECTS, warnOnDuplicateVariants, withCmsImages } from "../lib/projects";
import { PROFILE } from "../lib/profile";
import { SITE_NAME, SITE_URL } from "../lib/site";

/** Structured data so search engines can show a profile card. */
const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  affiliation: { "@type": "CollegeOrUniversity", name: PROFILE.school },
  sameAs: SOCIAL_LINKS.map((link) => link.href),
};

export default async function Home() {
  const [projectImages, projectGalleries, resume] = await Promise.all([
    getProjectImageMap(),
    getProjectGalleryMap(),
    getResumeDownload(),
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
      <Hero resume={resume} />
      <Projects projects={projects} projectGalleries={projectGalleries} />
      <Experience />
      <Interests />
      <Contact />
    </main>
  );
}
