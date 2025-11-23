import { create } from 'zustand';
import { api } from '../lib/api';

export interface Risk {
  id: string;
  title: string;
  description: string;
  score: number;
  impact: number;
  probability: number;
  status: string;
  tags: string[];
}

interface RiskStore {
  risks: Risk[];
  isLoading: boolean;
  fetchRisks: () => Promise<void>;
}

export const useRiskStore = create<RiskStore>((set) => ({
  risks: [],
  isLoading: false,
  fetchRisks: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/risks');
      set({ risks: response.data });
    } catch (error) {
      console.error('Failed to fetch risks', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));