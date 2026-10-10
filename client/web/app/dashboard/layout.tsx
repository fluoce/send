"use client"

import { ReactNode } from "react"
import { FluoceAuthGuard, FluoceAuthProvider } from "@fluoce/auth-react"
import { PageSpinner } from "@/components/shared/loader"
import { useWidthType } from "@/context/width-type-context"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { maxWidthClass } = useWidthType()

  return (
    <FluoceAuthProvider
      app_url={process.env.NEXT_PUBLIC_APP_URL!}
      on_unauthorized_redirect={{
        type: "fluoce",
      }}
      on_error={(error) => console.log("Fluoce Auth Error :", error)}
    >
      <FluoceAuthGuard can_redirect={true} fallback={<PageSpinner />}>
        <div className="flex w-full items-center justify-center">
          <div className={`w-full ${maxWidthClass}`}>{children}</div>
        </div>
      </FluoceAuthGuard>
    </FluoceAuthProvider>
  )
}
