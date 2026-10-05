import React, { useState } from 'react';
import type { SectorDepot } from '../data/sectorsData';
import { SECTORS, PASSES } from '../data/sectorsData';
import {
  ShieldAlert,
  Radio,
  Snowflake,
  AlertTriangle,
  ShieldCheck,
  Wifi,
  WifiOff,
  Eye,
  Lock,
  Cpu,
  Zap,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

interface RiskEarlyWarningViewProps {
  activeSector: SectorDepot;
}

// Pass risk assessment data
const passRiskData = PASSES.map((p) => ({
  name: p.name.split(' (')[0],
  status: p.status,
  altitude: p.altitudeFt,
  closureDays: p.annualClosureDays,
  avalancheRisk: p.status === 'BLOCKED' ? 92 : p.status === 'ALERT' ? 68 : 24,
  ewThreat: p.name.includes('Sasser') ? 85 : p.name.includes('Khardung') ? 62 : 30,
}));

// Convergence curve data
const convergenceData = [
  { round: 'R1', BaselineIsolated: 3.2, VanillaFedAvg: 2.1, HardenedFL: 1.95 },
  { round: 'R3', BaselineIsolated: 3.1, VanillaFedAvg: 1.85, HardenedFL: 1.68 },
  { round: 'R6', BaselineIsolated: 3.0, VanillaFedAvg: 1.72, HardenedFL: 1.52 },
  { round: 'R9', BaselineIsolated: 2.95, VanillaFedAvg: 1.65, HardenedFL: 1.44 },
  { round: 'R12', BaselineIsolated: 2.9, VanillaFedAvg: 1.62, HardenedFL: 1.40 },
  { round: 'R15', BaselineIsolated: 2.85, VanillaFedAvg: 1.60, HardenedFL: 1.38 },
];

// Threat radar data
const threatRadarData = [
  { axis: 'Avalanche', value: 72 },
  { axis: 'EW Jamming', value: 58 },
  { axis: 'Supply Cut', value: 45 },
  { axis: 'Byzantine Node', value: 15 },
  { axis: 'Gradient Leak', value: 8 },
  { axis: 'Road Damage', value: 35 },
];

// Privacy toggle state
interface PrivacyToggle {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
  metric: string;
}

export const RiskEarlyWarningView: React.FC<RiskEarlyWarningViewProps> = ({
  activeSector
}) => {
  const [secAgg, setSecAgg] = useState(true);
  const [topk, setTopk] = useState(true);
  const [adaptiveDp, setAdaptiveDp] = useState(true);
  const [cosineFilter, setCosineFilter] = useState(true);
  const [clusteredFl, setClusteredFl] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [roundCount, setRoundCount] = useState(14);

  const handleSimulateRound = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setRoundCount((c) => c + 1);
      setIsSimulating(false);
    }, 1200);
  };

  const toggles: PrivacyToggle[] = [
    {
      id: 'dp',
      label: 'Adaptive Renyi DP-SGD',
      description: 'Dynamic clipping threshold + layer-wise perturbation to prevent GI-SMN inversion.',
      icon: <Lock className="w-3.5 h-3.5 text-purple-400" />,
      activeColor: 'text-purple-200',
      activeBg: 'bg-purple-950/40',
      activeBorder: 'border-purple-800/80',
      metric: adaptiveDp ? 'eps = 1.85' : 'OFF',
    },
    {
      id: 'secagg',
      label: 'SecAgg+ Zero-Knowledge Masking',
      description: 'Pairwise Diffie-Hellman secret masks; intercepted packets appear as uniform random noise.',
      icon: <Radio className="w-3.5 h-3.5 text-cyan-400" />,
      activeColor: 'text-cyan-200',
      activeBg: 'bg-cyan-950/40',
      activeBorder: 'border-cyan-800/80',
      metric: secAgg ? 'ACTIVE' : 'OFF',
    },
    {
      id: 'topk',
      label: 'Top-k Sparsification (90%)',
      description: '10x gradient compression with client error accumulation buffers for micro-burst radio.',
      icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
      activeColor: 'text-emerald-200',
      activeBg: 'bg-emerald-950/40',
      activeBorder: 'border-emerald-800/80',
      metric: topk ? '1.42 MB' : '14.2 MB',
    },
    {
      id: 'cosine',
      label: 'Directional Momentum Filter',
      description: 'Cosine similarity validation against historical momentum; blocks Layer Smoothing Backdoors.',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />,
      activeColor: 'text-amber-200',
      activeBg: 'bg-amber-950/40',
      activeBorder: 'border-amber-800/80',
      metric: cosineFilter ? '98.5% Block' : 'OFF',
    },
    {
      id: 'cfl',
      label: 'Clustered Federated Learning (CFL)',
      description: 'Partitions nodes into Munitions, Infantry, and Drone clusters to mitigate Non-IID client drift.',
      icon: <Cpu className="w-3.5 h-3.5 text-blue-400" />,
      activeColor: 'text-blue-200',
      activeBg: 'bg-blue-950/40',
      activeBorder: 'border-blue-800/80',
      metric: clusteredFl ? '3 Clusters' : 'OFF',
    },
  ];

  const toggleHandlers: Record<string, () => void> = {
    dp: () => setAdaptiveDp(!adaptiveDp),
    secagg: () => setSecAgg(!secAgg),
    topk: () => setTopk(!topk),
    cosine: () => setCosineFilter(!cosineFilter),
    cfl: () => setClusteredFl(!clusteredFl),
  };

  const toggleStates: Record<string, boolean> = {
    dp: adaptiveDp,
    secagg: secAgg,
    topk: topk,
    cosine: cosineFilter,
    cfl: clusteredFl,
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e222d] pb-4">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>Himalayan Pass Early Warning and Electronic Warfare Defense</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active D-DIL jamming monitoring, avalanche probability vectors, and Byzantine node sabotage isolation.
          </p>
        </div>
        <button
          onClick={handleSimulateRound}
          disabled={isSimulating}
          className="py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-950 disabled:text-slate-500 text-slate-900 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Aggregating...' : `Trigger P2P Gossip Round (R${roundCount + 1})`}</span>
        </button>
      </div>

      {/* Pass Risk Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {passRiskData.map((pass) => {
          const isCritical = pass.status === 'BLOCKED';
          const isAlert = pass.status === 'ALERT';
          return (
            <div key={pass.name} className={`bg-[#12141a] border rounded-xl p-4 space-y-2.5 ${
              isCritical ? 'border-rose-800/60' : isAlert ? 'border-amber-800/60' : 'border-[#1e222d]'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{pass.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  isCritical
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : isAlert
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {pass.status}
                </span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1"><Snowflake className="w-3 h-3" /> Avalanche Risk</span>
                  <span className={`font-mono font-bold ${pass.avalancheRisk > 70 ? 'text-rose-400' : pass.avalancheRisk > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {pass.avalancheRisk}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    {pass.ewThreat > 60 ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                    EW Jamming
                  </span>
                  <span className={`font-mono font-bold ${pass.ewThreat > 70 ? 'text-rose-400' : pass.ewThreat > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {pass.ewThreat}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Closure Days/yr</span>
                  <span className="font-mono text-slate-300">{pass.closureDays}d</span>
                </div>
              </div>
              <div className="w-full bg-[#1e222d] rounded-full h-1">
                <div
                  className={`h-1 rounded-full ${
                    pass.avalancheRisk > 70 ? 'bg-rose-500' : pass.avalancheRisk > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${pass.avalancheRisk}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Convergence Chart */}
        <div className="lg:col-span-8 bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Decentralized Convergence: Lead Time MAE</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Flower multi-node simulation across training rounds</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Round {roundCount}
            </span>
          </div>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convergenceData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="round" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[1.0, 3.5]} />
                <Tooltip
                  contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '6px', fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="BaselineIsolated" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" name="Isolated Depots (No FL)" dot={false} />
                <Line type="monotone" dataKey="VanillaFedAvg" stroke="#f59e0b" strokeWidth={1.5} name="Vanilla FedAvg (Central)" dot={false} />
                <Line type="monotone" dataKey="HardenedFL" stroke="#10b981" strokeWidth={2} name="Our Hardened Tactical FL" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Radar */}
        <div className="lg:col-span-4 bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-400" />
              <span>Threat Radar</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{activeSector.shortCode} threat profile</p>
          </div>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={threatRadarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar
                  dataKey="value"
                  stroke="#f43f5e"
                  fill="#f43f5e"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Privacy & Security Toggle Panel */}
      <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e222d] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Hardened Security and Privacy Execution Controls</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Toggle privacy guarantees, radio stealth, and Byzantine defenses under active combat simulation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {toggles.map((t) => {
            const isActive = toggleStates[t.id];
            return (
              <div
                key={t.id}
                onClick={toggleHandlers[t.id]}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                  isActive
                    ? `${t.activeBg} ${t.activeBorder} ${t.activeColor}`
                    : 'bg-slate-900/30 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5">
                    {t.icon}
                    <span>{t.label}</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? `${t.activeBg} ${t.activeColor}` : 'bg-slate-800 text-slate-500'
                  }`}>
                    {t.metric}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{t.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Health Table */}
      <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">FL Node Health and Byzantine Status</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Per-node convergence loss, jamming status, and compromise detection</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e222d] text-slate-400">
                <th className="text-left py-2.5 px-3 font-bold">Node</th>
                <th className="text-right py-2.5 px-3 font-bold">Cluster</th>
                <th className="text-right py-2.5 px-3 font-bold">Local Loss</th>
                <th className="text-right py-2.5 px-3 font-bold">MAE (hrs)</th>
                <th className="text-right py-2.5 px-3 font-bold">Jammed</th>
                <th className="text-right py-2.5 px-3 font-bold">Byzantine</th>
              </tr>
            </thead>
            <tbody>
              {SECTORS.map((s) => (
                <tr key={s.id} className="border-b border-[#1e222d]/50 hover:bg-[#161922] transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-200">{s.shortCode}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{s.cluster}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{s.localLoss}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-400">{s.localMaeHours}h</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      s.isJammed
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {s.isJammed ? 'JAMMED' : 'CLEAR'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      s.isCompromised
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {s.isCompromised ? 'SUSPECT' : 'VERIFIED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
