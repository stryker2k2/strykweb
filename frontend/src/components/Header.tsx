import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="text-amber-400 font-bold text-xl tracking-wide hover:text-amber-300 transition-colors">
          STRYKERSOFT
        </a>

        <nav className="hidden md:flex gap-8 text-sm text-gray-400">
          <a href="#projects" className="hover:text-amber-400 transition-colors">Projects</a>
          <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
        </nav>

        <button
          className="md:hidden text-gray-400 hover:text-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-4 flex flex-col gap-4 text-sm text-gray-400">
          <a href="#projects" className="hover:text-amber-400 transition-colors" onClick={() => setOpen(false)}>Projects</a>
          <a href="#about" className="hover:text-amber-400 transition-colors" onClick={() => setOpen(false)}>About</a>
        </div>
      )}
    </header>
  )
}
