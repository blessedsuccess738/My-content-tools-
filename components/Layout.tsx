import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home,
  Wand2,
  Library,
  FolderOpen,
  Bell,
  User as UserIcon,
  Crown,
  LayoutDashboard,
  Video,
  History,
  ShieldCheck,
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from './ui/Button';

export const Layout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    
    return (
      <div
        onClick={() => navigate(to)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
          isActive 
            ? 'bg-gradient-to-r from-violet-600/20 to-violet-600/10 text-violet-300 font-medium' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
        }`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-black text-slate-100 font-sans selection:bg-violet-500/30">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r border-slate-800/50 bg-black fixed h-full z-20 p-4">
        <div className="px-4 py-4 mb-6 flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold brand-font text-xl shadow-lg shadow-violet-500/20">
             <Wand2 size={20} className="text-white" />
           </div>
           <span className="text-xl font-bold text-white brand-font tracking-tight">SUCCESS_AI</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem to="/dashboard" icon={Home} label="Home" />
          <NavItem to="/create" icon={Wand2} label="AI Tools" />
          <NavItem to="/history" icon={Library} label="Library" />
          <div className="my-4 border-t border-slate-800/50"></div>
          {isAdmin && <NavItem to="/admin" icon={ShieldCheck} label="Admin" />}
          <NavItem to="/profile" icon={UserIcon} label="Profile" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800/50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700/50 mb-4">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">Credits</span>
                <span className="text-xs font-bold text-yellow-400">{user?.coins}</span>
             </div>
             <div className="w-full bg-slate-700 rounded-full h-1.5 mb-3">
                <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '40%' }}></div>
             </div>
             <Button variant="primary" className="w-full text-xs h-8 bg-gradient-to-r from-violet-600 to-indigo-600 border-0">Upgrade Plan</Button>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-slate-500 hover:text-red-400 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-72 min-h-screen pb-20 md:pb-0 relative bg-black">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-slate-800/50 px-4 py-3 md:px-8 flex items-center justify-between">
           {/* Mobile Logo */}
           <div className="md:hidden flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold brand-font shadow-lg shadow-violet-500/20">
               <Wand2 size={18} className="text-white" />
             </div>
             <span className="font-bold text-lg brand-font">SUCCESS_AI</span>
           </div>

           {/* Desktop Search Bar Mock */}
           <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-full px-4 py-2 w-96 text-sm text-slate-400">
              <Wand2 size={14} className="mr-2" />
              <span>Try "Cinematic trailer..."</span>
           </div>

           {/* Right Actions */}
           <div className="flex items-center gap-3">
              <Button className="hidden md:flex h-9 px-4 rounded-full bg-green-500 hover:bg-green-400 text-slate-900 font-bold text-sm items-center gap-1 shadow-[0_0_15px_rgba(34,197,94,0.3)] border-0">
                <Crown size={14} fill="currentColor" /> Upgrade
              </Button>
              <Button className="md:hidden h-8 px-3 rounded-full bg-green-500 hover:bg-green-400 text-slate-900 font-bold text-xs flex items-center gap-1 shadow-lg border-0">
                <Crown size={12} fill="currentColor" /> Pro
              </Button>

              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black"></span>
              </button>
              
              <div onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:ring-2 hover:ring-violet-500/50 transition-all">
                 {user?.name.charAt(0)}
              </div>
           </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-slate-800 z-50 pb-safe">
        <div className="grid grid-cols-4 h-16">
          <div onClick={() => navigate('/dashboard')} className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${location.pathname === '/dashboard' ? 'text-violet-400' : 'text-slate-500'}`}>
            <Home size={22} strokeWidth={location.pathname === '/dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Home</span>
          </div>
          <div onClick={() => navigate('/create')} className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${location.pathname === '/create' ? 'text-violet-400' : 'text-slate-500'}`}>
            <Wand2 size={22} strokeWidth={location.pathname === '/create' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Tools</span>
          </div>
          <div onClick={() => navigate('/history')} className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${location.pathname === '/history' ? 'text-violet-400' : 'text-slate-500'}`}>
            <Library size={22} strokeWidth={location.pathname === '/history' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Library</span>
          </div>
          <div onClick={() => navigate('/profile')} className={`flex flex-col items-center justify-center gap-1 cursor-pointer ${location.pathname === '/profile' ? 'text-violet-400' : 'text-slate-500'}`}>
            <UserIcon size={22} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Profile</span>
          </div>
        </div>
      </nav>
    </div>
  );
};