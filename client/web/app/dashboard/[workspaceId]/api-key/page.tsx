import { columns, Payment } from "@/components/columns/api-key-columns"
import { DataTable } from "@/components/ui/data-table"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

export default async function ApikeyPage() {
  const data = await getData()

  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
