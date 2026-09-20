"use client"

import { Toaster } from "@/components/ui/sonner"
import { ReactNode } from "react"
import { TanstackProvider } from "./tanstack/tanstack-provider"

export function Provider({ children }: { children: ReactNode }) {
  return (
    <TanstackProvider>
      <Toaster position="top-center" />
      {children}
    </TanstackProvider>
  )
}
