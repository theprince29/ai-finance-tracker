import { create } from "zustand";
import api from "../lib/api";

// Transaction type
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

// Summary type (adjust to your API shape)
export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// Store state & actions
interface TransactionsState {
  transactions: Transaction[];
  summary: Summary | null;
  categories: string[];

  fetchTransactions: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  fetchCategories: () => Promise<void>;

  addTransaction: (transactionData: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (id: string, transactionData: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  summary: null,
  categories: [],

  fetchTransactions: async () => {
    try {
      const response = await api.get<Transaction[]>("/api/transactions");
      set({ transactions: response.data });
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  },

  fetchSummary: async () => {
    try {
      const response = await api.get<Summary>("/api/summary");
      set({ summary: response.data });
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    }
  },

  fetchCategories: async () => {
    try {
      const response = await api.get<string[]>("/api/categories");
      set({ categories: response.data });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },

  addTransaction: async (transactionData) => {
    try {
      const response = await api.post<Transaction>("/api/transactions", transactionData);
      set((state) => ({
        transactions: [response.data, ...state.transactions],
      }));
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  },

  updateTransaction: async (id, transactionData) => {
    try {
      await api.put(`/api/transactions/${id}`, transactionData);
      set((state) => ({
        transactions: state.transactions.map((tx) =>
          tx.id === id ? { ...tx, ...transactionData } : tx
        ),
      }));
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  },

  deleteTransaction: async (id) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  },
}));

export default useTransactionsStore;
