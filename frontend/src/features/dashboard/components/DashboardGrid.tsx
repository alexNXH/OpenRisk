import React, { useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Server, TrendingUp, AlertTriangle, ChevronRight, Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRiskStore } from '../../../hooks/useRiskStore';
import { useAssetStore } from '../../../hooks/useAssetStore'; // Assurez-vous d'avoir ce store
import { RiskMatrix } from './RiskMatrix'; // Le composant de la Matrice 5x5
import { useAuthStore } from '../../../hooks/useAuthStore'; // Pour afficher le nom de l'utilisateur

// Composant générique pour les Widgets
interface WidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

const Widget: React.FC<WidgetProps> = ({ title, children, className = '', padding = 'p-6' }) => (
  <div className={`rounded-xl border border-border bg-surface shadow-lg ${className}`}>
    <div className={`text-lg font-semibold text-white mb-4 ${padding}`}>{title}</div>
    <div className={padding}>
        {children}
    </div>
  </div>
);

// Composant pour les cartes de Statistiques Rapides
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color = 'text-blue-400' }) => (
  <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-white/5 transition-colors hover:bg-zinc-900">
    <div className="flex items-center">
      <div className={`p-2 rounded-full ${color}/20 mr-3`}>
        <Icon size={18} className={color} />
      </div>
      <div>
        <div className="text-zinc-400 text-xs uppercase tracking-wider">{label}</div>
        <div className="text-white text-xl font-bold">{value}</div>
      </div>
    </div>
    <ChevronRight size={16} className="text-zinc-600" />
  </div>
);


// =================================================================
// Le Composant Principal : DashboardGrid
// =================================================================

export const DashboardGrid: React.FC = () => {
  const { risks, fetchRisks, isLoading: isRisksLoading } = useRiskStore();
  const { assets, fetchAssets, isLoading: isAssetsLoading } = useAssetStore();
  const { user } = useAuthStore();
  
  // Stats rapides (Calculé ou Mocké pour l'exemple)
  const totalRisks = risks.length;
  const criticalRisks = risks.filter(r => r.score >= 15).length;
  const mitigatedCount = risks.filter(r => r.status === 'MITIGATED').length;
  const totalMitigations = risks.reduce((acc, r) => acc + (r.mitigations?.length || 0), 0);
  
  // Top 5 des risques non mitigés
  const topRisks = [...risks]
    .filter(r => r.status !== 'MITIGATED' && r.status !== 'CLOSED')
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  useEffect(() => {
    fetchRisks();
    fetchAssets();
    // On ne fetch pas la matrice ici, elle se gère elle-même (meilleure modularité)
  }, [fetchRisks, fetchAssets]);

  const welcomeMessage = `Welcome back, ${user?.full_name || user?.email || 'Admin'}.`;
  
  if (isRisksLoading || isAssetsLoading) {
      return (
          <div className="flex justify-center items-center h-[50vh] text-zinc-500">
              <Loader2 className="animate-spin mr-3" size={32} /> Loading OpenRisk data...
          </div>
      );
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="p-8 space-y-8 h-full overflow-y-auto"
    >
        {/* Header de Bienvenue */}
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Zap className="text-primary" size={28} /> {welcomeMessage}
            </h1>
            <Link to="/assets" className="text-sm text-zinc-400 hover:text-primary transition-colors flex items-center">
                <Server size={14} className="mr-1" /> View Asset Inventory <ChevronRight size={16} />
            </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">

            {/* 1. Matrice des Risques (Grande zone d'affichage) */}
            <Widget title="Risk Matrix" className="col-span-12 lg:col-span-7 bg-surface p-0">
               {/* Note: RiskMatrix gère le fetch de /stats/risk-matrix lui-même */}
               <RiskMatrix />
            </Widget>

            {/* 2. Indicateurs Clés (Stats Rapides) */}
            <Widget title="Key Indicators" className="col-span-12 lg:col-span-5 space-y-4">
                <StatCard 
                    label="Risques Critiques (Score >= 15)" 
                    value={criticalRisks} 
                    icon={AlertTriangle} 
                    color="text-red-400" 
                />
                <StatCard 
                    label="Total Risques Actifs" 
                    value={totalRisks} 
                    icon={ShieldAlert} 
                    color="text-yellow-400" 
                />
                <StatCard 
                    label="Risques Mitigés" 
                    value={`${mitigatedCount} / ${totalRisks}`} 
                    icon={CheckCircle2} 
                    color="text-emerald-400" 
                />
                <StatCard 
                    label="Total Assets Inventoriés" 
                    value={assets.length} 
                    icon={Server} 
                    color="text-blue-400" 
                />
            </Widget>

            {/* 3. Top Risques (Liste détaillée) */}
            <Widget title="Top 5 Unmitigated Risks" className="col-span-12 lg:col-span-12">
                {topRisks.length > 0 ? (
                    <div className="space-y-3">
                        {topRisks.map((risk) => (
                            <Link 
                                to={`/?riskId=${risk.id}`} 
                                key={risk.id} 
                                className="flex justify-between items-center p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <TrendingUp size={16} className="text-red-500" />
                                    <span className="font-medium text-white">{risk.title}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded border ${risk.score >= 15 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                        SCORE: {risk.score}
                                    </span>
                                    <ChevronRight size={16} className="text-zinc-600" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-zinc-500 text-center py-4 border-t border-white/5 mt-4">No active risks found. Time to assess!</div>
                )}
            </Widget>
            
            {/* 4. Placeholder pour l'évolution des Mitigations ou Assets */}
            <Widget title="Mitigation Progress Overview" className="col-span-12 lg:col-span-6 h-64">
                <div className="flex justify-center items-center h-full text-zinc-500">
                    [Placeholder graphique : Courbe d'évolution des Mitigations Complétées]
                </div>
            </Widget>

            {/* 5. Placeholder pour la distribution des Assets */}
            <Widget title="Asset Criticality Distribution" className="col-span-12 lg:col-span-6 h-64">
                <div className="flex justify-center items-center h-full text-zinc-500">
                    [Placeholder graphique : Pie Chart des Assets par niveau de Criticité]
                </div>
            </Widget>

        </div>
    </motion.div>
  );
};