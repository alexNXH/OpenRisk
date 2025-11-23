import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Bell, Search, Filter, LayoutDashboard, List as ListIcon } from 'lucide-react';

// Components
import { Sidebar } from './components/layout/Sidebar';
import { DashboardGrid } from './features/dashboard/DashboardGrid';
import { CreateRiskModal } from './features/risks/components/CreateRiskModal';
import { RiskDetails } from './features/risks/components/RiskDetails';
import { Button } from './components/ui/Button';
import { Drawer } from './components/ui/Drawer';

// Hooks & Types
import { useRiskStore, Risk } from './hooks/useRiskStore';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Pour future extension

  // Pré-chargement des données
  const { fetchRisks } = useRiskStore();
  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden font-sans selection:bg-primary/30">
      
      {/* 1. Sidebar Navigation (Gauche) */}
      <Sidebar />

      {/* 2. Main Content Area (Centre/Droite) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* --- HEADER FLOTTANT --- */}
        <header className="h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-20 sticky top-0">
          
          {/* Barre de Recherche (Linear Style) */}
          <div className="flex items-center gap-4">
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={14} className="text-zinc-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                    type="text" 
                    placeholder="Rechercher (risques, assets, IPs)..." 
                    className="bg-surface border border-white/5 pl-9 pr-3 py-1.5 rounded-md w-64 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 bg-zinc-800 rounded border border-zinc-700">⌘K</kbd>
                </div>
             </div>
             
             {/* Filtres Rapides */}
             <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-surface border border-white/5 hover:border-white/10 rounded-md transition-colors">
                <Filter size={12} />
                <span>Filtres</span>
             </button>
          </div>

          {/* Actions Droite */}
          <div className="flex items-center gap-4">
             <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-background"></span>
             </button>
             
             <div className="h-6 w-px bg-white/10 mx-1" />

             <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-blue-500/20">
                <Plus size={16} className="mr-2" /> Nouveau Risque
             </Button>
          </div>
        </header>

        {/* --- CONTENU SCROLLABLE --- */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
           
           {/* Titre de section */}
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                 <LayoutDashboard size={18} className="text-primary" />
                 Vue d'ensemble
              </h2>
              <div className="flex bg-surface rounded-lg p-1 border border-white/5">
                 <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                    <LayoutDashboard size={14} />
                 </button>
                 <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                    <ListIcon size={14} />
                 </button>
              </div>
           </div>

           {/* Grille des Widgets (Drag & Drop) */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="mb-12"
           >
              <DashboardGrid />
           </motion.div>

           {/* Liste des Risques (Section Interactive pour tester le Drawer) */}
           <section className="max-w-full pb-20">
               <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg font-bold text-white">Risques Récents</h3>
                   <button className="text-xs text-primary hover:text-blue-400 hover:underline">Voir tout l'historique</button>
               </div>
               
               {/* Utilisation du helper component RiskList */}
               <RiskList onRiskClick={(risk) => setSelectedRisk(risk)} />
           </section>
        </main>

      </div>

      {/* --- MODALES & OVERLAYS --- */}

      {/* 1. Modal de Création */}
      <CreateRiskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* 2. Drawer de Détails (Panel Latéral) */}
      <Drawer 
          isOpen={!!selectedRisk} 
          onClose={() => setSelectedRisk(null)}
          title={selectedRisk?.title || "Détails du Risque"}
      >
          {selectedRisk && <RiskDetails risk={selectedRisk} />}
      </Drawer>

    </div>
  );
}

// --- Helper Component: Risk List (Local pour l'instant) ---
// Affiche une grille de cartes cliquables pour chaque risque
const RiskList = ({ onRiskClick }: { onRiskClick: (r: Risk) => void }) => {
    const { risks, isLoading } = useRiskStore();

    if (isLoading && risks.length === 0) {
        return <div className="text-zinc-500 text-sm animate-pulse">Chargement des risques...</div>;
    }

    if (risks.length === 0) {
        return (
            <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
                Aucun risque détecté. Cliquez sur "Nouveau Risque" pour commencer.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {risks.map((risk, index) => (
                <motion.div 
                    key={risk.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onRiskClick(risk)} 
                    className="group bg-surface border border-border p-4 rounded-xl hover:border-primary/50 hover:shadow-glow cursor-pointer transition-all duration-200 relative overflow-hidden"
                >
                    {/* Indicateur de sévérité (Bordure gauche) */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        risk.score >= 20 ? 'bg-red-500' : 
                        risk.score >= 15 ? 'bg-orange-500' : 
                        risk.score >= 10 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />

                    <div className="pl-3">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-1 flex-wrap">
                                {risk.tags?.slice(0, 2).map(tag => (
                                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-white/5 text-zinc-400 rounded border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <span className={`font-mono font-bold text-sm ${
                                risk.score >= 15 ? 'text-red-400' : 'text-emerald-400'
                            }`}>
                                {risk.score}
                            </span>
                        </div>
                        
                        <h4 className="font-medium text-zinc-200 group-hover:text-primary transition-colors truncate pr-2">
                            {risk.title}
                        </h4>
                        
                        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                            <span>{risk.mitigations?.length || 0} actions</span>
                            <span>{new Date(risk.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default App;