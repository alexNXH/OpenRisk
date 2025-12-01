import { create } from 'zustand';
import { api } from '../lib/api';
import type { Asset } from './useAssetStore';

export interface Mitigation {
  id: string;
  title: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'DONE';
  progress: number;
  assignee?: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  score: number;
  impact: number;
  probability: number;
  status: string;
  tags: string[];
  assets?: Asset[]; // Important pour l'association Risk-Asset
  
  source: string; // Important pour l'étape d'intégration (THEHIVE, etc.)
  mitigations?: Mitigation[]; // Important pour le drawer de détails
}

interface RiskFetchParams {
  q?: string;
  status?: string;
  min_score?: number;
  max_score?: number;
  tag?: string;
}

interface RiskStore {
  risks: Risk[];
  isLoading: boolean;
  fetchRisks: (params?: RiskFetchParams) => Promise<void>;
}

// --- STORE ZUSTAND ---

export const useRiskStore = create<RiskStore>((set) => ({
  risks: [],
  isLoading: false,
  fetchRisks: async (params) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/risks', { params });
      set({ risks: response.data });
    } catch (error) {
      console.error('Failed to fetch risks', error);
      // In production, set an error state or show a toast
    } finally {
      set({ isLoading: false });
    }
  },
}));