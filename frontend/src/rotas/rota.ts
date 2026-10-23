import { useEffect, useState } from 'react'

export function useRota(): string {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const aoMudar = () => {
      setHash(window.location.hash)
      if (window.location.hash.startsWith('#/')) window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])
  return hash.replace(/^#/, '') || '/'
}

export function navegar(destino: string): void {
  window.location.hash = destino
  window.dispatchEvent(new Event('hashchange'))
}
