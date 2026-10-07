import { Github, Linkedin, Youtube, Instagram } from 'lucide-react';

export default function Footer({ settings }) {
  const year = new Date().getFullYear();
  const socials = [
    { url: settings?.github_url, icon: Github, label: 'GitHub' },
    { url: settings?.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: settings?.youtube_url, icon: Youtube, label: 'YouTube' },
    { url: settings?.instagram_url, icon: Instagram, label: 'Instagram' },
  ].filter((s) => s.url);

  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-white/40">
          © {year} {settings?.name || 'Mohsin'}. All rights reserved.
        </p>
        <div className="flex gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="text-white/40 transition-colors hover:text-accent-glow"
            >
              <s.icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
