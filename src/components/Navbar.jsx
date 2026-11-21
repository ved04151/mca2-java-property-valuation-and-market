import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from './ui';

export function Navbar({ onMobileMenuToggle }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'Valuation Completed',
      desc: 'DLF Camellias assessment generated ₹36.0 Cr estimate.',
      time: '12m ago',
      unread: true,
      type: 'success',
    },
    {
      id: 2,
      title: 'Market Index Update',
      desc: 'Gurugram Golf Course Rd average updated to ₹38,500/sq.ft',
      time: '1h ago',
      unread: true,
      type: 'info',
    },
    {
      id: 3,
      title: 'New Property Listing Added',
      desc: 'ATS Knightsbridge 5 BHK Villa added by Priya Mehra.',
      time: '3h ago',
      unread: false,
      type: 'default',
    },
  ];

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowQuickSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090f1d]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between">
      {/* Left side: Mobile menu & Quick Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Quick Search bar */}
        <form onSubmit={handleQuickSearchSubmit} className="relative hidden sm:block w-72 md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search NCR properties, localities, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder:text-slate-500 rounded-xl pl-9 pr-4 py-2 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
          />
        </form>
      </div>

      {/* Right side: status, notifications, profile */}
      <div className="flex items-center gap-3">
        {/* NCR Market Status indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Delhi NCR Index: <strong className="text-emerald-400 font-mono">+14.2% YoY</strong></span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#090f1d]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 text-slate-100 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  <Badge variant="default">2 New</Badge>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border transition ${
                      item.unread
                        ? 'bg-blue-950/20 border-blue-500/20'
                        : 'bg-slate-900/40 border-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-white">{item.title}</span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick User Avatar Badge */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 pl-2 cursor-pointer hover:opacity-85 transition"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt={user?.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/50"
          />
          <div className="hidden xl:block text-left">
            <span className="text-xs font-semibold text-white block leading-tight">{user?.name}</span>
            <span className="text-[10px] text-blue-400 block font-mono">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
