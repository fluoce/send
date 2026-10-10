import { useState, useEffect } from "react"

export function useIsWidthLess({ size }: { size: number }) {
  const [isLess, setIsLess] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < size : false
  )

  useEffect(() => {
    function handleResize() {
      setIsLess(window.innerWidth < size)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [size])

  return isLess
}
