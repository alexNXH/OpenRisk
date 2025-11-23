import { create } from 'zustand';
import { api } from '../lib/api';

interface DashboardStats {
  total_risks: number;
  global_risk_score: number;
  high_risks: number;
  mitigated_risks: number;
  risks_by_severity: Record<string, number>;
}

interface DashboardStore {
  stats: DashboardStats | null;
  isLoading: boolean;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  isLoading: false,
  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/stats');
      set({ stats: response.data });
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));