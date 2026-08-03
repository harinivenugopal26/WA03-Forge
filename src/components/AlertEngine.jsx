import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
  Sparkles,
  Edit3,
  Users,
  ShieldCheck,
  CheckSquare,
  Square,
  Smartphone,
  RefreshCw,
  Info,
  Languages
} from 'lucide-react';
import { generateSMSAlert } from '../services/aiService';
import { calculateImpactScore, getSeverityFromScore } from '../services/dataService';
import { sendAlertEmail } from '../services/sendAlertEmail';

const LANGUAGE_OPTIONS = ['English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Hindi'];

export default function AlertEngine({
  districts,
  selectedDistrictId,
  apiKey,
  alertLogs,
  onSendAlert,
  networkMode
}) {
  const currentDistrict = districts[selectedDistrictId] || districts.cuddalore;

  const [alertLevel, setAlertLevel] = useState(
    currentDistrict.riskScore >= 85 ? 'EVACUATE' :
    currentDistrict.riskScore >= 75 ? 'WARNING' : 'WATCH'
  );

  const [smsText, setSmsText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [alertLanguage, setAlertLanguage] = useState('English');

  const [selectedDistricts, setSelectedDistricts] = useState({
    [currentDistrict.id]: true
  });

  const [sentNotification, setSentNotification] = useState(null);

  const [alertEmail, setAlertEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    handleGenerateSMS();
  }, [selectedDistrictId, alertLevel, currentDistrict, alertLanguage]);

  const handleGenerateSMS = async () => {
    setIsGenerating(true);
    const text = await generateSMSAlert(currentDistrict, apiKey, alertLanguage);
    setSmsText(text);
    setIsGenerating(false);
  };

  const toggleDistrictSelection = (id) => {
    setSelectedDistricts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDispatch = () => {
    const targetDistrictIds = Object.keys(selectedDistricts).filter(id => selectedDistricts[id]);
    if (targetDistrictIds.length === 0) return;

    let totalRecipients = 0;
    targetDistrictIds.forEach(id => {
      totalRecipients += districts[id]?.phoneCount || 1000;
    });

    const newLog = {
      districtId: currentDistrict.id,
      districtName: targetDistrictIds.map(id => districts[id]?.name).join(', '),
      level: alertLevel,
      smsText: smsText,
      language: alertLanguage,
      recipientCount: totalRecipients,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'DELIVERED'
    };

    onSendAlert(newLog);

    setSentNotification({
      count: totalRecipients,
      districts: newLog.districtName
    });

    if (alertEmail) {
      setEmailStatus('sending');
      sendAlertEmail(alertEmail, {
        district: newLog.districtName,
        severity: alertLevel,
        risk_score: currentDistrict.riskScore,
        time_window: currentDistrict.floodWindow || 'Imminent',
        action_message: smsText,
        camp_name: currentDistrict.nearestCamp,
        camp_distance: currentDistrict.campDistance || 'N/A',
        avoid_route: currentDistrict.avoidRoad,
        language: alertLanguage,
      })
        .then(() => setEmailStatus('success'))
        .catch((err) => {
          console.error('EmailJS error:', err);
          setEmailStatus('error');
        });
    }

    setTimeout(() => {
      setSentNotification(null);
      setEmailStatus(null);
    }, 6000);
  };

  const sortedDistricts = Object.values(districts).map(d => {
    const imp = calculateImpactScore(d.riskScore, d.populationAtRisk, d.popDensityFactor, d.hasHospital);
    return {
      ...d,
      impactInfo: imp,
      impactVal: parseFloat(imp.rawImpact)
    };
  }).sort((a, b) => b.impactVal - a.impactVal);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-slate-900 via-[#151C2C] to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-500/20 text-red-400 rounded-lg">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              MODULE 2: Pre-Flood Automatic Alert & SMS Dispatch Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Critical pre-disaster timing window: SMS alerts are dispatched <strong className="text-amber-300">BEFORE internet infrastructure fails</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            WATCH (60-74)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
            WARNING (75-84)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
            EVACUATE (85+)
          </span>
        </div>
      </div>

      {sentNotification && (
        <div className="bg-emerald-950/90 border-2 border-emerald-500/80 text-emerald-200 p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">SMS ALERT BLAST DISPATCHED SUCCESSFULLY!</h3>
              <p className="text-xs text-emerald-300 font-semibold">
                ✓ {sentNotification.count.toLocaleString()} mobile numbers notified across {sentNotification.districts}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-900 text-white rounded-lg text-xs font-mono font-bold">
            CONFIRMED DELIVERED
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-7 bg-[#151C2C] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              Automated SMS Broadcast Generator
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              Claude API LLM Format
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Trigger Alert Level:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setAlertLevel('WATCH')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all text-center ${
                  alertLevel === 'WATCH'
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500 ring-2 ring-yellow-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                WATCH (60-74)
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">Officials Only</span>
              </button>

              <button
                onClick={() => setAlertLevel('WARNING')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all text-center ${
                  alertLevel === 'WARNING'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500 ring-2 ring-orange-500/40 shadow-lg'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                WARNING (75-84)
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">Volunteers + Dept</span>
              </button>

              <button
                onClick={() => setAlertLevel('EVACUATE')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all text-center ${
                  alertLevel === 'EVACUATE'
                    ? 'bg-red-500/20 text-red-300 border-red-500 ring-2 ring-red-500/40 shadow-lg animate-pulse'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                EVACUATE (85+)
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">All District Citizens</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              Alert Language:
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setAlertLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    alertLanguage === lang
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500 ring-2 ring-blue-500/40 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            {alertLanguage !== 'English' && !apiKey && (
              <p className="text-[11px] text-amber-400 font-medium bg-amber-950/40 border border-amber-900/50 rounded-lg px-3 py-1.5">
                Multilingual generation requires a Claude API key — showing English fallback until a key is added.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                Generated SMS Broadcast Content (Editable):
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-blue-400">
                  Generated in: {alertLanguage}
                </span>
                <span className={`text-xs font-mono font-bold ${
                  smsText.length > 160 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {smsText.length} / 160 Chars
                </span>
                <button
                  onClick={handleGenerateSMS}
                  disabled={isGenerating}
                  className="p-1 text-slate-400 hover:text-white transition"
                  title="Regenerate with Claude API"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                maxLength={300}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-mono text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed shadow-inner"
                placeholder="Generating crisp alert message..."
              />
              <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-500 font-mono">
                Standard GSM 160-char Single Page Limit (English)
              </div>
            </div>

            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              Includes specific ward numbers ({currentDistrict.wards.join(',')}), safe route ({currentDistrict.safeRoute}), relief camp ({currentDistrict.nearestCamp}), and road to avoid ({currentDistrict.avoidRoad}).
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Recipient Email (Real Alert Delivery):
            </label>
            <input
              type="email"
              value={alertEmail}
              onChange={(e) => setAlertEmail(e.target.value)}
              placeholder="teammate@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {emailStatus === 'sending' && (
              <p className="text-xs text-slate-400 font-semibold">Sending real email...</p>
            )}
            {emailStatus === 'success' && (
              <p className="text-xs text-emerald-400 font-semibold">✓ Real email sent successfully!</p>
            )}
            {emailStatus === 'error' && (
              <p className="text-xs text-red-400 font-semibold">✗ Email failed to send. Check console.</p>
            )}
          </div>

          <button
            onClick={handleDispatch}
            disabled={networkMode === 'OFFLINE' || smsText.length === 0}
            className={`w-full py-4 px-6 rounded-xl font-black text-sm tracking-wide shadow-xl transition flex items-center justify-center gap-3 ${
              networkMode === 'OFFLINE'
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-950/60 ring-2 ring-red-500/50'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>DISPATCH IMMEDIATE PRE-FLOOD SMS BLAST</span>
          </button>

          {networkMode === 'OFFLINE' && (
            <p className="text-xs text-red-400 font-medium text-center">
              ⚠️ Offline mode active: New SMS dispatches are disabled. Previous alerts sent before connectivity loss remain cached in IndexedDB.
            </p>
          )}

        </div>

        <div className="lg:col-span-5 bg-[#151C2C] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Impact-Score Prioritized Send Checklist
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Districts sorted by highest <strong className="text-purple-300">Human Impact Score</strong> so officials prioritize high-risk population zones first.
            </p>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {sortedDistricts.map((d, index) => {
              const isChecked = !!selectedDistricts[d.id];
              return (
                <div
                  key={d.id}
                  onClick={() => toggleDistrictSelection(d.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-slate-900/90 border-blue-500/60 shadow-md'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-400 hover:text-blue-300">
                      {isChecked ? <CheckSquare className="w-5 h-5 text-blue-500 fill-blue-500/20" /> : <Square className="w-5 h-5 text-slate-600" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                        <strong className="text-sm text-white font-bold">{d.name}</strong>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold ${
                          d.riskScore >= 85 ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          d.riskScore >= 75 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        }`}>
                          Risk {d.riskScore}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {d.populationAtRisk.toLocaleString()} pop • {d.phoneCount} numbers registered
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-black inline-block ${d.impactInfo.badgeColor}`}>
                      IMPACT: {d.impactInfo.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {d.hasHospital ? '🏥 Hospital Zone' : 'Standard Zone'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="bg-[#151C2C] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            Alert Dispatch History & Confirmation Log
          </h2>
          <span className="text-xs text-slate-400 font-mono">IndexedDB Persistent Cache</span>
        </div>

        {alertLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No alerts sent yet in current session. Click [DISPATCH SMS BLAST] above to send your first alert!
          </div>
        ) : (
          <div className="space-y-3">
            {alertLogs.map((log, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 font-mono">{log.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                      log.level === 'EVACUATE' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {log.level}
                    </span>
                    <strong className="text-white font-bold">{log.districtName}</strong>
                    {log.language && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                        {log.language}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                    "{log.smsText}"
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-emerald-400 font-bold whitespace-nowrap bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ {log.recipientCount.toLocaleString()} numbers notified</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
