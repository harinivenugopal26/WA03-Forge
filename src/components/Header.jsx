import React from 'react';
import { Shield, Activity, Bell, Map, Key, Radio, AlertTriangle } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenApiKeyModal, apiKey }) {
  return (
    <header className="w-full bg-[#0F172A]/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('prediction')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-blue-500/20">
              <Shield className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0F172A] animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  FloodGuard <span className="text-blue-400 font-black">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest">
                  TN District Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Predict 24-48h Early • SMS Alert Pre-Flood • Offline GIS Maps
              </p>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('prediction')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'prediction'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden md:inline">Module 1:</span> Prediction
            </button>

            <button
              onClick={() => setActiveTab('alert')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 relative ${
                activeTab === 'alert'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="hidden md:inline">Module 2:</span> Alert Engine
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="hidden md:inline">Module 3:</span> GIS Map
            </button>
          </nav>

          {/* API Key Modal Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenApiKeyModal}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                apiKey
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
              title="Configure Claude / OpenWeather API Keys"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{apiKey ? 'Claude API Connected' : 'API Key Config'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
