import { useState } from 'react'
import type { Project } from '../types'

interface Props {
  project: Project
  downloadCount: number
  onDownload: () => void
}

export default function ProjectCard({ project, downloadCount, onDownload }: Props) {
  const [activeShot, setActiveShot] = useState(0)
  const shots = project.screenshots ?? []

  return (
    <article className="flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-amber-500/40 transition-colors">

      {/* Screenshot viewer */}
      {shots.length > 0 && (
        <div className="relative bg-gray-950 aspect-video overflow-hidden">
          <img
            src={shots[activeShot]}
            alt={`${project.name} screenshot ${activeShot + 1}`}
            className="w-full h-full object-cover"
          />
          {shots.length > 1 && (
            <>
              <button
                onClick={() => setActiveShot(i => (i - 1 + shots.length) % shots.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-950/70 hover:bg-gray-950/90 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
                aria-label="Previous screenshot"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setActiveShot(i => (i + 1) % shots.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-950/70 hover:bg-gray-950/90 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
                aria-label="Next screenshot"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {shots.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveShot(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeShot ? 'bg-amber-400' : 'bg-gray-600 hover:bg-gray-400'}`}
                    aria-label={`Screenshot ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 p-6 flex-1">
        {/* Header */}
        <div className="flex flex-col gap-3">
          {project.icon && (
            <div className="flex justify-center">
              <img src={project.icon} alt={`${project.name} icon`} className="h-24 w-auto" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <h3 className="text-white font-semibold text-lg leading-tight">{project.name}</h3>
              <span className="shrink-0 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono">
                v{project.version}
              </span>
            </div>
            {project.game && (
              <span className="text-xs text-purple-400 font-medium">{project.game}</span>
            )}
          </div>
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
            onClick={onDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-gray-950 font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
          {project.curseforgeUrl && (
            <a
              href={project.curseforgeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 border border-gray-700 hover:border-orange-500 text-gray-400 hover:text-orange-400 rounded-lg transition-colors text-sm font-medium"
            >
              CurseForge
            </a>
          )}
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

        <p className="text-center text-xs text-gray-600">
          Downloaded {downloadCount.toLocaleString()} {downloadCount === 1 ? 'time' : 'times'}
        </p>
      </div>
    </article>
  )
}
