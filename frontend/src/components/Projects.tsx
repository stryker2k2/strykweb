import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Projects</h2>
          <p className="text-gray-400">Everything is free to download and open source.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
