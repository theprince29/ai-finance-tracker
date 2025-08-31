"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Row = {
  id: string
  date: string
  description: string
  category: string
  amount: number
  account: string
}

export function TransactionsTable({
  rows,
  onDelete,
}: {
  rows: Row[]
  onDelete?: (id: string) => void
}) {
  return (
    <Table>
      <TableCaption className="sr-only">Recent transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Account</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</TableCell>
            <TableCell className="max-w-[240px] truncate">{t.description}</TableCell>
            <TableCell>
              <Badge variant="outline">{t.category}</Badge>
            </TableCell>
            <TableCell>{t.account}</TableCell>
            <TableCell className="text-right">
              <span
                className={t.amount < 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}
              >
                {new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(t.amount)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onDelete?.(t.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
