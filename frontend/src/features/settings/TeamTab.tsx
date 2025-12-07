import { Shield } from 'lucide-react';

export const TeamTab = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-1">Team Members</h3>
                <p className="text-zinc-400 text-sm">Manage access and roles.</p>
            </div>
            
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-zinc-400 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">A</div>
                                    <div>
                                        <div className="font-medium text-white">System Admin</div>
                                        <div className="text-zinc-500 text-xs">admin@opendefender.io</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-medium">
                                    <Shield size={10} /> ADMIN
                                </span>
                            </td>
                            <td className="px-6 py-4 text-emerald-500">Active</td>
                        </tr>
                        {/* Placeholder pour d'autres users */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};