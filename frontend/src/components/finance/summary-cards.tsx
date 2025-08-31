import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function SummaryCards({
  income,
  expense,
  net,
  savingsRate,
}: {
  income: number
  expense: number
  net: number
  savingsRate: number
}) {
  // Color system: primary blue, neutrals, accents: emerald (positive) and red (negative)
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatCard label="Net" value={net} accent="blue" />
      <StatCard label="Income" value={income} accent="emerald" />
      <StatCard label="Expenses" value={-expense} accent="red" />
      <StatCard label="Savings rate" value={savingsRate} suffix="%" accent="blue" format="percent" />
    </section>
  )
}

function StatCard({
  label,
  value,
  suffix,
  accent = "blue",
  format = "currency",
}: {
  label: string
  value: number
  suffix?: string
  accent?: "blue" | "emerald" | "red"
  format?: "currency" | "percent"
}) {
  const formatter =
    format === "currency"
      ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
      : new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })

  const color =
    accent === "blue"
      ? "text-blue-600 dark:text-blue-400"
      : accent === "emerald"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-red-600 dark:text-red-400"

  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn("mt-1 text-2xl font-semibold tracking-tight", color)}>
          {format === "currency" ? formatter.format(value) : `${formatter.format(value)}${suffix || ""}`}
        </p>
      </CardContent>
    </Card>
  )
}
