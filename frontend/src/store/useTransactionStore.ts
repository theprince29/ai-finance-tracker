import {create} from 'zustand';
import api from '../lib/api';

const useTransactionsStore = create((set) => ({
  transactions: [],
  summary: null,
  categories: [],
  
  fetchTransactions: async () => {
    try {
      const response = await api.get('/api/transactions');
      set({ transactions: response.data });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  },

  fetchSummary: async () => {
    try {
      const response = await api.get('/api/summary');
      set({ summary: response.data });
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  },

  fetchCategories: async () => {
    try {
      const response = await api.get('/api/categories');
      set({ categories: response.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  addTransaction: async (transactionData: any) => {
    try {
      const response = await api.post('/api/transactions', transactionData);
      set((state :any) => ({
        transactions: [response.data, ...state.transactions],
      }));
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  },

  updateTransaction: async (id: string, transactionData: any) => {
    try {
      await api.put(`/api/transactions/${id}`, transactionData);
      set((state :any) => ({
        transactions: state.transactions.map((tx :any) =>
          tx.id === id ? { ...tx, ...transactionData } : tx
        ),
      }));
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      set((state :any) => ({
        transactions: state.transactions.filter((tx :any) => tx.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  },
}));

export default useTransactionsStore;
