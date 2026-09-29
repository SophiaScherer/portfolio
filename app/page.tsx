import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Interests from "../components/Interests";
import Contact from "../components/Contact";
import { getProjectGalleryMap, getProjectImageMap } from "../lib/content";
import { PROJECTS, warnOnDuplicateVariants, withCmsImages } from "../lib/projects";

export default async function Home() {
  const [projectImages, projectGalleries] = await Promise.all([
    getProjectImageMap(),
    getProjectGalleryMap(),
  ]);

  const projects = withCmsImages(PROJECTS, projectImages);
  warnOnDuplicateVariants(projects);

  return (
    <main>
      <Hero />
      <Projects projects={projects} projectGalleries={projectGalleries} />
      <Experience />
      <Interests />
      <Contact />
    </main>
  );
}
