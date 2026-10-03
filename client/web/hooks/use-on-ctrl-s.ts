import { RefObject, useEffect, useState } from "react"

export function useOnCtrlS({
  ref,
  func,
}: {
  ref: RefObject<HTMLDivElement>
  func: () => void
}) {
  const [editorFocused, setEditorFocused] = useState(false)

  useEffect(() => {
    const editorEl = ref.current
    if (!editorEl) return
    function handleFocus() {
      setEditorFocused(true)
    }
    function handleBlur(e: FocusEvent) {
      if (!editorEl?.contains(e.relatedTarget as Node)) {
        setEditorFocused(false)
      }
    }
    editorEl.addEventListener("focusin", handleFocus)
    editorEl.addEventListener("focusout", handleBlur)
    return () => {
      editorEl.removeEventListener("focusin", handleFocus)
      editorEl.removeEventListener("focusout", handleBlur)
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (editorFocused) {
        if (
          (event.ctrlKey || event.metaKey) &&
          (event.key === "s" || event.key === "S")
        ) {
          event.preventDefault()
          func?.()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [editorFocused, func])
}
