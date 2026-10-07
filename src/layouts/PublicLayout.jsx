import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import CustomCursor from '../components/shared/CustomCursor';
import { ScrollProgress, BackToTop } from '../components/shared/ScrollProgress';
import CommandPalette from '../components/shared/CommandPalette';
import { getSiteSettings } from '../services/settingsService';

export default function PublicLayout() {
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
      <BackToTop />
      <CommandPalette />
    </div>
  );
}
