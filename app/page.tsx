import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Interests from "../components/Interests";
import Contact from "../components/Contact";
import { getProjectImageMap } from "../lib/content";
import { PROJECTS } from "../lib/projects";

export default async function Home() {
  const projectImages = await getProjectImageMap();

  return (
    <main>
      <Hero />
      <Projects projects={PROJECTS} projectImages={projectImages} />
      <Experience />
      <Interests />
      <Contact />
    </main>
  );
}
