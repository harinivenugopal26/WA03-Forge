import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OfflineBanner from './components/OfflineBanner';
import DemoBar from './components/DemoBar';
import PredictionDashboard from './components/PredictionDashboard';
import AlertEngine from './components/AlertEngine';
import GISMap from './components/GISMap';
import ApiKeyModal from './components/ApiKeyModal';

import {
  INITIAL_DISTRICTS,
  calculateRiskScore,
  buildExplanationLine
} from './services/dataService';
import {
  saveDistrictsToIndexedDB,
  getDistrictsFromIndexedDB,
  logAlertToIndexedDB,
  getAlertLogsFromIndexedDB
} from './services/dbService';

export default function App() {
  const [districts, setDistricts] = useState(INITIAL_DISTRICTS);
  const [selectedDistrictId, setSelectedDistrictId] = useState('cuddalore');
  const [activeTab, setActiveTab] = useState('prediction'); // 'prediction' | 'alert' | 'map'
  const [networkMode, setNetworkMode] = useState('LIVE'); // 'LIVE' | 'LIMITED' | 'OFFLINE'
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [alertLogs, setAlertLogs] = useState([]);
  const [lastCachedTime, setLastCachedTime] = useState('Just now');

  // Demo Mode State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  // Initialize IndexedDB on startup & load cached logs
  useEffect(() => {
    async function initDB() {
      await saveDistrictsToIndexedDB(INITIAL_DISTRICTS);
      const logs = await getAlertLogsFromIndexedDB();
      if (logs && logs.length > 0) {
        setAlertLogs(logs);
      }
      setLastCachedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    initDB();
  }, []);

  // Update district parameters
  const handleUpdateDistrictParams = (id, newParams) => {
    setDistricts(prev => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          ...newParams
        }
      };
      saveDistrictsToIndexedDB(updated);
      setLastCachedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      return updated;
    });
  };

  // Add alert log
  const handleSendAlert = async (logData) => {
    await logAlertToIndexedDB(logData);
    const logs = await getAlertLogsFromIndexedDB();
    setAlertLogs(logs);
  };

  // -------------------------------------------------------------
  // JUDGE DEMO AUTOMATION ENGINE (10-second Score Climb & Auto Flow)
  // -------------------------------------------------------------
  useEffect(() => {
    let interval = null;
    if (isDemoRunning) {
      // Start with Cuddalore at score 72, climb to 86 over 10s
      let currentSimScore = 72;

      interval = setInterval(() => {
        currentSimScore += 2;
        if (currentSimScore > 86) currentSimScore = 86;

        // Calculate simulated rainfall & river level corresponding to score
        const simRain = 250 + Math.round((currentSimScore - 70) * 7.5);
        const simRiver = 80 + Math.round((currentSimScore - 70) * 1);
        const simExplanation = buildExplanationLine(simRain, simRiver, 88);

        handleUpdateDistrictParams('cuddalore', {
          riskScore: currentSimScore,
          rainfall48h: simRain,
          riverCapacity: simRiver,
          explanation: simExplanation,
          severity: currentSimScore >= 85 ? 'EVACUATE' : 'WARNING'
        });

        if (currentSimScore >= 86) {
          setIsDemoRunning(false);
          setDemoStep(2);
        }
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDemoRunning]);

  // Run specific step in the 7-step Judge Walkthrough Flow
  const runDemoStep = (stepNumber) => {
    setDemoStep(stepNumber);
    switch (stepNumber) {
      case 1:
        setActiveTab('prediction');
        setSelectedDistrictId('cuddalore');
        break;
      case 2:
        setActiveTab('prediction');
        setSelectedDistrictId('cuddalore');
        break;
      case 3:
        setActiveTab('alert');
        setSelectedDistrictId('cuddalore');
        break;
      case 4:
        setActiveTab('alert');
        // Auto send alert in demo
        handleSendAlert({
          districtId: 'cuddalore',
          districtName: 'Cuddalore',
          level: 'EVACUATE',
          smsText: 'FLOOD ALERT-CUDDALORE Wd 3,7,11 / Leave NOW via SH45 North / Relief: GHS Panruti School / Avoid NH32 Underpass. Help:1078',
          recipientCount: 1847,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'DELIVERED'
        });
        break;
      case 5:
        setActiveTab('map');
        setSelectedDistrictId('cuddalore');
        break;
      case 6:
        setNetworkMode('OFFLINE');
        setActiveTab('prediction');
        break;
      case 7:
        setActiveTab('map');
        setSelectedDistrictId('cuddalore');
        break;
      default:
        break;
    }
  };

  const resetDemo = () => {
    setIsDemoRunning(false);
    setDemoStep(1);
    setNetworkMode('LIVE');
    setSelectedDistrictId('cuddalore');
    setDistricts(INITIAL_DISTRICTS);
    setActiveTab('prediction');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* Header Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        apiKey={apiKey}
      />

      {/* Connection Quality & Cache Status Banner */}
      <OfflineBanner
        networkMode={networkMode}
        setNetworkMode={setNetworkMode}
        lastCachedTime={lastCachedTime}
        cachedLogCount={alertLogs.length > 0 ? alertLogs[0].recipientCount : 1847}
      />

      {/* Prominent Judge Demo Control Bar */}
      <DemoBar
        isDemoRunning={isDemoRunning}
        setIsDemoRunning={setIsDemoRunning}
        demoStep={demoStep}
        setDemoStep={setDemoStep}
        runDemoStep={runDemoStep}
        resetDemo={resetDemo}
      />

      {/* Main Screen Content Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'prediction' && (
          <PredictionDashboard
            districts={districts}
            selectedDistrictId={selectedDistrictId}
            setSelectedDistrictId={setSelectedDistrictId}
            onUpdateDistrictParams={handleUpdateDistrictParams}
            onNavigateToAlert={() => runDemoStep(3)}
          />
        )}

        {activeTab === 'alert' && (
          <AlertEngine
            districts={districts}
            selectedDistrictId={selectedDistrictId}
            apiKey={apiKey}
            alertLogs={alertLogs}
            onSendAlert={handleSendAlert}
            networkMode={networkMode}
          />
        )}

        {activeTab === 'map' && (
          <GISMap
            districts={districts}
            selectedDistrictId={selectedDistrictId}
            networkMode={networkMode}
          />
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      {/* Footer */}
      <footer className="w-full bg-[#0a0e17] border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">
          FloodGuard AI — Pre-Disaster Warning System for Indian Districts
        </p>
        <p>
          "The only warning that saves lives is the one that arrives before the water does, and the one people actually understand and trust."
        </p>
      </footer>
    </div>
  );
}
