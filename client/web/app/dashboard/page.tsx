"use client"

import { useFluoceAuth } from "@fluoce/auth-react"

export default function DashboardHome() {
  const { user } = useFluoceAuth()

  return (
    <h2>
      Send Fluoce - Dashboard
      {JSON.stringify(user)}
    </h2>
  )
}
