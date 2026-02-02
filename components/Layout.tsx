import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Video, 
  History, 
  Settings, 
  LogOut, 
  Coins,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <NavLink
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-violet-600/10 text-violet-400 border border-violet-600/20' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/95 fixed h-full z-20">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 brand-font">
            DANCEGEN
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/create" icon={Video} label="Create Video" />
          <NavItem to="/history" icon={History} label="My Videos" />
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-slate-800">
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Admin</p>
              <NavItem to="/admin" icon={ShieldCheck} label="Admin Panel" />
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-slate-800 rounded-lg">
            <Coins className="text-yellow-400" size={16} />
            <span className="font-mono font-bold text-yellow-400">{user?.coins.toLocaleString()}</span>
            <span className="text-xs text-slate-400">Coins</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full z-30 bg-slate-900 border-b border-slate-800 flex items-center justify-between p-4">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 brand-font">
          DANCEGEN
        </h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-100">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-slate-900 pt-20 px-4 md:hidden">
           <nav className="space-y-2">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/create" icon={Video} label="Create Video" />
            <NavItem to="/history" icon={History} label="My Videos" />
            {isAdmin && <NavItem to="/admin" icon={ShieldCheck} label="Admin Panel" />}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-400 bg-red-400/10 rounded-lg mt-8"
            >
              <LogOut size={20} />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:pl-64 pt-20 md:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};