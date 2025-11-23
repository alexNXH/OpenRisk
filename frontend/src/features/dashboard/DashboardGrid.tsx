import { useMemo, useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { motion } from 'framer-motion';
import { Loader2, GripHorizontal, TrendingUp, AlertTriangle, FileText, Zap, Plus } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { GlobalScore } from './widgets/GlobalScore';
import { RiskHeatmap } from './widgets/RiskHeatmap';
import { useDashboardStore } from '../../hooks/useDashboardStore';
import { Button } from '../../components/ui/Button';


const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: 'score', x: 0, y: 0, w: 3, h: 4 },        // Score en haut à gauche
    { i: 'heatmap', x: 3, y: 0, w: 5, h: 4 },      // Heatmap au centre
    { i: 'stats', x: 8, y: 0, w: 4, h: 4 },        // Stats à droite
    { i: 'quick-actions', x: 0, y: 4, w: 12, h: 2 }, // Barre d'actions
    { i: 'trends', x: 0, y: 6, w: 8, h: 4 },       // Graphique tendances
    { i: 'top-risks', x: 8, y: 6, w: 4, h: 4 },    // Liste top risques
  ],
  md: [
    { i: 'score', x: 0, y: 0, w: 5, h: 4 },
    { i: 'stats', x: 5, y: 0, w: 5, h: 4 },
    { i: 'heatmap', x: 0, y: 4, w: 10, h: 4 },
    { i: 'quick-actions', x: 0, y: 8, w: 10, h: 2 },
    { i: 'trends', x: 0, y: 10, w: 10, h: 4 },
    { i: 'top-risks', x: 0, y: 14, w: 10, h: 4 },
  ],
  sm: [
    { i: 'score', x: 0, y: 0, w: 6, h: 4 },
    { i: 'stats', x: 0, y: 4, w: 6, h: 4 },
    { i: 'heatmap', x: 0, y: 8, w: 6, h: 4 },
    { i: 'quick-actions', x: 0, y: 12, w: 6, h: 2 },
  ]
};

// --- COMPOSANT WRAPPER (DESIGN SYSTEM) ---
// Crée l'effet "Glass" unifié pour tous les widgets + Handle de drag
const WidgetWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`h-full w-full bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl shadow-sm hover:shadow-glow hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col relative group ${className}`}>
    {/* Drag Handle : Visible uniquement au survol pour garder l'UI clean */}
    <div className="drag-handle absolute top-2 right-2 opacity-0 group-hover:opacity-100 cursor-move text-zinc-600 hover:text-white transition-opacity z-20 p-1 bg-zinc-900/50 rounded-md">
       <GripHorizontal size={14} />
    </div>
    {children}
  </div>
);

