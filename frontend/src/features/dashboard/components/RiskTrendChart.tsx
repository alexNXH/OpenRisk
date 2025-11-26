import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../../lib/api';
import { Loader2 } from 'lucide-react';

interface TrendPoint {
  date: string;
  score: number;
}

export const RiskTrendChart = () => {
  const [data, setData] = useState<TrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/stats/trends')
       .then(res => setData(res.data))
       .catch(console.error)
       .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-zinc-600" /></div>;

  return (
    <div className="h-full w-full p-4 flex flex-col">
      <div className="mb-4">
          <h3 className="text-lg font-bold text-white">Security Posture Trend</h3>
          <p className="text-xs text-zinc-400">Evolution du score global (30 jours)</p>
      </div>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
                dataKey="date" 
                stroke="#52525b" 
                tick={{fontSize: 10}} 
                tickFormatter={(val) => val.slice(8)} // Affiche juste le jour
                axisLine={false}
                tickLine={false}
            />
            <YAxis 
                hide 
                domain={['dataMin - 10', 'dataMax + 10']} // Auto scale
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
            />
            <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};