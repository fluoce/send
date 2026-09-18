"use client"

import { CreateUpdateWorkspace } from "@/components/form/create-update-workspace"
import { localStorageKey } from "@/const/local-storage-key"
import { dashboardRoute } from "@/const/route"
import useLocalStorage from "@/hooks/use-local-storage"
import { useWorkspaces } from "@/hooks/use-workspace"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CreateWorkspacePage() {
  const { data, isFetched } = useWorkspaces()

  const router = useRouter()

  const { value, setValue } = useLocalStorage({
    key: localStorageKey.selectedWorkspace,
  })

  useEffect(() => {
    if (isFetched) {
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
      }
    }
  }, [isFetched, data])

  return <CreateUpdateWorkspace page={true} />
}
