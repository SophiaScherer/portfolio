import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Interests from "../components/Interests";
import Contact from "../components/Contact";
import { getProjectGalleryMap, getProjectImageMap } from "../lib/content";
import { PROJECTS } from "../lib/projects";

export default async function Home() {
  const [projectImages, projectGalleries] = await Promise.all([
    getProjectImageMap(),
    getProjectGalleryMap(),
  ]);

  return (
    <main>
      <Hero />
      <Projects
        projects={PROJECTS}
        projectImages={projectImages}
        projectGalleries={projectGalleries}
      />
      <Experience />
      <Interests />
      <Contact />
    </main>
  );
}
