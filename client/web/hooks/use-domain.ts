import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFetch } from "./use-fetch"
import { domainEndpoint } from "@/const/endpoint"
import { domainQueryKey } from "@/const/query-key"
import { ResType } from "@/types/res"
import { DomainsDataType, DomainDataType } from "@/types/data/domain-data"
import {
  DomainCreateType,
  DomainUpdateType,
} from "@/types/payload/domain-payload"
import { toast } from "sonner"

export function useDomain({
  domainId,
  workspaceId,
}: {
  domainId: string
  workspaceId: string
}) {
  const f = useFetch()
  return useQuery<ResType<DomainDataType>>({
    queryKey: domainQueryKey.domain({
      domainId,
    }),
    queryFn: () =>
      f({
        endpoint: domainEndpoint.get({
          domainId,
          workspaceId,
        }),
        method: "GET",
      }),
  })
}

export function useDomains({ workspaceId }: { workspaceId: string }) {
  const f = useFetch()
  return useQuery<ResType<DomainsDataType>>({
    queryKey: domainQueryKey.domains({
      workspaceId,
    }),
    queryFn: () =>
      f({
        endpoint: domainEndpoint.getAll({
          workspaceId,
        }),
        method: "GET",
      }),
  })
}

export function useDomainCreate() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      body,
      workspaceId,
    }: {
      body: DomainCreateType
      workspaceId: string
    }) =>
      f({
        endpoint: domainEndpoint.create({ workspaceId }),
        method: "POST",
        body,
      }),
    onSuccess: (_, { workspaceId }) => {
      q.invalidateQueries({
        queryKey: domainQueryKey.domains({ workspaceId }),
      })
    },
  })
}

export function useDomainUpdate() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      body,
      workspaceId,
      domainId,
    }: {
      body: DomainUpdateType
      workspaceId: string
      domainId: string
    }) =>
      f({
        endpoint: domainEndpoint.update({ workspaceId, domainId }),
        method: "PATCH",
        body,
      }),
    onSuccess: (_, { workspaceId, domainId }) => {
      q.invalidateQueries({
        queryKey: domainQueryKey.domains({ workspaceId }),
      })
      q.invalidateQueries({
        queryKey: domainQueryKey.domain({ domainId }),
      })
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update status")
    },
  })
}

export function useDomainDelete() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      workspaceId,
      domainId,
    }: {
      workspaceId: string
      domainId: string
    }) =>
      f({
        endpoint: domainEndpoint.delete({ workspaceId, domainId }),
        method: "DELETE",
      }),
    onSuccess: (_, { workspaceId, domainId }) => {
      q.invalidateQueries({
        queryKey: domainQueryKey.domains({ workspaceId }),
      })
      q.invalidateQueries({
        queryKey: domainQueryKey.domain({
          domainId,
        }),
      })
    },
  })
}
