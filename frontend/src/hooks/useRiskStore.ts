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

interface RiskStore {
  risks: Risk[];
  isLoading: boolean;
  fetchRisks: () => Promise<void>;
}

// --- STORE ZUSTAND ---

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
      // En prod, on pourrait gérer un état d'erreur ici
    } finally {
      set({ isLoading: false });
    }
  },
}));