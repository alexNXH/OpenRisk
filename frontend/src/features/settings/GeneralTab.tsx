import { useAuthStore } from '../../hooks/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserLevelCard } from '../gamification/UserLevelCard';

export const GeneralTab = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">My Profile</h3>
        <p className="text-zinc-400 text-sm">Manage your personal information and track your progress.</p>
      </div>

      {/* Gamification Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-6">🎮 Your Gamification Profile</h4>
        <UserLevelCard />
      </div>

      {/* Profile Information Section */}
      <div className="space-y-6">
        <h4 className="text-lg font-bold text-white">Account Information</h4>

        <div className="flex items-center gap-6 pb-8 border-b border-white/5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-glow">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
             <Button variant="secondary">Change Avatar</Button>
             <p className="text-xs text-zinc-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        <form className="space-y-4 max-w-md">
          <Input label="Full Name" defaultValue={user?.full_name} />
          <Input label="Email Address" defaultValue={user?.email} disabled />
          <div className="pt-4">
              <Button>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};