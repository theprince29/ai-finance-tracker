"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type TransactionInput = {
  date: string
  description: string
  category: string
  amount: number
  account: string
}

export function AddTransactionDialog({
  categories,
  onAdd,
}: {
  categories: string[]
  onAdd: (tx: Omit<TransactionInput, never>) => void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<TransactionInput>({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    category: "Other",
    amount: 0,
    account: "Checking",
  })

  function submit() {
    if (!form.description) return
    onAdd({ ...form })
    setOpen(false)
    setForm({
      date: new Date().toISOString().slice(0, 10),
      description: "",
      category: "Other",
      amount: 0,
      account: "Checking",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">Add transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="desc">Description</Label>
            <Input
              id="desc"
              placeholder="e.g. Groceries - FreshMart"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid gap-1">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Negative for expense, positive for income"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
            />
          </div>

          <div className="grid gap-1">
            <Label>Account</Label>
            <Select value={form.account} onValueChange={(v) => setForm((f) => ({ ...f, account: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Checking">Checking</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} className="bg-emerald-600 text-white hover:bg-emerald-700">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
