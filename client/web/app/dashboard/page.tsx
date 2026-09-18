"use client"

import { PageSpinner } from "@/components/shared/loader"
import { Button } from "@/components/ui/button"
import { localStorageKey } from "@/const/local-storage-key"
import { dashboardRoute } from "@/const/route"
import useLocalStorage from "@/hooks/use-local-storage"
import { useWorkspaces } from "@/hooks/use-workspace"
import { ArrowUpRight, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function WorkspaceCheck() {
  const router = useRouter()

  const { value, setValue } = useLocalStorage({
    key: localStorageKey.selectedWorkspace,
  })

  const { data, isLoading, isError, error, refetch, isFetched } =
    useWorkspaces()

  useEffect(() => {
    if (isFetched && data) {
      const workspaces = data?.data?.workspaces
      if (workspaces && workspaces.length > 0) {
        let workspaceId: string = ""
        if (value) {
          const exists = workspaces.some((ws) => ws?.id === value)
          workspaceId = exists ? value : workspaces[0]?.id
        } else {
          workspaceId = workspaces[0]?.id
          setValue(workspaceId)
        }
        router.replace(
          dashboardRoute.workspace({
            workspaceId: workspaceId,
          })
        )
      } else {
        router.replace(dashboardRoute.createWorkspace)
      }
    }
  }, [isLoading, isFetched, data])

  if (isLoading) {
    return <PageSpinner />
  }

  if (isError) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        <div>Failed to load workspaces. Please try again.</div>
        <span>{error ? error?.message : ""}</span>
        <Button onClick={() => refetch()}>
          <RotateCcw /> Retry
        </Button>
      </div>
    )
  }

  return null
  // <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
  //   <div className="text-center">
  //     <div>Navigation appears to be delayed or encountered an issue.</div>
  //     <div>Please try again by clicking the button below.</div>
  //   </div>
  //   {data?.data?.workspaces?.[0]?.id ? (
  //     <Button
  //       onClick={() =>
  //         router.replace(
  //           dashboardRoute.workspace({
  //             workspaceId: data.data.workspaces[0].id,
  //           })
  //         )
  //       }
  //     >
  //       <ArrowUpRight /> Dashboard
  //     </Button>
  //   ) : (
  //     <Button onClick={() => refetch()}>
  //       <RotateCcw /> Retry
  //     </Button>
  //   )}
  // </div>
}
