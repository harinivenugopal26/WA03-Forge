import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';

export default function DemoBar({
  isDemoRunning,
  setIsDemoRunning,
  demoStep,
  setDemoStep,
  runDemoStep,
  resetDemo
}) {
  return (
    <div className="w-full bg-gradient-to-r from-blue-950/90 via-indigo-950/90 to-purple-950/90 border-b border-blue-800/40 px-4 py-2.5 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Title & Demo Trigger */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 rounded-lg text-white font-bold text-xs tracking-wide shadow-md shadow-blue-900/40 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>JUDGE DEMO MODE</span>
          </div>

          <button
            onClick={() => setIsDemoRunning(!isDemoRunning)}
            className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md ${
              isDemoRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isDemoRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause Simulation
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Launch 10s Score Surge & Auto Flow
              </>
            )}
          </button>

          <button
            onClick={resetDemo}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
            title="Reset Demo State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7-Step Interactive Guided Progress bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none text-xs">
          {[
            { step: 1, name: '1. Map Glow' },
            { step: 2, name: '2. Risk & Impact' },
            { step: 3, name: '3. Auto SMS' },
            { step: 4, name: '4. Send Alert' },
            { step: 5, name: '5. GIS Routes' },
            { step: 6, name: '6. Go Offline' },
            { step: 7, name: '7. Relief Camp' }
          ].map((item) => {
            const isActive = demoStep === item.step;
            const isCompleted = demoStep > item.step;

            return (
              <button
                key={item.step}
                onClick={() => runDemoStep(item.step)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap flex items-center gap-1 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-400 font-bold ring-2 ring-blue-400/40 shadow-lg scale-105'
                    : isCompleted
                    ? 'bg-slate-800/90 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className={`w-3.5 h-3.5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isActive ? 'bg-white text-blue-700' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.step}
                  </span>
                )}
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
