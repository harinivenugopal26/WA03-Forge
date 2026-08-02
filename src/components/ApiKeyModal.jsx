import React, { useState } from 'react';
import { X, Key, Check, Info, ShieldCheck } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, setApiKey }) {
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#151C2C] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">API Configuration</h3>
            <p className="text-xs text-slate-400">Claude API & OpenWeather Integration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Offline AI Fallback Active</span>
            </div>
            <p className="text-slate-400">
              FloodGuard AI includes built-in offline smart generators for SMS alerts (&lt; 160 chars) and plain-English risk explanations. You can test fully without an API key!
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Anthropic Claude API Key (Optional)
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Used for live LLM SMS & Explanation line generation.
            </span>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-500/40">
              <Check className="w-4 h-4" /> API key saved successfully!
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-900/50 transition flex items-center gap-2"
            >
              Save Key Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
