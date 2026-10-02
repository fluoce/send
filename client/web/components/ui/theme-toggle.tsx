"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "../tiptap-ui-primitive/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <Button
      type="button"
      variant="ghost"
      role="button"
      tabIndex={-1}
      aria-label="Toggle theme"
      tooltip="Toggle theme"
      shortcutKeys="T"
      onClick={toggleTheme}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="tiptap-button-icon" />
      ) : (
        <Moon className="tiptap-button-icon" />
      )}
    </Button>
  )
}
