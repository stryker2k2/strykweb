import type { Project } from '../types'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  return (
    <article className="flex flex-col bg-gray-900 border border-gray-800 rounded-xl p-6 gap-4 hover:border-amber-500/40 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight">{project.name}</h3>
          {project.game && (
            <span className="text-xs text-purple-400 font-medium">{project.game}</span>
          )}
        </div>
        <span className="shrink-0 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded font-mono">
          v{project.version}
        </span>
      </div>

      <p className="text-gray-400 text-sm flex-1 leading-relaxed">{project.description}</p>

      <div className="flex flex-wrap gap-2">
        {project.tags.map(tag => (
          <span
            key={tag}
            className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-3 pt-2 border-t border-gray-800">
        <a
          href={project.downloadUrl}
          download
          className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-gray-950 font-semibold text-sm py-2.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-100 rounded-lg transition-colors text-sm font-medium"
          >
            GitHub
          </a>
        )}
      </div>
    </article>
  )
}
