import { useEffect, useState } from 'react'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

export default function Projects() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/downloads')
      .then(res => res.json())
      .then(setCounts)
      .catch(() => {})
  }, [])

  function handleDownload(id: string) {
    setCounts(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
    fetch(`/api/downloads/${id}`, { method: 'POST' }).catch(() => {})
  }

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Projects</h2>
          <p className="text-gray-400">Solid Addons to take your WoW Gaming Experience to the Next Level</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              downloadCount={counts[project.id] ?? 0}
              onDownload={() => handleDownload(project.id)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#top"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-gray-950 font-semibold px-7 py-3 rounded-lg transition-colors"
          >
            Back to Top
          </a>
        </div>
      </div>
    </section>
  )
}
