import React from 'react';
import { Wifi, WifiOff, Zap, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export default function OfflineBanner({ networkMode, setNetworkMode, lastCachedTime, cachedLogCount }) {
  return (
    <div className="w-full bg-[#0d1527] border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md z-30">
      {/* Network Status Selector & Indicator */}
      <div className="flex items-center space-x-3">
        <span className="text-slate-400 font-semibold tracking-wider uppercase text-[11px] flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
          Network Status:
        </span>

        {/* Connection Mode Badges */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setNetworkMode('LIVE')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              networkMode === 'LIVE'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            [● LIVE] Full
          </button>

          <button
            onClick={() => setNetworkMode('LIMITED')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              networkMode === 'LIMITED'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            [● LIMITED] 2G
          </button>

          <button
            onClick={() => setNetworkMode('OFFLINE')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              networkMode === 'OFFLINE'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            [● OFFLINE] Cached
          </button>
        </div>
      </div>

      {/* Mode Capabilities Notice & Timestamp */}
      <div className="flex items-center space-x-4 text-slate-300">
        {networkMode === 'OFFLINE' ? (
          <div className="flex items-center space-x-3 text-red-300 bg-red-950/40 px-3 py-1 rounded border border-red-900/50">
            <span className="flex items-center gap-1 font-medium">
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              OFFLINE — Reading IndexedDB Cache
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Last updated: {lastCachedTime || 'Just now'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ✓ Pre-flood Alert SMS sent ({cachedLogCount || 1847} numbers notified)
            </span>
          </div>
        ) : networkMode === 'LIMITED' ? (
          <div className="flex items-center space-x-2 text-amber-300 bg-amber-950/30 px-3 py-1 rounded border border-amber-900/50">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>2G Low Bandwidth — Text only mode active</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-emerald-400 font-medium">
            <Wifi className="w-3.5 h-3.5" />
            <span>Live Sync Active (Refreshes every 30m)</span>
          </div>
        )}
      </div>
    </div>
  );
}
