import React, { useState } from 'react';
import {
  INITIAL_DEPOTS,
  STRATEGIC_PASSES,
  TRANSIT_CORRIDORS,
  INITIAL_METRICS,
  type SectorDepot,
  type TacticalMetrics
} from './data/tacticalData';
import { TacticalMap } from './components/TacticalMap';
import { DepotDetailPanel } from './components/DepotDetailPanel';
import { SecuritySandbox } from './components/SecuritySandbox';
import { DocsModal } from './components/DocsModal';
import {
  Shield,
  BookOpen,
  GitBranch
} from 'lucide-react';

export const App: React.FC = () => {
  const [depots, setDepots] = useState<SectorDepot[]>(INITIAL_DEPOTS);
  const [selectedDepot, setSelectedDepot] = useState<SectorDepot | null>(INITIAL_DEPOTS[0]);
  const [metrics, setMetrics] = useState<TacticalMetrics>(INITIAL_METRICS);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isSimulatingRound, setIsSimulatingRound] = useState<boolean>(false);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'CONSOLE' | 'SECURITY' | 'EVALUATION'>('CONSOLE');

  // Node Jamming simulation handler
  const handleSimulateJamming = (depotId: string) => {
    setDepots((prev) =>
      prev.map((d) =>
        d.id === depotId
          ? {
              ...d,
              isJammed: !d.isJammed,
              status: !d.isJammed ? 'DIL_JAMMED' : 'OPTIMAL'
            }
          : d
      )
    );
    if (selectedDepot && selectedDepot.id === depotId) {
      setSelectedDepot((prev) =>
        prev
          ? {
              ...prev,
              isJammed: !prev.isJammed,
              status: !prev.isJammed ? 'DIL_JAMMED' : 'OPTIMAL'
            }
          : null
      );
    }
  };

  // Node Compromise simulation handler
  const handleSimulateCompromise = (depotId: string) => {
    setDepots((prev) =>
      prev.map((d) =>
        d.id === depotId
          ? {
              ...d,
              isCompromised: !d.isCompromised,
              status: !d.isCompromised ? 'CRITICAL_SHORTAGE' : 'OPTIMAL'
            }
          : d
      )
    );
    if (selectedDepot && selectedDepot.id === depotId) {
      setSelectedDepot((prev) =>
        prev
          ? {
              ...prev,
              isCompromised: !prev.isCompromised,
              status: !prev.isCompromised ? 'CRITICAL_SHORTAGE' : 'OPTIMAL'
            }
          : null
      );
    }
  };

  // Security Toggles
  const handleToggleSecAgg = () => {
    setMetrics((prev) => ({ ...prev, secAggActive: !prev.secAggActive }));
  };

  const handleToggleTopk = () => {
    setMetrics((prev) => ({
      ...prev,
      topkSparsificationActive: !prev.topkSparsificationActive,
      burstDurationMs: !prev.topkSparsificationActive ? 88 : 880
    }));
  };

  const handleToggleAdaptiveDp = () => {
    setMetrics((prev) => ({ ...prev, adaptiveDpActive: !prev.adaptiveDpActive }));
  };

  const handleToggleDirectionalCosine = () => {
    setMetrics((prev) => ({
      ...prev,
      directionalCosineActive: !prev.directionalCosineActive,
      byzantineRejectionRatePct: !prev.directionalCosineActive ? 98.5 : 0.0
    }));
  };

  const handleToggleClusteredFl = () => {
    setMetrics((prev) => ({
      ...prev,
      clusteredFlActive: !prev.clusteredFlActive,
      globalLeadTimeMaeHours: !prev.clusteredFlActive ? 1.38 : 1.62
    }));
  };

  // Simulated P2P Gossip aggregation round
  const handleExecuteFederatedRound = () => {
    setIsSimulatingRound(true);
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        roundsCompleted: prev.roundsCompleted + 1,
        globalLeadTimeMaeHours: Math.max(1.22, +(prev.globalLeadTimeMaeHours - 0.02).toFixed(2))
      }));
      setIsSimulatingRound(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans antialiased">
      {/* SaaS Top Header Navbar */}
      <header className="h-14 border-b border-slate-800/80 bg-[#0a0c12]/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-[1500]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/90 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-100">FL-TACTICAL-MILOPS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                LAC-LADAKH
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Privacy-Preserving Federated Intelligence for High-Altitude Border Resupply
            </p>
          </div>
        </div>

        {/* Center Tab Switcher */}
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('CONSOLE')}
            className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'CONSOLE' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tactical Map Console
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'SECURITY' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Defense Sandbox
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`py-1 px-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              showCorridors ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {showCorridors ? 'Hide Corridors' : 'Show Corridors'}
          </button>
          <button
            onClick={() => setIsDocsOpen(true)}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Architecture Docs</span>
          </button>
          <a
            href="https://github.com/ankitgpt18/Minor-Project"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition-colors flex items-center justify-center"
            title="GitHub Repository"
          >
            <GitBranch className="w-4 h-4 text-slate-300" />
          </a>
        </div>
      </header>

      {/* Main Tactical Workspace */}
      <main className="flex-1 p-3 lg:p-4 max-w-[1700px] w-full mx-auto space-y-3">
        {/* Top Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-[#0d0f17] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">P2P Round:</span>
            <span className="font-mono font-bold text-cyan-400">#{metrics.roundsCompleted}</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0d0f17] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Global MAE:</span>
            <span className="font-mono font-bold text-emerald-400">{metrics.globalLeadTimeMaeHours}h</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0d0f17] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Radio Burst:</span>
            <span className="font-mono font-bold text-cyan-400">{metrics.burstDurationMs} ms</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0d0f17] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Privacy Bound:</span>
            <span className="font-mono font-bold text-purple-400">&epsilon; = {metrics.formalEpsilonBound}</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0d0f17] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Drone Safety:</span>
            <span className="font-mono font-bold text-emerald-400">{metrics.droneFlightSurvivabilityPct}%</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0d0f17] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">SecAgg Masking:</span>
            <span className="font-mono font-bold text-emerald-400">{metrics.secAggActive ? 'ZERO-KNOWLEDGE' : 'OFF'}</span>
          </div>
        </div>

        {/* Content depending on Active Tab */}
        {activeTab === 'CONSOLE' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[calc(100vh-140px)] min-h-[580px]">
            {/* Tactical Map (8 Cols) */}
            <div className="lg:col-span-8 h-full flex flex-col">
              <TacticalMap
                depots={depots}
                passes={STRATEGIC_PASSES}
                corridors={TRANSIT_CORRIDORS}
                selectedDepot={selectedDepot}
                onSelectDepot={setSelectedDepot}
                showRadarZones={true}
                showCorridors={showCorridors}
              />
            </div>

            {/* Selected Depot Telemetry Panel (4 Cols) */}
            <div className="lg:col-span-4 h-full">
              <DepotDetailPanel
                depot={selectedDepot}
                onSimulateJamming={handleSimulateJamming}
                onSimulateCompromise={handleSimulateCompromise}
              />
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-140px)] min-h-[580px] overflow-y-auto">
            <SecuritySandbox
              metrics={metrics}
              onToggleSecAgg={handleToggleSecAgg}
              onToggleTopk={handleToggleTopk}
              onToggleAdaptiveDp={handleToggleAdaptiveDp}
              onToggleDirectionalCosine={handleToggleDirectionalCosine}
              onToggleClusteredFl={handleToggleClusteredFl}
              onExecuteFederatedRound={handleExecuteFederatedRound}
              isSimulatingRound={isSimulatingRound}
            />
          </div>
        )}
      </main>

      {/* Docs Modal */}
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
};

export default App;
