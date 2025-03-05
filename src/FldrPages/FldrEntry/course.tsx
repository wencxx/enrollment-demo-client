import { Payment, columns } from "@/components/FldrDatatable/columns"
import { DataTable } from "@/components/FldrDatatable/data-table"

export default function Course() {
    const data: Payment[] = [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
          },
    ]

  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  )
}
