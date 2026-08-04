import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Interests from "../components/Interests";
import Contact from "../components/Contact";
import { getHeroImageUrl } from "../lib/content";
import { PROJECTS } from "../lib/projects";

export default async function Home() {
  const heroImageUrl = await getHeroImageUrl();

  return (
    <main>
      <Hero />
      <Projects projects={PROJECTS} heroImageUrl={heroImageUrl} />
      <Experience />
      <Interests />
      <Contact />
    </main>
  );
}
