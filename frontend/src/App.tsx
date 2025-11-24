import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { Search, Bell, Plus } from 'lucide-react';

// --- Imports Architecture ---
import { useAuthStore } from './hooks/useAuthStore';
import { useRiskStore, type Risk } from './hooks/useRiskStore';

// --- Imports UI Components ---
import { Button } from './components/ui/Button';
import { Drawer } from './components/ui/Drawer';
import { Sidebar } from './components/layout/Sidebar';

// --- Imports Features ---
import { Login } from './pages/Login';
import { DashboardGrid } from './features/dashboard/DashboardGrid';
import { CreateRiskModal } from './features/risks/components/CreateRiskModal';
import { RiskDetails } from './features/risks/components/RiskDetails';

// 🛡️ COMPOSANT DE PROTECTION DE ROUTE
// Si pas de token, on redirige vers /login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// 🏠 LAYOUT PRINCIPAL (Dashboard)
// Contient la Sidebar, le Header, et la zone de contenu
const DashboardLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const { risks } = useRiskStore(); // Pour la liste rapide en bas

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden font-sans selection:bg-primary/30">
      {/* 1. Sidebar Fixe */}
      <Sidebar />

      {/* 2. Zone de Contenu Principale */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER FLOTTANT (Glassmorphism) */}
        <header className="h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
          
          {/* Barre de Recherche (Style Linear) */}
          <div className="flex items-center gap-2 text-zinc-500 bg-surface border border-white/5 px-3 py-1.5 rounded-md w-64 focus-within:border-primary/50 focus-within:text-white transition-colors group">
            <Search size={14} className="group-focus-within:text-primary transition-colors" />
            <input 
                type="text" 
                placeholder="Search risks, assets..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600 font-medium"
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 bg-zinc-800 rounded border border-zinc-700">⌘K</kbd>
          </div>

          {/* Actions Droite */}
          <div className="flex items-center gap-4">
             <button className="relative text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-background"></span>
             </button>
             
             {/* Bouton Principal d'Action */}
             <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-blue-500/20">
                <Plus size={16} className="mr-2" /> New Risk
             </Button>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, ease: "easeOut" }}
             className="space-y-8 pb-20"
           >
              {/* Le Grid Drag & Drop */}
              <DashboardGrid />

              {/* Liste Rapide des Risques (Pour interaction Drawer) */}
              <div className="pt-8 border-t border-white/5">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
                  Derniers Risques Identifiés
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {risks.map((risk) => (
                    <div 
                      key={risk.id} 
                      onClick={() => setSelectedRisk(risk)}
                      className="group bg-surface border border-border p-4 rounded-xl hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex gap-2">
                            {risk.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] font-bold bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 border border-white/5">
                                {tag}
                              </span>
                            ))}
                         </div>
                         <div className={`text-sm font-mono font-bold ${
                            risk.score >= 15 ? 'text-red-500' : 'text-blue-500'
                         }`}>
                           {risk.score}
                         </div>
                      </div>
                      <h4 className="font-medium text-zinc-200 group-hover:text-primary transition-colors truncate">
                        {risk.title}
                      </h4>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                        <span>ID: {risk.id.slice(0, 8)}</span>
                        <span>•</span>
                        <span>{risk.source || 'MANUAL'}</span>
                      </div>
                    </div>
                  ))}
                  
                  {risks.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500 bg-surface/30 rounded-xl border border-dashed border-zinc-800">
                      Aucun risque pour le moment. Créez-en un ou attendez la synchronisation.
                    </div>
                  )}
                </div>
              </div>
           </motion.div>
        </main>
      </div>

      {/* --- MODALS & DRAWERS GLOBAUX --- */}
      
      {/* 1. Modal de Création */}
      <CreateRiskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* 2. Drawer de Détails & Mitigation */}
      <Drawer 
          isOpen={!!selectedRisk} 
          onClose={() => setSelectedRisk(null)}
          title={selectedRisk?.title || "Détails du Risque"}
      >
          {selectedRisk && <RiskDetails risk={selectedRisk} />}
      </Drawer>

    </div>
  );
};

// 🚀 ROOT APPLICATION
function App() {
  return (
    <BrowserRouter>
        <Routes>
            {/* Route Publique */}
            <Route path="/login" element={<Login />} />
            
            {/* Route Protégée (Application) */}
            <Route path="/" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Système de Notification Global */}
        <Toaster position="top-left" theme="dark" richColors closeButton />
    </BrowserRouter>
  );
}

export default App;