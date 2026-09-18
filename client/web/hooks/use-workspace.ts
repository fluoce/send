import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFetch } from "./use-fetch"
import {
  WorkspaceCreateType,
  WorkspaceUpdateType,
} from "@/types/payload/workspace-payload"
import { workspaceEndpoint } from "@/const/endpoint"
import { workspaceQueryKey } from "@/const/query-key"
import { ResType } from "@/types/res"
import {
  WorkspaceDataType,
  WorkspacesDataType,
} from "@/types/data/workspace-data"
import useLocalStorage from "./use-local-storage"
import { localStorageKey } from "@/const/local-storage-key"
import { useRouter } from "next/navigation"
import { dashboardRoute } from "@/const/route"

export function useWorkspace({ workspaceId }: { workspaceId: string }) {
  const f = useFetch()
  return useQuery<ResType<WorkspaceDataType>>({
    queryKey: workspaceQueryKey.workspace({
      workspaceId,
    }),
    queryFn: () =>
      f({
        endpoint: workspaceEndpoint.get({
          workspaceId,
        }),
        method: "GET",
      }),
  })
}

export function useWorkspaces() {
  const f = useFetch()
  return useQuery<ResType<WorkspacesDataType>>({
    queryKey: workspaceQueryKey.workspaces,
    queryFn: () =>
      f({
        endpoint: workspaceEndpoint.getAll,
        method: "GET",
      }),
  })
}

export function useWorkspaceCreate() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({ body }: { body: WorkspaceCreateType }) =>
      f({
        endpoint: workspaceEndpoint.create,
        method: "POST",
        body,
      }),
    onSuccess: () => {
      q.invalidateQueries({
        queryKey: workspaceQueryKey.workspaces,
      })
    },
  })
}

export function useWorkspaceUpdate() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      body,
      workspaceId,
    }: {
      body: WorkspaceUpdateType
      workspaceId: string
    }) =>
      f({
        endpoint: workspaceEndpoint.update({
          workspaceId,
        }),
        method: "PATCH",
        body,
      }),
    onSuccess: (_, { workspaceId }) => {
      q.invalidateQueries({
        queryKey: workspaceQueryKey.workspaces,
      })
      q.invalidateQueries({
        queryKey: workspaceQueryKey.workspace({
          workspaceId,
        }),
      })
    },
  })
}

export function useWorkspaceDelete() {
  const q = useQueryClient()
  const f = useFetch()
  const { removeValue } = useLocalStorage({
    key: localStorageKey.selectedWorkspace,
  })
  const router = useRouter()
  return useMutation({
    mutationFn: ({ workspaceId }: { workspaceId: string }) =>
      f({
        endpoint: workspaceEndpoint.delete({
          workspaceId,
        }),
        method: "DELETE",
      }),
    onSuccess: () => {
      q.invalidateQueries({
        queryKey: workspaceQueryKey.workspaces,
      })
      removeValue()
      router.replace(dashboardRoute.base)
    },
  })
}
