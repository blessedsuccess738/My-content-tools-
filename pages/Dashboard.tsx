import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Video, Plus, Clock, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Hello, {user?.name.split(' ')[0]}</h2>
          <p className="text-slate-400">Ready to create some magic today?</p>
        </div>
        <Link to="/create">
          <Button className="shadow-lg shadow-violet-500/20">
            <Plus size={20} />
            New Generation
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-violet-900/40 to-slate-800 border-violet-500/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Coin Balance</p>
              <h3 className="text-4xl font-bold text-white mt-2">{user?.coins.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-violet-500/20 rounded-lg text-violet-300">
              <Sparkles size={24} />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="secondary" className="w-full text-sm py-1">Top Up</Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Videos Generated</p>
              <h3 className="text-4xl font-bold text-white mt-2">12</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-300">
              <Video size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Hours Saved</p>
              <h3 className="text-4xl font-bold text-white mt-2">4.5</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg text-green-300">
              <Clock size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Recent Creations</h3>
          <Link to="/history" className="text-sm text-violet-400 hover:text-violet-300">View All</Link>
        </div>
        
        {/* Mock Empty State or Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Card className="group relative overflow-hidden aspect-[9/16] p-0 border-0">
             <img src="https://picsum.photos/400/600?random=10" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Thumbnail" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
               <span className="text-xs font-medium text-violet-300 mb-1">Afro Vibe</span>
               <h4 className="text-white font-bold">Cyberpunk Dancer</h4>
             </div>
           </Card>
           <Card className="group relative overflow-hidden aspect-[9/16] p-0 border-0">
             <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 group-hover:border-violet-500/50 transition-colors cursor-pointer">
               <Plus size={32} className="mb-2" />
               <span className="text-sm font-medium">Create New</span>
             </div>
           </Card>
        </div>
      </div>
    </div>
  );
};