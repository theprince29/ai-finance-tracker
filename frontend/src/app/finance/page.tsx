"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SummaryCards } from "@/components/finance/summary-cards";
import { SpendingByCategory } from "@/components/finance/charts/spending-by-category";
import { CashflowTrend } from "@/components/finance/charts/cashflow-trend";
import { TransactionsTable } from "@/components/finance/transactions-table";
import { AddTransactionDialog } from "@/components/finance/add-transaction-dialog";
import useAuthStore from "@/store/useAuthstore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


// Mock data types
type Transaction = {
  id: string;
  date: string; // ISO
  description: string;
  category: string;
  amount: number; // negative = expense, positive = income
  account: string;
};

const initialTransactions: Transaction[] = [
  {
    id: "t1",
    date: "2025-08-01",
    description: "Paycheck - ACME Inc.",
    category: "Income",
    amount: 4200,
    account: "Checking",
  },
  {
    id: "t2",
    date: "2025-08-03",
    description: "Groceries - FreshMart",
    category: "Groceries",
    amount: -142.37,
    account: "Checking",
  },
  {
    id: "t3",
    date: "2025-08-05",
    description: "Rent - August",
    category: "Housing",
    amount: -1800,
    account: "Checking",
  },
  {
    id: "t4",
    date: "2025-08-06",
    description: "Coffee - Brew Co.",
    category: "Dining",
    amount: -6.25,
    account: "Credit",
  },
  {
    id: "t5",
    date: "2025-08-07",
    description: "Gas - FuelNow",
    category: "Transport",
    amount: -54.1,
    account: "Credit",
  },
  {
    id: "t6",
    date: "2025-08-08",
    description: "Electric - City Utilities",
    category: "Utilities",
    amount: -92.45,
    account: "Checking",
  },
  {
    id: "t7",
    date: "2025-08-10",
    description: "Dining - Pizzeria",
    category: "Dining",
    amount: -28.6,
    account: "Credit",
  },
  {
    id: "t8",
    date: "2025-08-11",
    description: "Freelance payment",
    category: "Income",
    amount: 750,
    account: "Checking",
  },
  {
    id: "t9",
    date: "2025-08-12",
    description: "Internet - FiberPlus",
    category: "Utilities",
    amount: -65,
    account: "Checking",
  },
  {
    id: "t10",
    date: "2025-08-15",
    description: "Cinema",
    category: "Entertainment",
    amount: -24,
    account: "Credit",
  },
];

// Allowed categories (UI-only)
const CATEGORIES = [
  "Income",
  "Groceries",
  "Dining",
  "Housing",
  "Transport",
  "Utilities",
  "Entertainment",
  "Other",
];

export default function FinancePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore() as {
    isAuthenticated: boolean;
    user: any;
    logout: () => void;
  };
  const hasUser = isAuthenticated;

  useEffect(() => {
    if (!hasUser) router.replace("/");
  }, [router, hasUser]);

  // Client-only, local state
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [account, setAccount] = useState<string>("all");
  const [view, setView] = useState<"all" | "income" | "expense">("all");

  // Derived computed values
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchQuery =
        !query ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase());

      const matchCategory = category === "all" || t.category === category;
      const matchAccount = account === "all" || t.account === account;
      const matchView =
        view === "all" ? true : view === "income" ? t.amount > 0 : t.amount < 0;

      return matchQuery && matchCategory && matchAccount && matchView;
    });
  }, [transactions, query, category, account, view]);

  const totals = useMemo(() => {
    const income = filtered
      .filter((t) => t.amount > 0)
      .reduce((a, b) => a + b.amount, 0);
    const expense = filtered
      .filter((t) => t.amount < 0)
      .reduce((a, b) => a + Math.abs(b.amount), 0);
    const net = income - expense;
    const savingsRate =
      income > 0
        ? Math.max(
            0,
            Math.min(100, Math.round(((income - expense) / income) * 100))
          )
        : 0;
    return { income, expense, net, savingsRate };
  }, [filtered]);

  // Chart data mappers (UI-only)
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((t) => {
      if (t.amount < 0) {
        map.set(t.category, (map.get(t.category) || 0) + Math.abs(t.amount));
      }
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const cashflow = useMemo(() => {
    // Group by date
    const map = new Map<string, number>();
    filtered.forEach((t) => {
      map.set(t.date, (map.get(t.date) || 0) + t.amount);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date: date.slice(5), value }));
  }, [filtered]);

  function handleAdd(tx: Omit<Transaction, "id">) {
    const id = "t" + (transactions.length + 1);
    setTransactions((prev) => [{ id, ...tx }, ...prev]);
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
      <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            Finance Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track income, expenses, and trends at a glance.
          </p>
        </div>
        {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback>
                  {user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
       
      </header>
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
        <div className="inline-flex rounded-md border p-1">
          <Button
            variant={view === "all" ? "default" : "ghost"}
            className={
              view === "all" ? "bg-blue-600 text-white hover:bg-blue-700" : ""
            }
            onClick={() => setView("all")}
          >
            All
          </Button>
          <Button
            variant={view === "income" ? "default" : "ghost"}
            className={
              view === "income"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : ""
            }
            onClick={() => setView("income")}
          >
            Income
          </Button>
          <Button
            variant={view === "expense" ? "default" : "ghost"}
            className={
              view === "expense"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : ""
            }
            onClick={() => setView("expense")}
          >
            Expense
          </Button>
        </div>
        <AddTransactionDialog categories={CATEGORIES} onAdd={handleAdd} />
      </div>
      </div>

      <SummaryCards
        net={totals.net}
        income={totals.income}
        expense={totals.expense}
        savingsRate={totals.savingsRate}
      />

      <section className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cashflow Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CashflowTrend data={cashflow} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <SpendingByCategory data={byCategory} />
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 md:mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by description or category"
                  className="max-w-sm"
                />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All accounts</SelectItem>
                    <SelectItem value="Checking">Checking</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="hidden md:inline-flex">
                  {filtered.length} results
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                    setAccount("all");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            <TransactionsTable rows={filtered} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
