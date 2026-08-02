import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import {
  AlertTriangle,
  Users,
  Shield,
  Clock,
  TrendingUp,
  MapPin,
  HelpCircle,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  ChevronRight,
  Hospital,
  Droplets,
  Wind
} from 'lucide-react';
import {
  calculateRiskScore,
  calculateImpactScore,
  getSeverityFromScore,
  generate72HourForecast,
  buildExplanationLine
} from '../services/dataService';

export default function PredictionDashboard({
  districts,
  selectedDistrictId,
  setSelectedDistrictId,
  onUpdateDistrictParams,
  onNavigateToAlert
}) {
  const district = districts[selectedDistrictId] || districts.cuddalore;

  // Local state for dynamic weight formula sliders to allow live judge experimentation
  const [rainMM, setRainMM] = useState(district.rainfall48h);
  const [riverPct, setRiverPct] = useState(district.riverCapacity);
  const [soilPct, setSoilPct] = useState(district.soilMoisture);
  const [histIdx, setHistIdx] = useState(district.historicalIndex);

  // Sync sliders when selected district changes
  useEffect(() => {
    setRainMM(district.rainfall48h);
    setRiverPct(district.riverCapacity);
    setSoilPct(district.soilMoisture);
    setHistIdx(district.historicalIndex);
  }, [selectedDistrictId, district]);

  // Compute live values from formula
  const currentRiskScore = calculateRiskScore(rainMM, riverPct, soilPct, histIdx);
  const severityInfo = getSeverityFromScore(currentRiskScore);
  const impactInfo = calculateImpactScore(
    currentRiskScore,
    district.populationAtRisk,
    district.popDensityFactor,
    district.hasHospital
  );
  const explanationText = buildExplanationLine(rainMM, riverPct, soilPct);
  const forecastData = generate72HourForecast(currentRiskScore, district.peakHour || 10);

  // Update parent state whenever sliders change
  const handleSliderChange = (newRain, newRiver, newSoil, newHist) => {
    setRainMM(newRain);
    setRiverPct(newRiver);
    setSoilPct(newSoil);
    setHistIdx(newHist);
    onUpdateDistrictParams(district.id, {
      rainfall48h: newRain,
      riverCapacity: newRiver,
      soilMoisture: newSoil,
      historicalIndex: newHist,
      riskScore: calculateRiskScore(newRain, newRiver, newSoil, newHist)
    });
  };

  // Helper color function for district risk level
  const getRiskColorClass = (score) => {
    if (score >= 85) return 'text-red-500 bg-red-500/20 border-red-500/50';
    if (score >= 75) return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
    if (score >= 60) return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
    return 'text-emerald-500 bg-emerald-500/20 border-emerald-500/50';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#151C2C] to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              MODULE 1: Early Warning & Risk Prediction Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Weighted Formula: Rainfall (40%) + River Level (35%) + Soil Moisture (15%) + Historical Index (10%)
          </p>
        </div>

        {/* District Selector Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {Object.values(districts).map((d) => {
            const isSel = d.id === selectedDistrictId;
            const badgeClass =
              d.riskScore >= 85 ? 'bg-red-500/20 text-red-400 border-red-500/50' :
              d.riskScore >= 75 ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
              d.riskScore >= 60 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
              'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';

            return (
              <button
                key={d.id}
                onClick={() => setSelectedDistrictId(d.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border whitespace-nowrap ${
                  isSel
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-900/40 ring-2 ring-blue-500/50 scale-105'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{d.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] border ${badgeClass}`}>
                  {d.riskScore}
                </span>
                {d.id === 'cuddalore' && (
                  <span className="px-1 text-[9px] bg-red-600 text-white font-extrabold rounded">DEMO</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) & District Detail Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Tamil Nadu Interactive Map */}
        <div className="lg:col-span-5 bg-[#151C2C] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Tamil Nadu Risk Heatmap
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Click district to inspect</span>
          </div>

          {/* Interactive Tamil Nadu Vector Map */}
          <div className="relative w-full h-[380px] bg-[#0d1322] rounded-xl border border-slate-800/80 p-4 flex items-center justify-center">
            <svg viewBox="0 0 340 360" className="w-full h-full drop-shadow-2xl">
              {/* Map Outline Background */}
              <path
                d="M 120,40 L 260,20 L 310,120 L 280,210 L 240,320 L 140,340 L 90,260 L 110,140 Z"
                fill="#131B2E"
                stroke="#1E293B"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* District Polygons */}
              {Object.values(districts).map((d) => {
                const isSelected = d.id === selectedDistrictId;
                let fillColor = '#10B981'; // Green
                let strokeColor = '#34D399';
                if (d.riskScore >= 85) {
                  fillColor = '#EF4444'; // Red
                  strokeColor = '#FCA5A5';
                } else if (d.riskScore >= 75) {
                  fillColor = '#F97316'; // Orange
                  strokeColor = '#FDBA74';
                } else if (d.riskScore >= 60) {
                  fillColor = '#F59E0B'; // Yellow
                  strokeColor = '#FDE047';
                }

                return (
                  <g key={d.id} className="cursor-pointer transition-all duration-300" onClick={() => setSelectedDistrictId(d.id)}>
                    <path
                      d={d.path}
                      fill={fillColor}
                      fillOpacity={isSelected ? 0.85 : 0.55}
                      stroke={isSelected ? '#FFFFFF' : strokeColor}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      className={`hover:fill-opacity-90 transition-all ${d.riskScore >= 85 ? 'animate-pulse-fast' : ''}`}
                    />
                    {/* District Marker Label */}
                    <circle
                      cx={d.svgPos.x}
                      cy={d.svgPos.y}
                      r={isSelected ? '14' : '11'}
                      fill="#0B0F19"
                      stroke={fillColor}
                      strokeWidth="2.5"
                    />
                    <text
                      x={d.svgPos.x}
                      y={d.svgPos.y + 4}
                      fill="#FFFFFF"
                      fontSize={isSelected ? '11' : '10'}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {d.riskScore}
                    </text>
                    <text
                      x={d.svgPos.x}
                      y={d.svgPos.y + 24}
                      fill="#E2E8F0"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-[#0f172a]/90 backdrop-blur border border-slate-800 p-2.5 rounded-lg text-[10px] space-y-1">
              <div className="font-bold text-slate-400 mb-1">RISK SCALE</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 0–30: SAFE</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> 31–60: WATCH</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 61–80: WARNING</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span> 81–100: EVACUATE</div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): District Detail Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#151C2C] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            
            {/* Header: District Name & Severity Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">{district.name} District</h2>
                  <span className="text-xs text-slate-400 font-mono">({district.coords[0].toFixed(2)}° N, {district.coords[1].toFixed(2)}° E)</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Confidence Level: <strong className="text-blue-400">{district.confidence}%</strong></p>
              </div>

              {/* Severity Label Badge */}
              <div className={`px-4 py-1.5 rounded-xl border text-sm font-extrabold flex items-center gap-2 shadow-md ${severityInfo.bgClass}`}>
                <AlertTriangle className={`w-4 h-4 ${severityInfo.textClass}`} />
                <span>SEVERITY: {severityInfo.severity}</span>
              </div>
            </div>

            {/* Core Metrics: Prominent Risk Score Gauge & Impact Score Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Risk Score Gauge (Prominent 48px+ Font) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-inner relative overflow-hidden">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">FLOOD RISK SCORE</span>
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-5xl font-black tracking-tight ${severityInfo.textClass}`}>
                      {currentRiskScore}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">/ 100</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Flood expected in: <strong className="text-white">{district.expectedHours}</strong>
                  </div>
                </div>

                {/* Circular Progress Gauge Visual */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="7" fill="transparent" />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke={currentRiskScore >= 85 ? '#ef4444' : currentRiskScore >= 75 ? '#f97316' : currentRiskScore >= 60 ? '#f59e0b' : '#10b981'}
                      strokeWidth="7"
                      strokeDasharray={200}
                      strokeDashoffset={200 - (200 * currentRiskScore) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <Activity className={`w-6 h-6 absolute ${severityInfo.textClass}`} />
                </div>
              </div>

              {/* IMPACT SCORE BADGE — Visually Distinct Metric */}
              <div className={`border rounded-2xl p-5 flex flex-col justify-between shadow-lg relative ${impactInfo.badgeColor}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-300" />
                    HUMAN IMPACT METRIC
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-slate-900/80 text-white border border-slate-700">
                    HUMAN CONSEQUENCE
                  </span>
                </div>

                <div className="space-y-1 my-1">
                  <div className="text-lg font-black text-white tracking-tight">
                    {impactInfo.displayText}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Impact = Risk Score × Pop Density ({district.popDensityFactor}x) × Infra Multiplier ({district.hasHospital ? '1.3x Hospital Zone' : '1.0x'})
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-slate-200">
                  <span>Affected Wards: <strong className="text-white">{district.wards.join(', ')}</strong></span>
                  <span>Est. Pop: <strong className="text-white">{district.populationAtRisk.toLocaleString()}</strong></span>
                </div>
              </div>

            </div>

            {/* Explanation Line (Plain English Reason from Input Weights) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  DYNAMIC EXPLANATION LINE (AI / Formula Weight Reasoning)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Formula Weighted Output</span>
              </div>
              <p className="text-sm font-semibold text-slate-100 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                "{explanationText}"
              </p>
            </div>

            {/* Live Interactive Sliders to Demo Weight Calculations */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Live Input Factors Simulator (Adjust to Test Formula)
                </span>
                <button
                  onClick={() => handleSliderChange(district.rainfall48h, district.riverCapacity, district.soilMoisture, district.historicalIndex)}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span>48h Rainfall (40%):</span>
                    <strong className="text-blue-400">{rainMM} mm</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="400"
                    value={rainMM}
                    onChange={(e) => handleSliderChange(Number(e.target.value), riverPct, soilPct, histIdx)}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span>River Capacity (35%):</span>
                    <strong className="text-blue-400">{riverPct}%</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={riverPct}
                    onChange={(e) => handleSliderChange(rainMM, Number(e.target.value), soilPct, histIdx)}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span>Soil Moisture (15%):</span>
                    <strong className="text-blue-400">{soilPct}%</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={soilPct}
                    onChange={(e) => handleSliderChange(rainMM, riverPct, Number(e.target.value), histIdx)}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-300 mb-1">
                    <span>Historical Flood Index (10%):</span>
                    <strong className="text-blue-400">{histIdx}%</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={histIdx}
                    onChange={(e) => handleSliderChange(rainMM, riverPct, soilPct, Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Quick Action Button to Trigger Pre-Flood Alert */}
            <div className="pt-2">
              <button
                onClick={onNavigateToAlert}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-900/50 transition duration-200 flex items-center justify-center gap-2 group"
              >
                <span>PROCEED TO MODULE 2: ALERT ENGINE & PRE-FLOOD SMS BLAST</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* 72-Hour Forecast Line Chart (Recharts) with Thresholds */}
      <div className="bg-[#151C2C] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              72-Hour Predictive Flood Risk Timeline
            </h2>
            <p className="text-xs text-slate-400">
              Hour-by-hour forecast trajectory with critical decision threshold benchmarks
            </p>
          </div>

          {/* Threshold Legend */}
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-yellow-400">
              <span className="w-3 h-0.5 bg-yellow-400"></span> Watch (60)
            </span>
            <span className="flex items-center gap-1.5 text-orange-400">
              <span className="w-3 h-0.5 bg-orange-400"></span> Warning (75)
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-3 h-0.5 bg-red-400"></span> Evacuate (85)
            </span>
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="w-full h-[280px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff'
                }}
              />
              
              {/* Decision Threshold Lines */}
              <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Watch 60', fill: '#f59e0b', fontSize: 10 }} />
              <ReferenceLine y={75} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'Warning 75', fill: '#f97316', fontSize: 10 }} />
              <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'EVACUATE 85', fill: '#ef4444', fontSize: 10 }} />

              {/* Risk Curve */}
              <Line
                type="monotone"
                dataKey="score"
                name="Risk Score"
                stroke="#3b82f6"
                strokeWidth={3.5}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 7, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span>Peak Flood Inundation Window: <strong className="text-red-400">Hours H+{district.peakHour || 10} to H+{ (district.peakHour || 10) + 6 }</strong></span>
          <span className="text-emerald-400 font-medium">✓ Pre-flood Window open now for SMS broadcast</span>
        </div>
      </div>
    </div>
  );
}
