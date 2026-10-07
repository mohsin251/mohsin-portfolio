import { useEffect } from 'react';
import ProjectsGrid from '../../components/public/ProjectsGrid';

export default function Projects() {
  useEffect(() => {
    document.title = 'Projects — Mohsin';
  }, []);

  return (
    <div className="pt-16">
      <ProjectsGrid title="All Projects" subtitle="Selected Work" />
    </div>
  );
}
