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

const passRiskData = PASSES.map((p) => ({
  name: p.name.split(' (')[0],
  status: p.status,
  altitude: p.altitudeFt,
  closureDays: p.annualClosureDays,
  avalancheRisk: p.status === 'BLOCKED' ? 92 : p.status === 'ALERT' ? 68 : 24,
  ewThreat: p.name.includes('Sasser') ? 85 : p.name.includes('Khardung') ? 62 : 30,
}));

const convergenceData = [
  { round: 'R1', BaselineIsolated: 3.2, VanillaFedAvg: 2.1, HardenedFL: 1.95 },
  { round: 'R3', BaselineIsolated: 3.1, VanillaFedAvg: 1.85, HardenedFL: 1.68 },
  { round: 'R6', BaselineIsolated: 3.0, VanillaFedAvg: 1.72, HardenedFL: 1.52 },
  { round: 'R9', BaselineIsolated: 2.95, VanillaFedAvg: 1.65, HardenedFL: 1.44 },
  { round: 'R12', BaselineIsolated: 2.9, VanillaFedAvg: 1.62, HardenedFL: 1.40 },
  { round: 'R15', BaselineIsolated: 2.85, VanillaFedAvg: 1.60, HardenedFL: 1.38 },
];

const threatRadarData = [
  { axis: 'Avalanche', value: 72 },
  { axis: 'EW Jamming', value: 58 },
  { axis: 'Supply Cut', value: 45 },
  { axis: 'Byzantine Node', value: 15 },
  { axis: 'Gradient Leak', value: 8 },
  { axis: 'Road Damage', value: 35 },
];

