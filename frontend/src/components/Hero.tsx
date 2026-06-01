export default function Hero() {
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-gray-950 to-gray-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-900/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto text-center">
        <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">
          WoW Addon Developer
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Free tools, built for<br />
          <span className="text-amber-400">Azeroth and beyond</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          Open source addons and projects — free to download, free to fork.
        </p>
        <a
          href="#projects"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-gray-950 font-semibold px-7 py-3 rounded-lg transition-colors"
        >
          View Projects
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  )
}
