import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import { User, SystemStats } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Video, DollarSign, Ban, RefreshCw, CheckCircle } from 'lucide-react';

export const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([
        mockApi.getStats(),
        mockApi.getAllUsers()
      ]);
      setStats(s);
      setUsers(u);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const handleBan = async (userId: string, currentStatus: boolean) => {
    await mockApi.banUser(userId, !currentStatus);
    loadData();
  };

  const handleAddCoins = async (userId: string) => {
    await mockApi.addCoins(userId, 500);
    loadData();
  };

  if (!isAdmin) return <div className="text-center mt-20 text-red-500">Access Denied</div>;
  if (loading) return <div className="text-center mt-20">Loading Admin Panel...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white brand-font">Admin Dashboard</h2>
        <Button variant="secondary" onClick={loadData}><RefreshCw size={18} /> Refresh</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-violet-500">
          <div className="flex justify-between items-center">
             <div>
               <p className="text-slate-400 text-sm">Total Users</p>
               <h3 className="text-3xl font-bold">{stats?.totalUsers}</h3>
             </div>
             <Users className="text-violet-500" size={32} />
          </div>
        </Card>
        <Card className="border-l-4 border-l-fuchsia-500">
          <div className="flex justify-between items-center">
             <div>
               <p className="text-slate-400 text-sm">Total Videos</p>
               <h3 className="text-3xl font-bold">{stats?.totalVideos}</h3>
             </div>
             <Video className="text-fuchsia-500" size={32} />
          </div>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <div className="flex justify-between items-center">
             <div>
               <p className="text-slate-400 text-sm">Coins Spent</p>
               <h3 className="text-3xl font-bold">{stats?.totalCoinsSpent}</h3>
             </div>
             <DollarSign className="text-yellow-500" size={32} />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Weekly Generations">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.dailyActivity}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="generations" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="New Users Growth">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.dailyActivity}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="newUsers" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* User Table */}
      <Card title="User Management">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700 text-slate-400 uppercase">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Coins</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-white">{u.name}</div>
                    <div className="text-slate-500">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-700 text-slate-300'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-yellow-400">{u.coins}</td>
                  <td className="p-4">
                    {u.isBanned ? (
                      <span className="text-red-400 flex items-center gap-1 font-semibold"><Ban size={14} /> Banned</span>
                    ) : (
                      <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2 flex justify-end items-center">
                    <button 
                      onClick={() => handleAddCoins(u.id)}
                      className="px-2 py-1 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded text-xs transition-colors"
                    >
                      +500 Coins
                    </button>
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleBan(u.id, u.isBanned)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          u.isBanned 
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        }`}
                      >
                        {u.isBanned ? 'Unban User' : 'Ban User'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};