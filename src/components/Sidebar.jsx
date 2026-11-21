import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Calculator,
  History,
  TrendingUp,
  FileText,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/formatters';

export function Sidebar({ collapsed, setCollapsed }) {
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Properties', icon: Building2, path: '/properties' },
    { label: 'Add Property', icon: PlusCircle, path: '/properties/new' },
    { label: 'Valuation Calculator', icon: Calculator, path: '/valuation' },
    { label: 'Valuation History', icon: History, path: '/history' },
    // { label: 'Market Analysis', icon: TrendingUp, path: '/market-analSysis' },
    { label: 'Reports & Export', icon: FileText, path: '/reports' },
  ];

  const adminItems = [
    { label: 'User Management', icon: Users, path: '/admin/users' },
  ];

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-[#0b1120] border-r border-slate-800/80 flex flex-col justify-between',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30 shrink-0">
              <Building className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
                  PropValuate <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono">NCR</span>
                </span>
                <span className="text-[11px] text-slate-400 truncate">Enterprise Real Estate</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
          <div className="px-3 pb-1 pt-2">
            {!collapsed && (
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Core Systems
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/properties'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group relative',
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  )
                }
              >
                <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="px-3 pt-4 pb-1">
                {!collapsed && (
                  <span className="text-[11px] font-semibold text-amber-500/80 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-amber-400" /> Administration
                  </span>
                )}
              </div>
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group relative',
                        isActive
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                      )
                    }
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </>
          )}

          <div className="px-3 pt-3">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group relative',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                )
              }
            >
              <Settings className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">Settings & Profile</span>}
            </NavLink>
          </div>
        </nav>
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between gap-2">
          <NavLink
            to="/settings"
            className="flex items-center gap-2.5 truncate hover:opacity-90 transition flex-1"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover border border-blue-500/40 shrink-0"
            />
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 capitalize truncate">{user?.role} • {user?.location || 'NCR'}</p>
              </div>
            )}
          </NavLink>
          {!collapsed && (
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
