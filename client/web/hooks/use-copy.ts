import { useState } from "react"

export function useCopy({
  text,
  showCopiedSuccessUntil = 1800,
}: {
  text: string
  showCopiedSuccessUntil?: number
}) {
  const [showCopiedSuccess, setShowCopiedSuccess] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setShowCopiedSuccess(true)
      setTimeout(() => setShowCopiedSuccess(false), showCopiedSuccessUntil)
    } catch (e) {
      setShowCopiedSuccess(false)
    }
  }

  return { copy, showCopiedSuccess }
}
