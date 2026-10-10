"use client"

import { Toaster } from "@/components/ui/sonner"
import { ReactNode } from "react"
import { TanstackProvider } from "./tanstack/tanstack-provider"
import { ThemeProvider } from "./theme/theme-provider"
import { WidthTypeProvider } from "@/context/width-type-context"

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TanstackProvider>
        <WidthTypeProvider>
          <Toaster position="top-center" />
          <div className="min-h-screen dark:bg-sidebar">{children}</div>
        </WidthTypeProvider>
      </TanstackProvider>
    </ThemeProvider>
  )
}
