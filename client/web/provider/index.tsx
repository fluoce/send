"use client"

import { Toaster } from "@/components/ui/sonner"
import { ReactNode } from "react"
import { TanstackProvider } from "./tanstack/tanstack-provider"
import { ThemeProvider } from "./theme/theme-provider"

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TanstackProvider>
        <Toaster position="top-center" />
        {children}
      </TanstackProvider>
    </ThemeProvider>
  )
}
