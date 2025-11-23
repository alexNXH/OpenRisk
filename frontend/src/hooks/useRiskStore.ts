import { create } from 'zustand';
import { api } from '../lib/api';

// 1. Définition des Types (Alignés avec le Backend Go)

export interface Mitigation {
  id: string;
  risk_id: string;
  title: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'DONE';
  progress: number;
  assignee?: string;
  due_date?: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  
  // Scoring
  impact: number;
  probability: number;
  score: number; // Calculé par le backend
  
  // Metadonnées
  status: 'DRAFT' | 'ACTIVE' | 'MITIGATED' | 'ACCEPTED';
  tags: string[];
  owner?: string;
  
  // Relations
  mitigations?: Mitigation[]; // Le tableau optionnel pour le plan d'action
  
  created_at?: string;
}

// 2. Interface du Store Zustand

interface RiskStore {
  risks: Risk[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRisks: () => Promise<void>;
}

// 3. Implémentation du Store

export const useRiskStore = create<RiskStore>((set) => ({
  risks: [],
  isLoading: false,
  error: null,

  fetchRisks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Appel API vers le backend Go
      const response = await api.get<Risk[]>('/risks');
      
      // Mise à jour du state avec les données reçues
      set({ risks: response.data });
    } catch (error) {
      console.error('Failed to fetch risks:', error);
      set({ error: 'Impossible de charger les risques.' });
    } finally {
      set({ isLoading: false });
    }
  },
}));