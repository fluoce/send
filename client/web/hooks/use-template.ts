import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useFetch } from "./use-fetch"
import { templateEndpoint } from "@/const/endpoint"
import { templateQueryKey } from "@/const/query-key"
import { ResType } from "@/types/res"
import { TemplateDataType, TemplatesDataType } from "@/types/data/template-data"
import {
  TemplateCreateType,
  TemplateUpdateType,
} from "@/types/payload/template-payload"

export function useTemplate({
  templateId,
  workspaceId,
}: {
  templateId: string
  workspaceId: string
}) {
  const f = useFetch()
  return useQuery<ResType<TemplateDataType>>({
    queryKey: templateQueryKey.template({
      templateId,
    }),
    queryFn: () =>
      f({
        endpoint: templateEndpoint.get({
          templateId,
          workspaceId,
        }),
        method: "GET",
      }),
  })
}

export function useTemplates({ workspaceId }: { workspaceId: string }) {
  const f = useFetch()
  return useQuery<ResType<TemplatesDataType>>({
    queryKey: templateQueryKey.templates({
      workspaceId,
    }),
    queryFn: () =>
      f({
        endpoint: templateEndpoint.getAll({
          workspaceId,
        }),
        method: "GET",
      }),
  })
}

export function useTemplateCreate() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      body,
      workspaceId,
    }: {
      body: TemplateCreateType
      workspaceId: string
    }) =>
      f({
        endpoint: templateEndpoint.create({ workspaceId }),
        method: "POST",
        body,
      }),
    onSuccess: (_, { workspaceId }) => {
      q.invalidateQueries({
        queryKey: templateQueryKey.templates({ workspaceId }),
      })
    },
  })
}

export function useTemplateUpdateMeta() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      body,
      workspaceId,
      templateId,
    }: {
      body: TemplateUpdateType
      workspaceId: string
      templateId: string
    }) =>
      f({
        endpoint: templateEndpoint.updateMeta({ workspaceId, templateId }),
        method: "PATCH",
        body,
      }),
    onSuccess: (_, { workspaceId, templateId }) => {
      q.invalidateQueries({
        queryKey: templateQueryKey.templates({ workspaceId }),
      })
      q.invalidateQueries({
        queryKey: templateQueryKey.template({ templateId }),
      })
    },
  })
}

export function useTemplateDelete() {
  const q = useQueryClient()
  const f = useFetch()
  return useMutation({
    mutationFn: ({
      workspaceId,
      templateId,
    }: {
      workspaceId: string
      templateId: string
    }) =>
      f({
        endpoint: templateEndpoint.delete({ workspaceId, templateId }),
        method: "DELETE",
      }),
    onSuccess: (_, { workspaceId }) => {
      q.invalidateQueries({
        queryKey: templateQueryKey.templates({ workspaceId }),
      })
    },
  })
}
