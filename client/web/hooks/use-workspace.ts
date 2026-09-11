import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFetch } from "./use-fetch"
import {
  WorkspaceCreateType,
  WorkspaceUpdateType,
} from "@/types/payload/workspace-payload"
import { workspaceEndpoint } from "@/const/endpoint"
import { workspaceQueryKey } from "@/const/query-key"

export function useWorkspaces() {
  const f = useFetch()
  return useQuery({
    queryKey: workspaceQueryKey.workspaces,
    queryFn: () =>
      f({
        endpoint: workspaceEndpoint.getAll,
        method: "GET",
      }),
  })
}

export function useWorkspace({ workspaceId }: { workspaceId: string }) {
  const f = useFetch()
  return useQuery({
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
    onSuccess: () => {
      q.invalidateQueries({
        queryKey: workspaceQueryKey.workspaces,
      })
    },
  })
}

export function useWorkspaceDelete() {
  const q = useQueryClient()
  const f = useFetch()
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
    },
  })
}