interface PrivacyToggle {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
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
      label: 'Adaptive Rényi DP-SGD',
      description: 'Dynamic sensitivity clipping threshold + layer-wise perturbation to prevent GI-SMN inversion.',
      icon: <Lock className="w-3.5 h-3.5" />,
      metric: adaptiveDp ? 'eps = 1.85' : 'OFF',
    },
    {
      id: 'secagg',
      label: 'SecAgg+ Zero-Knowledge Masking',
      description: 'Pairwise Diffie-Hellman secret masks; intercepted packets appear as uniform random noise.',
      icon: <Radio className="w-3.5 h-3.5" />,
      metric: secAgg ? 'ACTIVE' : 'OFF',
    },
    {
      id: 'topk',
      label: 'Top-k Sparsification (90%)',
      description: '10x gradient compression with client error accumulation buffers for micro-burst radio.',
      icon: <Zap className="w-3.5 h-3.5" />,
      metric: topk ? '1.42 MB' : '14.2 MB',
    },
    {
      id: 'cosine',
      label: 'Directional Momentum Filter',
      description: 'Cosine similarity validation against historical momentum; blocks Layer Smoothing Backdoors.',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      metric: cosineFilter ? '98.5% Block' : 'OFF',
    },
    {
      id: 'cfl',
      label: 'Clustered Federated Learning (CFL)',
      description: 'Partitions nodes into Munitions, Infantry, and Drone clusters to mitigate Non-IID client drift.',
      icon: <Cpu className="w-3.5 h-3.5" />,
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
            <ShieldAlert className="w-5 h-5 text-slate-300" />
            <span>Himalayan Pass Early Warning & Electronic Warfare Defense</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active D-DIL jamming monitoring, avalanche probability vectors, and Byzantine node sabotage isolation.
          </p>
        </div>
        <button
          onClick={handleSimulateRound}
          disabled={isSimulating}
          className="py-2 px-3.5 rounded-lg bg-white text-slate-950 font-bold hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-500 flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-sm"
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
            <div key={pass.name} className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{pass.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  isCritical
                    ? 'bg-zinc-900 text-rose-400 border border-rose-900/60'
                    : isAlert
                    ? 'bg-zinc-900 text-amber-400 border border-amber-900/60'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-700'
                }`}>
                  {pass.status}
                </span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1"><Snowflake className="w-3 h-3 text-slate-500" /> Avalanche Risk</span>
                  <span className="font-mono text-slate-200">
                    {pass.avalancheRisk}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    {pass.ewThreat > 60 ? <WifiOff className="w-3 h-3 text-slate-500" /> : <Wifi className="w-3 h-3 text-slate-500" />}
                    EW Jamming
                  </span>
                  <span className="font-mono text-slate-200">
                    {pass.ewThreat}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-slate-500" /> Closure Days/yr</span>
                  <span className="font-mono text-slate-300">{pass.closureDays}d</span>
                </div>
              </div>
              <div className="w-full bg-[#1e222d] rounded-full h-1 overflow-hidden">
                <div
                  className="h-1 rounded-full bg-slate-300"
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
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Round {roundCount}
            </span>
          </div>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convergenceData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c202a" />
                <XAxis dataKey="round" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[1.0, 3.5]} />
                <Tooltip
                  contentStyle={{ background: '#0e1015', border: '1px solid #1e222d', borderRadius: '6px', fontSize: '10px', color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="BaselineIsolated" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" name="Isolated Depots (No FL)" dot={false} />
                <Line type="monotone" dataKey="VanillaFedAvg" stroke="#94a3b8" strokeWidth={1.5} name="Vanilla FedAvg (Central)" dot={false} />
                <Line type="monotone" dataKey="HardenedFL" stroke="#ffffff" strokeWidth={2} name="Hardened Tactical FL" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Radar */}
        <div className="lg:col-span-4 bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>Threat Radar</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{activeSector.shortCode} threat profile</p>
          </div>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={threatRadarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#1e222d" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar
                  dataKey="value"
                  stroke="#cbd5e1"
                  fill="#cbd5e1"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Uniform Privacy & Security Toggle Panel */}
      <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e222d] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-300" />
              <span>Hardened Security & Privacy Execution Controls</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Toggle privacy guarantees, radio stealth, and Byzantine defenses under active combat simulation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {toggles.map((t) => {
            const isActive = toggleStates[t.id];
            return (
              <div
                key={t.id}
                onClick={toggleHandlers[t.id]}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#151922] border-[#293245] text-slate-100 shadow-sm'
                    : 'bg-[#0f1118]/60 border-[#1c202a] text-slate-400 hover:border-[#242b3a]'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-2 text-slate-200">
                    <span className={isActive ? 'text-slate-100' : 'text-slate-500'}>{t.icon}</span>
                    <span className="text-xs">{t.label}</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                    isActive ? 'bg-white text-slate-950 font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {t.metric}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 mt-1.5 leading-normal">{t.description}</p>
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
                <th className="text-left py-2.5 px-3 font-semibold">Node</th>
                <th className="text-right py-2.5 px-3 font-semibold">Cluster</th>
                <th className="text-right py-2.5 px-3 font-semibold">Local Loss</th>
                <th className="text-right py-2.5 px-3 font-semibold">MAE (hrs)</th>
                <th className="text-right py-2.5 px-3 font-semibold">Jamming</th>
                <th className="text-right py-2.5 px-3 font-semibold">Byzantine Status</th>
              </tr>
            </thead>
            <tbody>
              {SECTORS.map((s) => (
                <tr key={s.id} className="border-b border-[#1e222d]/50 hover:bg-[#161922] transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-200">{s.shortCode}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{s.cluster}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{s.localLoss}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-200">{s.localMaeHours}h</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      s.isJammed
                        ? 'bg-zinc-900 text-amber-400 border border-amber-900/60'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                    }`}>
                      {s.isJammed ? 'JAMMED' : 'CLEAR'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      s.isCompromised
                        ? 'bg-zinc-900 text-rose-400 border border-rose-900/60'
                        : 'bg-zinc-900 text-zinc-300 border border-zinc-700'
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

export default RiskEarlyWarningView;
