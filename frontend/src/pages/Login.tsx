import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back to OpenRisk");
      navigate('/');
    } catch (err) {
      toast.error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10"
        >
            <div className="flex justify-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow">
                    <Zap className="text-white" fill="currentColor" />
                </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-white mb-2">Welcome back</h1>
            <p className="text-zinc-400 text-center mb-8 text-sm">Enter your credentials to access the secure vault.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                    label="Email" 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                />
                <Input 
                    label="Password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button className="w-full mt-4 group" isLoading={isLoading}>
                    Sign In <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-zinc-400">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:text-blue-400 font-medium transition-colors">
                Create one
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <Lock size={12} />
                <span>End-to-end encrypted connection</span>
            </div>
        </motion.div>
    </div>
  );
};