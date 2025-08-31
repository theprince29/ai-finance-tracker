"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil, Filter, LogOut, Link } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type TxType = "income" | "expense";
type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: TxType;
  category: string;
  date: string; // ISO
};

const CATEGORY_COLORS: Record<string, string> = {
  Income: "#10b981",
  Groceries: "#0ea5e9",
  "Food & Drink": "#2563eb",
  Transportation: "#f97316",
  Subscriptions: "#a855f7",
  Shopping: "#f59e0b",
  Entertainment: "#ef4444",
  Electronics: "#22c55e",
  Other: "#6b7280",
};

const DEFAULT_TESTS = [
  "Coffee at Starbucks $6.50",
  "Gas station $40",
  "Amazon purchase $89.99",
  "Monthly salary $4500",
  "Dinner at Italian restaurant $65",
  "Netflix subscription $15.99",
  "Grocery shopping at Whole Foods $120",
  "Uber ride to airport $28",
];

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) setState(JSON.parse(raw));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState] as const;
}

function categorize(desc: string): { category: string; type: TxType } {
  const d = desc.toLowerCase();
  if (/(salary|paycheck|income|bonus|deposit)/.test(d))
    return { category: "Income", type: "income" };
  if (/(coffee|starbucks|restaurant|dinner|lunch|food)/.test(d))
    return { category: "Food & Drink", type: "expense" };
  if (/(grocery|whole foods|supermarket)/.test(d))
    return { category: "Groceries", type: "expense" };
  if (/(uber|lyft|gas|station|fuel|bus|train)/.test(d))
    return { category: "Transportation", type: "expense" };
  if (/(netflix|spotify|subscription|prime)/.test(d))
    return { category: "Subscriptions", type: "expense" };
  if (/(amazon|purchase|shopping|mall)/.test(d))
    return { category: "Shopping", type: "expense" };
  if (/(movie|game|concert|entertainment)/.test(d))
    return { category: "Entertainment", type: "expense" };
  if (/(samsung watch|watch|electronics|phone|tablet)/.test(d))
    return { category: "Electronics", type: "expense" };
  return { category: "Other", type: "expense" };
}

function parseFreeform(input: string) {
  const amountMatch = input.match(
    /[-+]?\$?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/
  );
  const amount = amountMatch
    ? Number(String(amountMatch[1]).replace(/,/g, ""))
    : 0;
  const { category, type } = categorize(input);
  const description =
    input.replace(/\$?\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?/, "").trim() ||
    "Transaction";
  return { description, amount, category, type };
}

