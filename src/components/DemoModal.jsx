import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, ChevronRight, X, Sparkles, Zap, ShieldAlert, WifiOff } from 'lucide-react';

export default function DemoModal({ 
  isOpen, 
  onClose, 
  currentStep, 
  setCurrentStep, 
  onNextStep, 
  isAutoRunning,
  setIsAutoRunning 
}) {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: "Step 1: India / Tamil Nadu District Risk Map",
      desc: "Observe Cuddalore District highlighted in critical RED (Risk Score 86/100).",
      action: "Selected Cuddalore District"
    },
    {
      num: 2,
      title: "Step 2: Risk Gauge & 72-Hour Forecast",
      desc: "Review prominent 86 Risk Gauge, 4-factor AI formula breakdown, and 72-hour forecast peaking at Hour 10.",
      action: "Inspected Cuddalore Detail Panel & Chart"
    },
    {
      num: 3,
      title: "Step 3: Claude AI Emergency SMS Generation",
      desc: "Switched to Module 2 Alert Engine. Claude AI generated localized <160 char SMS.",
      action: "Previewed Pre-Flood SMS text"
    },
    {
      num: 4,
      title: "Step 4: Dispatch Emergency Alert Blast",
      desc: "Clicked [SEND ALERT]. Pre-flood broadcast window dispatched before flood hits.",
      action: "Confirmed: ✓ 1,847 numbers notified"
    },
    {
      num: 5,
      title: "Step 5: GIS Evacuation & Shelter Navigation",
      desc: "Switched to Module 3 Evacuation Map. Rendered flood polygons (Wards 3,7,11), hazard roads (NH32), and safe corridor (SH45 North).",
      action: "Visualized Evacuation Layers"
    },
    {
      num: 6,
      title: "Step 6: Activate Offline Mode Simulation",
      desc: "Toggled [● OFFLINE MODE]. Proves map and safety directives remain 100% functional via IndexedDB cache when cellular towers fail.",
      action: "Activated Offline Cached Mode"
    },
    {
      num: 7,
      title: "Step 7: Relief Shelter Directive Inspection",
      desc: "Tapped GHS Panruti School shelter pin. Showcases live shelter capacity (410/600), safe route directions, and emergency contacts.",
      action: "Completed Full 3-Min Hackathon Demo Flow!"
    }
  ];

  const stepData = steps[currentStep - 1] || steps[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full glass-panel p-5 rounded-2xl border border-amber-500/60 shadow-2xl bg-slate-950/95 backdrop-blur-xl animate-fade-in">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <h3 className="text-sm font-extrabold text-white font-heading flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-400" />
            JUDGE DEMO FLOW (STEP {currentStep} OF 7)
          </h3>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Step Content */}
      <div className="space-y-3">
        <div>
          <h4 className="text-base font-bold text-amber-300 font-heading">
            {stepData.title}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {stepData.desc}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center justify-between">
          <span>Action Triggered:</span>
          <strong>{stepData.action}</strong>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 to-red-500 h-1.5 transition-all duration-500"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setIsAutoRunning(!isAutoRunning)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isAutoRunning
                ? 'bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isAutoRunning ? 'PAUSE AUTO-ADVANCE' : '▶ AUTO-PLAY DEMO'}
          </button>

          <button
            onClick={onNextStep}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-4 py-1.5 text-xs font-extrabold text-slate-950 hover:from-amber-400 hover:to-red-400 shadow-md shadow-amber-500/20"
          >
            <span>{currentStep === 7 ? 'FINISH DEMO' : 'NEXT STEP'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
