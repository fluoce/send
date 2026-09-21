import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFetch } from "./use-fetch"
import { apiKeyEndpoint } from "@/const/endpoint"
import {
  ApiKeyAttechDomainType,
  ApiKeyCreateType,
  ApiKeyUpdateType,
} from "@/types/payload/api-key-payload"
import { apiKeyQueryKey } from "@/const/query-key"
import { ResType } from "@/types/res"
import { ApiKeysDataType, ApiKeyDataType } from "@/types/data/api-key-data"

export function useApiKey({
  apiKeyId,
  workspaceId,
}: {
  apiKeyId: string
  workspaceId: string
}) {
  const f = useFetch()
  return useQuery<ResType<ApiKeyDataType>>({
    queryKey: apiKeyQueryKey.apiKey({
      apiKeyId,
    }),
    queryFn: () =>
      f({
        endpoint: apiKeyEndpoint.get({
          apiKeyId,
          workspaceId,
        }),
        method: "GET",
      }),
  })
}

export function useApiKeys({ workspaceId }: { workspaceId: string }) {
  const f = useFetch()
  return useQuery<ResType<ApiKeysDataType>>({
    queryKey: apiKeyQueryKey.apiKeys({
      workspaceId,
    }),
    queryFn: () =>
      f({
        endpoint: apiKeyEndpoint.getAll({
          workspaceId,
        }),
        method: "GET",
      }),
  })
}

export function useApiKeyCreate() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      body,
      workspaceId,
    }: {
      body: ApiKeyCreateType
      workspaceId: string
    }) =>
      f({
        endpoint: apiKeyEndpoint.create({ workspaceId }),
        method: "POST",
        body,
      }),
    onSuccess: (_, { workspaceId }) => {
      q.invalidateQueries({
        queryKey: apiKeyQueryKey.apiKeys({ workspaceId }),
      })
    },
  })
}

export function useApiKeyUpdate() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      body,
      workspaceId,
      apiKeyId,
    }: {
      body: ApiKeyUpdateType
      workspaceId: string
      apiKeyId: string
    }) =>
      f({
        endpoint: apiKeyEndpoint.update({ workspaceId, apiKeyId }),
        method: "PATCH",
        body,
      }),
    onSuccess: (_, { workspaceId }) => {
      q.invalidateQueries({
        queryKey: apiKeyQueryKey.apiKeys({ workspaceId }),
      })
    },
  })
}

export function useApiKeyAttechDomain() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      body,
      workspaceId,
      apiKeyId,
    }: {
      body: ApiKeyAttechDomainType
      workspaceId: string
      apiKeyId: string
    }) =>
      f({
        endpoint: apiKeyEndpoint.attechDomain({ workspaceId, apiKeyId }),
        method: "PATCH",
        body,
      }),
    onSuccess: (_, { workspaceId }) => {
      q.invalidateQueries({
        queryKey: apiKeyQueryKey.apiKeys({ workspaceId }),
      })
    },
  })
}

export function useApiKeyDelete() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      workspaceId,
      apiKeyId,
    }: {
      workspaceId: string
      apiKeyId: string
    }) =>
      f({
        endpoint: apiKeyEndpoint.delete({ workspaceId, apiKeyId }),
        method: "DELETE",
      }),
    onSuccess: (_, { workspaceId }) => {
      q.invalidateQueries({
        queryKey: apiKeyQueryKey.apiKeys({ workspaceId }),
      })
    },
  })
}
