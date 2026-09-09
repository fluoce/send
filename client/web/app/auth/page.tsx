"use client"

import { FluoceAuthFlow, FluoceAuthProvider } from "@fluoce/auth-react"
import { useSearchParams } from "next/navigation"

export default function AuthCallback() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")

  if (!code) {
    return (
      <div className="error">
        Authentication failed. Missing authorization code parameter.
      </div>
    )
  }

  return (
    <FluoceAuthProvider
      app_url={process.env.NEXT_PUBLIC_APP_URL!}
      on_unauthorized_redirect={{
        type: "fluoce",
      }}
      on_error={(error) => console.log("Fluoce Auth Error :", error)}
    >
      <FluoceAuthFlow
        code={code}
        redirect="/"
        fallback={<div>Verifying credentials, finalizing authorization...</div>}
      />
    </FluoceAuthProvider>
  )
}
