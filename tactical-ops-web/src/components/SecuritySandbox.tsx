import React from 'react';
import type { TacticalMetrics } from '../data/tacticalData';
import { ShieldCheck, Lock, Radio, Cpu, RefreshCw, Zap } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SecuritySandboxProps {
  metrics: TacticalMetrics;
  onToggleSecAgg: () => void;
  onToggleTopk: () => void;
  onToggleAdaptiveDp: () => void;
  onToggleDirectionalCosine: () => void;
  onToggleClusteredFl: () => void;
  onExecuteFederatedRound: () => void;
  isSimulatingRound: boolean;
}

export const SecuritySandbox: React.FC<SecuritySandboxProps> = ({
  metrics,
  onToggleSecAgg,
  onToggleTopk,
  onToggleAdaptiveDp,
  onToggleDirectionalCosine,
  onToggleClusteredFl,
  onExecuteFederatedRound,
  isSimulatingRound
}) => {
  // 10-round simulated convergence curve data
  const convergenceData = [
    { round: 'R1', BaselineIsolated: 3.2, VanillaFedAvg: 2.1, HardenedFL: 1.95 },
    { round: 'R3', BaselineIsolated: 3.1, VanillaFedAvg: 1.85, HardenedFL: 1.68 },
    { round: 'R6', BaselineIsolated: 3.0, VanillaFedAvg: 1.72, HardenedFL: 1.52 },
    { round: 'R9', BaselineIsolated: 2.95, VanillaFedAvg: 1.65, HardenedFL: 1.44 },
    { round: 'R12', BaselineIsolated: 2.9, VanillaFedAvg: 1.62, HardenedFL: 1.40 },
    { round: 'R15', BaselineIsolated: 2.85, VanillaFedAvg: 1.60, HardenedFL: 1.38 }
  ];

  return (
    <div className="border border-slate-800 rounded-xl bg-[#0b0d13] p-4 text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hardened Security & Privacy Execution Sandbox</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Evaluate privacy guarantees, radio stealth, and Byzantine defenses under active combat simulation.
          </p>
        </div>

        <button
          onClick={onExecuteFederatedRound}
          disabled={isSimulatingRound}
          className="py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-950 disabled:text-slate-500 text-slate-900 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingRound ? 'animate-spin' : ''}`} />
          <span>{isSimulatingRound ? 'Aggregating...' : 'Trigger P2P Gossip Round'}</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Lead Time MAE
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
            {metrics.globalLeadTimeMaeHours} hrs
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Cloud: {metrics.centralizedCloudMaeHours}h | Isolated: {metrics.isolatedDepotMaeHours}h
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Radio Payload
          </div>
          <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
            {metrics.topkSparsificationActive ? `${metrics.sparsifiedPayloadMb} MB` : `${metrics.uncompressedPayloadMb} MB`}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Burst: <span className="text-cyan-300 font-mono">{metrics.burstDurationMs} ms</span> ({metrics.topkSparsificationActive ? '90% pruned' : 'uncompressed'})
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Privacy Bound
          </div>
          <div className="text-lg font-bold font-mono text-purple-400 mt-1">
            &epsilon; = {metrics.adaptiveDpActive ? metrics.formalEpsilonBound : '0.00 (Plaintext)'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            &delta; = {metrics.formalDeltaBound} (Rényi Accountant)
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Byzantine Rejection
          </div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1">
            {metrics.directionalCosineActive ? `${metrics.byzantineRejectionRatePct}%` : '0.0% (Vulnerable)'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Directional Cosine Momentum
          </div>
        </div>
      </div>

      {/* 5 Hardened Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
        {/* Toggle 1 */}
        <div
          onClick={onToggleAdaptiveDp}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            metrics.adaptiveDpActive
              ? 'bg-purple-950/40 border-purple-800/80 text-purple-200'
              : 'bg-slate-900/30 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Adaptive Rényi DP-SGD</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              metrics.adaptiveDpActive ? 'bg-purple-900 text-purple-200' : 'bg-slate-800 text-slate-500'
            }`}>
              {metrics.adaptiveDpActive ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Dynamic clipping threshold Ct + layer-wise perturbation to prevent GI-SMN inversion.
          </p>
        </div>

        {/* Toggle 2 */}
        <div
          onClick={onToggleSecAgg}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            metrics.secAggActive
              ? 'bg-cyan-950/40 border-cyan-800/80 text-cyan-200'
              : 'bg-slate-900/30 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>SecAgg+ Zero-Knowledge Masking</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              metrics.secAggActive ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-800 text-slate-500'
            }`}>
              {metrics.secAggActive ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Pairwise Diffie-Hellman secret masks; intercepted packets appear as uniform random noise.
          </p>
        </div>

        {/* Toggle 3 */}
        <div
          onClick={onToggleTopk}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            metrics.topkSparsificationActive
              ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
              : 'bg-slate-900/30 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Top-k Sparsification (90%)</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              metrics.topkSparsificationActive ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-800 text-slate-500'
            }`}>
              {metrics.topkSparsificationActive ? '1.42 MB' : '14.2 MB'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            10x gradient compression with client error accumulation buffers for micro-burst radio.
          </p>
        </div>

        {/* Toggle 4 */}
        <div
          onClick={onToggleDirectionalCosine}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            metrics.directionalCosineActive
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
              : 'bg-slate-900/30 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Directional Momentum Filter</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              metrics.directionalCosineActive ? 'bg-amber-900 text-amber-200' : 'bg-slate-800 text-slate-500'
            }`}>
              {metrics.directionalCosineActive ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Cosine similarity validation against historical momentum; blocks Layer Smoothing Backdoors.
          </p>
        </div>

        {/* Toggle 5 */}
        <div
          onClick={onToggleClusteredFl}
          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
            metrics.clusteredFlActive
              ? 'bg-blue-950/40 border-blue-800/80 text-blue-200'
              : 'bg-slate-900/30 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Clustered Federated Learning (CFL)</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              metrics.clusteredFlActive ? 'bg-blue-900 text-blue-200' : 'bg-slate-800 text-slate-500'
            }`}>
              {metrics.clusteredFlActive ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Partitions nodes into Munitions, Infantry, and Drone clusters to mitigate Non-IID client drift.
          </p>
        </div>
      </div>

      {/* Multi-Round Convergence Chart */}
      <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/70 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span>Decentralized Convergence: Lead Time MAE Across Training Rounds</span>
          <span className="text-[10px] font-mono text-cyan-400">Flower Multi-Node Simulation</span>
        </div>
        <div className="w-full h-44">
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
    </div>
  );
};