export const DashboardGrid = () => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const { stats, fetchStats, isLoading } = useDashboardStore();
  
  // Persistance localStorage pour le Drag & Drop
  const [layouts, setLayouts] = useState(() => {
    const saved = localStorage.getItem('opendefender-dashboard-layout');
    return saved ? JSON.parse(saved) : defaultLayouts;
  });

  // Chargement des données
  useEffect(() => {
    fetchStats();
    // Auto-refresh toutes les 30 sec pour effet "Live"
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Effet de Gamification au chargement si score excellent
  useEffect(() => {
    if (stats && stats.global_risk_score >= 90) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [stats]);

  const onLayoutChange = (_currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts);
    localStorage.setItem('opendefender-dashboard-layout', JSON.stringify(allLayouts));
  };

  // État de chargement initial
  if (isLoading && !stats) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-zinc-500 text-sm animate-pulse">Synchronisation avec OpenDefender Core...</p>
      </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={150} recycle={false} gravity={0.15} />}
      
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={onLayoutChange}
        isDraggable
        isResizable
        draggableHandle=".drag-handle" // IMPORTANT: Seul le handle permet de bouger le widget
        margin={[24, 24]} // Large spacing (Linear style)
      >
        
        {/* --- WIDGET 1: GLOBAL SCORE --- */}
        <div key="score">
          <WidgetWrapper>
            <GlobalScore score={stats?.global_risk_score || 100} />
          </WidgetWrapper>
        </div>

        {/* --- WIDGET 2: HEATMAP --- */}
        <div key="heatmap">
          <WidgetWrapper>
            <RiskHeatmap />
          </WidgetWrapper>
        </div>

        {/* --- WIDGET 3: KEY STATS --- */}
        <div key="stats">
          <WidgetWrapper>
             <div className="p-6 flex flex-col justify-center h-full relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
                
                <h3 className="text-zinc-500 text-[10px] uppercase font-bold mb-6 tracking-widest flex items-center gap-2">
                  <TrendingUp size={12} /> Vue d'ensemble
                </h3>
                
                <div className="space-y-5">
                    {/* Total */}
                    <div className="flex justify-between items-end group cursor-default">
                        <span className="text-zinc-400 text-sm font-medium group-hover:text-white transition-colors">Risques Identifiés</span>
                        <div className="text-right">
                          <span className="font-sans text-2xl font-bold text-white block leading-none">{stats?.total_risks || 0}</span>
                        </div>
                    </div>

                    {/* Critical */}
                    <div className="flex justify-between items-end group cursor-default">
                        <span className="text-zinc-400 text-sm font-medium group-hover:text-orange-400 transition-colors">Critiques / Hauts</span>
                        <div className="text-right">
                           <span className="font-sans text-2xl font-bold text-orange-500 block leading-none">{stats?.high_risks || 0}</span>
                        </div>
                    </div>

                    {/* Mitigated */}
                    <div className="flex justify-between items-end group cursor-default">
                        <span className="text-zinc-400 text-sm font-medium group-hover:text-emerald-400 transition-colors">Atténués</span>
                        <div className="text-right">
                           <span className="font-sans text-2xl font-bold text-emerald-500 block leading-none">{stats?.mitigated_risks || 0}</span>
                        </div>
                    </div>
                </div>
             </div>
          </WidgetWrapper>
        </div>

        {/* --- WIDGET 4: QUICK ACTIONS --- */}
        <div key="quick-actions">
           <WidgetWrapper>
             <div className="h-full flex items-center justify-around px-4 sm:px-10">
                {/* Action 1 */}
                <button className="flex flex-row items-center gap-4 group w-full justify-center p-2 rounded-xl hover:bg-white/5 transition-all">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all border border-blue-500/20 shadow-glow-sm">
                        <Plus size={20} />
                    </div>
                    <div className="text-left hidden sm:block">
                        <span className="block text-sm font-semibold text-zinc-200 group-hover:text-white">Créer</span>
                        <span className="block text-[10px] text-zinc-500">Nouveau risque</span>
                    </div>
                </button>

                <div className="w-px h-10 bg-white/5 mx-2" />

                {/* Action 2 */}
                <button className="flex flex-row items-center gap-4 group w-full justify-center p-2 rounded-xl hover:bg-white/5 transition-all">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all border border-purple-500/20">
                        <Zap size={20} />
                    </div>
                    <div className="text-left hidden sm:block">
                        <span className="block text-sm font-semibold text-zinc-200 group-hover:text-white">Scanner</span>
                        <span className="block text-[10px] text-zinc-500">Lancer audit auto</span>
                    </div>
                </button>

                <div className="w-px h-10 bg-white/5 mx-2" />

                {/* Action 3 */}
                <button className="flex flex-row items-center gap-4 group w-full justify-center p-2 rounded-xl hover:bg-white/5 transition-all">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all border border-emerald-500/20">
                        <FileText size={20} />
                    </div>
                    <div className="text-left hidden sm:block">
                        <span className="block text-sm font-semibold text-zinc-200 group-hover:text-white">Rapport</span>
                        <span className="block text-[10px] text-zinc-500">Exporter en PDF</span>
                    </div>
                </button>
             </div>
           </WidgetWrapper>
        </div>

         {/* --- WIDGET 5: TRENDS (Placeholder évolutif) --- */}
        <div key="trends">
          <WidgetWrapper>
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-2">
              <TrendingUp size={32} className="opacity-50" />
              <span className="text-xs font-medium uppercase tracking-wider">Tendances 30 Jours</span>
              <span className="text-[10px] text-zinc-700 bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800">Bientôt disponible</span>
            </div>
          </WidgetWrapper>
        </div>

        {/* --- WIDGET 6: TOP RISKS (Placeholder évolutif) --- */}
        <div key="top-risks">
          <WidgetWrapper>
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-2">
              <AlertTriangle size={32} className="opacity-50" />
              <span className="text-xs font-medium uppercase tracking-wider">Top 5 Critiques</span>
              <span className="text-[10px] text-zinc-700 bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800">Bientôt disponible</span>
            </div>
          </WidgetWrapper>
        </div>

      </ResponsiveGridLayout>
    </>
  );
};