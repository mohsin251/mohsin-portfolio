import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Hero from '../../components/public/Hero';
import About from '../../components/public/About';
import Skills from '../../components/public/Skills';
import Services from '../../components/public/Services';
import FeaturedProject from '../../components/public/FeaturedProject';
import ProjectsGrid from '../../components/public/ProjectsGrid';
import Experience from '../../components/public/Experience';
import Testimonials from '../../components/public/Testimonials';
import Contact from '../../components/public/Contact';

export default function Home() {
  const { settings } = useOutletContext();

  useEffect(() => {
    document.title = `${settings?.name || 'Mohsin'} — ${settings?.role || 'AI / Full-Stack Developer'}`;
  }, [settings]);

  return (
    <>
      <Hero settings={settings} />
      <About settings={settings} />
      <Skills />
      <Services />
      <FeaturedProject />
      <ProjectsGrid limit={6} title="Recent Projects" subtitle="Selected Work" />
      <Experience />
      <Testimonials />
      <Contact settings={settings} />
    </>
  );
}
