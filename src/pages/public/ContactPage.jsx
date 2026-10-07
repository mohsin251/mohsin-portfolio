import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import Contact from '../../components/public/Contact';

export default function ContactPage() {
  const { settings } = useOutletContext();

  useEffect(() => {
    document.title = `Contact — ${settings?.name || 'Mohsin'}`;
  }, [settings]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pt-16">
      <Contact settings={settings} />
    </motion.div>
  );
}
