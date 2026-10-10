import { dashboardQueryKey } from "@/const/query-key"
import { useQuery } from "@tanstack/react-query"
import { useFetch } from "./use-fetch"
import { dashboardEndpoint } from "@/const/endpoint"
import { ResType } from "@/types/res"
import { DashboardDataType } from "@/types/data/dashboard-data"

export function useDashboard({ workspaceId }: { workspaceId: string }) {
  const f = useFetch()

  return useQuery<ResType<DashboardDataType>>({
    queryKey: dashboardQueryKey.dashboard({
      workspaceId,
    }),
    queryFn: () =>
      f({
        endpoint: dashboardEndpoint.get({ workspaceId }),
        method: "GET",
      }),
    enabled: Boolean(workspaceId),
  })
}