function currency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "txs",
    []
  );
  const [freeform, setFreeform] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [draft, setDraft] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<"all" | TxType>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Seed demo data once
    if (transactions.length === 0) {
      const seed = DEFAULT_TESTS.map((t, i) => {
        const parsed = parseFreeform(t);
        return {
          id: crypto.randomUUID(),
          description: parsed.description,
          amount:
            parsed.type === "expense"
              ? -Math.abs(parsed.amount)
              : Math.abs(parsed.amount),
          type: parsed.type,
          category: parsed.category,
          date: new Date(Date.now() - i * 86400000).toISOString(),
        } as Transaction;
      });
      setTransactions(seed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income, expenses, savings: income - expenses };
  }, [transactions]);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of transactions.filter((t) => t.type === "expense")) {
      map[t.category] = (map[t.category] ?? 0) + Math.abs(t.amount);
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const byMonth = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    for (const t of transactions) {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      if (!map[key]) map[key] = { income: 0, expense: 0 };
      if (t.type === "income") map[key].income += Math.abs(t.amount);
      else map[key].expense += Math.abs(t.amount);
    }
    return Object.entries(map)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, vals]) => ({ month, ...vals }));
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (filterType === "all" ? true : t.type === filterType))
      .filter((t) =>
        filterCategory === "all" ? true : t.category === filterCategory
      )
      .filter((t) =>
        search
          ? t.description.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [transactions, filterType, filterCategory, search]);

  const openConfirm = () => {
    const parsed = parseFreeform(freeform);
    const tx: Transaction = {
      id: crypto.randomUUID(),
      description: parsed.description,
      amount:
        parsed.type === "expense"
          ? -Math.abs(parsed.amount)
          : Math.abs(parsed.amount),
      type: parsed.type,
      category: parsed.category,
      date: new Date().toISOString(),
    };
    setDraft(tx);
    setConfirmOpen(true);
  };

  const confirmAdd = () => {
    if (!draft) return;
    setTransactions([draft, ...transactions]);
    setDraft(null);
    setFreeform("");
    setConfirmOpen(false);
  };

  const removeTx = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const updateTx = (updated: Transaction) => {
    setTransactions(
      transactions.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const signOut = () => {
    localStorage.removeItem("mockUser");
    window.location.href = "/";
  };

  const categories = useMemo(
    () => ["all", ...Object.keys(CATEGORY_COLORS)],
    []
  );

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
              Finance Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track income, expenses, and trends at a glance.
            </p>
          </div>

          {/* <div className="flex items-center gap-2">
                <div className="inline-flex rounded-md border p-1">
                  <Button
                    variant={view === "all" ? "default" : "ghost"}
                    className={view === "all" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                    onClick={() => setView("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={view === "income" ? "default" : "ghost"}
                    className={view === "income" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                    onClick={() => setView("income")}
                  >
                    Income
                  </Button>
                  <Button
                    variant={view === "expense" ? "default" : "ghost"}
                    className={view === "expense" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                    onClick={() => setView("expense")}
                  >
                    Expense
                  </Button>
                </div>
                <AddTransactionDialog categories={CATEGORIES} onAdd={handleAdd} />
              </div> */}
        </header>
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Income
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-emerald-600">
              {currency(totals.income)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-red-600">
              {currency(totals.expenses)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Savings
              </CardTitle>
            </CardHeader>
            <CardContent
              className={`text-2xl font-semibold ${
                totals.savings >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {currency(totals.savings)}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ReTooltip />
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={85}
                  >
                    {byCategory.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={CATEGORY_COLORS[entry.name] ?? "#6b7280"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-sm">Cashflow Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={byMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ReTooltip />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Add Transaction (Natural Language)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 md:flex-row">
                <Input
                  placeholder='e.g. "Coffee at Starbucks $6.50"'
                  value={freeform}
                  onChange={(e) => setFreeform(e.target.value)}
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={openConfirm}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {DEFAULT_TESTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFreeform(s)}
                    className="rounded border px-2 py-1 hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-sm">Transactions</CardTitle>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={filterType}
                    onValueChange={(v: "all" | TxType) => setFilterType(v)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterCategory}
                    onValueChange={(v) => setFilterCategory(v)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
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
                <Input
                  placeholder="Search description..."
                  className="md:w-[260px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list">
                <TabsList>
                  <TabsTrigger value="list">List</TabsTrigger>
                  <TabsTrigger value="compact">Compact</TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                  <div className="mt-4 divide-y">
                    {filtered.map((t) => (
                      <TxRow
                        key={t.id}
                        t={t}
                        onDelete={() => removeTx(t.id)}
                        onUpdate={updateTx}
                      />
                    ))}
                    {filtered.length === 0 && (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        No transactions match your filters.
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="compact">
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((t) => (
                      <Card key={t.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">
                              {t.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(t.date).toLocaleDateString()} •{" "}
                              {t.category}
                            </div>
                          </div>
                          <div
                            className={`text-sm font-semibold ${
                              t.type === "income"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {t.type === "income" ? "+" : "-"}
                            {currency(Math.abs(t.amount))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Description</Label>
                  <Input
                    value={draft?.description ?? ""}
                    onChange={(e) =>
                      setDraft((d) =>
                        d ? { ...d, description: e.target.value } : d
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={draft ? Math.abs(draft.amount) : ""}
                    onChange={(e) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              amount:
                                (d!.type === "expense" ? -1 : 1) *
                                Math.abs(Number(e.target.value || 0)),
                            }
                          : d
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={draft?.type}
                    onValueChange={(v: TxType) =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              type: v,
                              amount:
                                v === "expense"
                                  ? -Math.abs(d.amount)
                                  : Math.abs(d.amount),
                            }
                          : d
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={draft?.category}
                    onValueChange={(v) =>
                      setDraft((d) => (d ? { ...d, category: v } : d))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(CATEGORY_COLORS).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={confirmAdd}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

function TxRow({
  t,
  onDelete,
  onUpdate,
}: {
  t: Transaction;
  onDelete: () => void;
  onUpdate: (t: Transaction) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{t.description}</span>
          <Badge variant="secondary" className="hidden md:inline">
            {t.category}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(t.date).toLocaleDateString()} • {t.type}
        </div>
      </div>
      <div
        className={`w-32 text-right text-sm font-semibold ${
          t.type === "income" ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {t.type === "income" ? "+" : "-"}
        {currency(Math.abs(t.amount))}
      </div>
      <div className="ml-3 flex items-center gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit transaction</DialogTitle>
            </DialogHeader>
            <TxEditor
              value={t}
              onChange={onUpdate}
              onClose={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <Button
          size="icon"
          variant="ghost"
          onClick={onDelete}
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
}

function TxEditor({
  value,
  onChange,
  onClose,
}: {
  value: Transaction;
  onChange: (t: Transaction) => void;
  onClose: () => void;
}) {
  const [edit, setEdit] = useState<Transaction>(value);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Description</Label>
          <Input
            value={edit.description}
            onChange={(e) => setEdit({ ...edit, description: e.target.value })}
          />
        </div>
        <div>
          <Label>Amount</Label>
          <Input
            type="number"
            step="0.01"
            value={Math.abs(edit.amount)}
            onChange={(e) =>
              setEdit({
                ...edit,
                amount:
                  (edit.type === "expense" ? -1 : 1) *
                  Math.abs(Number(e.target.value || 0)),
              })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select
            value={edit.type}
            onValueChange={(v: TxType) =>
              setEdit({
                ...edit,
                type: v,
                amount:
                  v === "expense"
                    ? -Math.abs(edit.amount)
                    : Math.abs(edit.amount),
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={edit.category}
            onValueChange={(v) => setEdit({ ...edit, category: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CATEGORY_COLORS).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            onChange(edit);
            onClose();
          }}
        >
          Save
        </Button>
      </DialogFooter>
    </div>
  );
}
