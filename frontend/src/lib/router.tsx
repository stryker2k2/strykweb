import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

interface RouterContextValue {
  path: string
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterContextValue | null>(null)

function scrollToHash(hash: string) {
  if (hash) {
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(window.location.pathname)
  const pendingHash = useRef<string | null>(null)

  useEffect(() => {
    if (pendingHash.current !== null) {
      scrollToHash(pendingHash.current)
      pendingHash.current = null
    }
  }, [path])

  useEffect(() => {
    const onPopState = () => {
      pendingHash.current = window.location.hash
      setPath(window.location.pathname)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(to: string) {
    const url = new URL(to, window.location.origin)
    window.history.pushState({}, '', to)

    if (url.pathname !== path) {
      pendingHash.current = url.hash
      setPath(url.pathname)
    } else {
      scrollToHash(url.hash)
    }
  }

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within a RouterProvider')
  return ctx
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

export function Link({ to, onClick, ...props }: LinkProps) {
  const { navigate } = useRouter()

  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault()
        navigate(to)
        onClick?.(e)
      }}
      {...props}
    />
  )
}
