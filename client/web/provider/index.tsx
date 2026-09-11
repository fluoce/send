"use client"

import { ReactNode } from "react"
import { TanstackProvider } from "./tanstack/tanstack-provider"

export function Provider({ children }: { children: ReactNode }) {
  return <TanstackProvider>{children}</TanstackProvider>
}
