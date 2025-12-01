export interface Risk {
  id: string;
  title: string;
  description?: string;
  score: number;
  impact: number;
  probability: number;
  status: string;
  tags?: string[];
  frameworks?: string[];
  source?: string;
  custom_fields?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export type PartialRisk = Partial<Risk> & { id?: string };
