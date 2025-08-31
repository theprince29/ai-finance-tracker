"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

// Strict palette: blue (primary), emerald (accent), slate (neutral)
const COLORS = ["#2563eb", "#10b981", "#64748b"]

export function SpendingByCategory({
  data,
}: {
  data: { name: string; value: number }[]
}) {
  const safe = data.length ? data : [{ name: "No data", value: 1 }]

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={safe}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={50}
            strokeWidth={2}
          >
            {safe.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
