import { useEffect } from 'react';
import { useRiskStore } from './hooks/useRiskStore';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, RefreshCw } from 'lucide-react';

function App() {
  const { risks, fetchRisks, isLoading } = useRiskStore();

  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  return (
    <div className="min-h-screen bg-background text-white p-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            OpenRisk
          </h1>
          <p className="text-zinc-400 mt-1">OpenDefender Risk Management</p>
        </div>
        <button 
          onClick={() => fetchRisks()}
          className="p-2 bg-surface border border-border rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </header>

      {/* Stats Rapides */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border p-6 rounded-xl">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <ShieldAlert size={20} /> Total Risks
          </div>
          <div className="text-4xl font-bold text-white">{risks.length}</div>
        </div>
      </div>

      {/* Liste des Risques */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4">
        {risks.map((risk) => (
          <motion.div 
            key={risk.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border p-6 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-2 mb-2">
                  {risk.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-zinc-800 text-zinc-400 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {risk.title}
                </h3>
                <p className="text-zinc-500 mt-1">{risk.description}</p>
              </div>

              {/* Score Badge */}
              <div className="flex flex-col items-end">
                <div className={`text-2xl font-bold ${
                  risk.score >= 20 ? 'text-risk-critical' : 
                  risk.score >= 15 ? 'text-risk-high' : 
                  risk.score >= 10 ? 'text-risk-medium' : 'text-risk-low'
                }`}>
                  {risk.score}
                </div>
                <div className="text-xs text-zinc-500 uppercase font-mono mt-1">Risk Score</div>
              </div>
            </div>
          </motion.div>
        ))}

        {risks.length === 0 && !isLoading && (
          <div className="text-center py-20 text-zinc-500">
            Aucun risque détecté. Tout est calme... pour l'instant.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;