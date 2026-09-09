"use client"

import { ReactNode } from "react"
import { FluoceAuthGuard, FluoceAuthProvider } from "@fluoce/auth-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <FluoceAuthProvider
      app_url={process.env.NEXT_PUBLIC_APP_URL!}
      on_unauthorized_redirect={{
        type: "fluoce",
      }}
      on_error={(error) => console.log("Fluoce Auth Error :", error)}
    >
      <FluoceAuthGuard can_redirect={true}>{children}</FluoceAuthGuard>
    </FluoceAuthProvider>
  )
}
