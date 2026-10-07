import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import About from '../../components/public/About';
import Skills from '../../components/public/Skills';
import Experience from '../../components/public/Experience';

export default function AboutPage() {
  const { settings } = useOutletContext();

  useEffect(() => {
    document.title = `About — ${settings?.name || 'Mohsin'}`;
  }, [settings]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pt-16">
      <About settings={settings} />
      <Skills />
      <Experience />
    </motion.div>
  );
}
