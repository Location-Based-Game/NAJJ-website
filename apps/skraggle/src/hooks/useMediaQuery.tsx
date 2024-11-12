import { useState, useEffect } from "react"

/**
 * Common Breakpoints:
 * sm: 640px
 * md: 768px
 * lg: 1024px
 * xl: 1280px
 * 2xl: 1536px
 */
export function useMediaQuery(breakpoint:number) {
  const [isBreakpoint, setIsBreakpoint] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => {
      setIsBreakpoint(window.innerWidth < breakpoint)
    }
    mql.addEventListener("change", onChange)
    setIsBreakpoint(window.innerWidth < breakpoint)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isBreakpoint
}
