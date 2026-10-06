import React from 'react';
import type { SectorDepot } from '../data/sectorsData';
import { LONGITUDINAL_ELEVATION_PROFILE } from '../data/sectorsData';
import {
  Navigation,
  Waves,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Line
} from 'recharts';

interface ExecutiveDashboardViewProps {
  activeSector: SectorDepot;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  activeSector
}) => {
  const stockBarData = [
    {
      item: '155mm Heavy Shells (x10)',
      Current: Math.round(activeSector.stockLevel.artillery155mm / 10),
      Predicted30D: Math.round(activeSector.predicted30D.artillery155mm / 10)
    },
    {
      item: 'Winter Diesel XWG (KL)',
      Current: activeSector.stockLevel.winterDieselKL,
      Predicted30D: activeSector.predicted30D.winterDieselKL
    },
    {
      item: 'DFRL Rations (Days)',
      Current: activeSector.stockLevel.dfrlRationsDays,
      Predicted30D: activeSector.predicted30D.dfrlRationsDays
    },
    {
      item: 'Cold Drone Cells',
      Current: activeSector.stockLevel.droneBatteryCells,
      Predicted30D: activeSector.predicted30D.droneBatteryCells
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto">
      {/* 4 Primary KPI Cards (Clean Dark Palette matching InlandRoute) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: NAVIGABILITY SCORE */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4.5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">NAVIGABILITY SCORE</span>
            <div className="w-7 h-7 rounded-lg bg-[#161922] border border-[#232835] flex items-center justify-center text-slate-400">
              <Navigation className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">100.0%</span>
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +4.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Overall {activeSector.shortCode} open for 10-Ton HMVs & UAV vertical lift this period
          </p>
        </div>

        {/* CARD 2: NAVIGABLE REACH */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4.5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">NAVIGABLE REACH</span>
            <div className="w-7 h-7 rounded-lg bg-[#161922] border border-[#232835] flex items-center justify-center text-slate-400">
              <Waves className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">216 km</span>
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Clear corridor &ge; 4.5m width requirement across mountain switchbacks this period
          </p>
        </div>

        {/* CARD 3: ACTIVE RISK WARNINGS */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4.5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ACTIVE RISK WARNINGS</span>
            <div className="w-7 h-7 rounded-lg bg-[#161922] border border-[#232835] flex items-center justify-center text-slate-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">7</span>
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> -15%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Snow-drift bottlenecks & RF electronic jamming spots flagged this period
          </p>
        </div>

        {/* CARD 4: TACTICAL SAFETY INDEX */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4.5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">TACTICAL RESUPPLY SAFETY INDEX</span>
            <div className="w-7 h-7 rounded-lg bg-[#161922] border border-[#232835] flex items-center justify-center text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">0.94</span>
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +2.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Clustered FL + ST-GNN prediction confidence score across forward sector outposts
          </p>
        </div>
      </div>

      {/* Main Longitudinal Profile Chart (Uniform Slate/Monochrome Palette) */}
      <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white">Longitudinal Frontier Elevation Profile</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Terrain elevation gradient along {activeSector.shortCode} reach (258 km corridor)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="text-slate-300 text-[11px]">Altitude (m)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-t border-dashed border-slate-500"></span>
              <span className="text-slate-400 text-[11px]">4,500m Combat Threshold</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Profile */}
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={LONGITUDINAL_ELEVATION_PROFILE} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c202a" vertical={false} />
              <XAxis dataKey="distance" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[2000, 6000]} unit="m" />
              <Tooltip
                contentStyle={{ background: '#0e1015', border: '1px solid #1e222d', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }}
              />
              <Area
                type="natural"
                dataKey="elevationM"
                stroke="#e2e8f0"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#elevationGrad)"
                name="Frontier Elevation"
              />
              <Line
                type="monotone"
                dataKey="targetAltitude"
                stroke="#64748b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
                name="4,500m Atmospheric Limit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Row: Inventory Stock vs Burn Bar Visualizer & Cluster Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Critical Combat Reserve vs. 30-Day Demand Forecast</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                On-device federated demand predictions across munitions, fuel, rations, and drone battery banks
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              DP-SGD (eps=1.85)
            </span>
          </div>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockBarData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c202a" vertical={false} />
                <XAxis dataKey="item" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0e1015', border: '1px solid #1e222d', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }}
                />
                <Bar dataKey="Current" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Current Base Reserve" />
                <Bar dataKey="Predicted30D" fill="#475569" radius={[4, 4, 0, 0]} name="Predicted 30-Day Burn" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Local Sector Profile Card */}
        <div className="lg:col-span-4 bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1e222d] pb-2.5">
              <span className="text-xs font-bold text-white">{activeSector.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {activeSector.status}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Assigned Sector Force:</span>
                <span className="text-slate-100 font-mono font-bold">{activeSector.assignedForce.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Elevation:</span>
                <span className="text-slate-100 font-mono font-bold">{activeSector.altitudeFt.toLocaleString()} ft MSL</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Functional Cluster:</span>
                <span className="text-slate-200 font-medium">{activeSector.cluster}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Local Lead Time MAE:</span>
                <span className="text-slate-100 font-mono font-bold">{activeSector.localMaeHours} hrs</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Local Convergence Loss:</span>
                <span className="text-slate-300 font-mono">{activeSector.localLoss}</span>
              </div>
            </div>
          </div>

          {/* Tactical Logistics Queue */}
          <div className="p-3.5 rounded-lg bg-[#161922] border border-[#232835] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Active Supply Dispatch Queue</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-400 border border-zinc-700 font-bold">
                QUEUE: 2 PENDING
              </span>
            </div>
            
            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded bg-[#11131a] border border-[#1e2330] flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-200">155mm Artillery Resupply Sortie</div>
                  <div className="text-[10px] text-slate-500">Route: Leh Base to {activeSector.name.split(' (')[0]}</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400">EN ROUTE</span>
              </div>

              <div className="p-2 rounded bg-[#11131a] border border-[#1e2330] flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-200">Winterized High-Calorie Rations</div>
                  <div className="text-[10px] text-slate-500">Buffer: 30-Day Forward Allocation</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">QUEUED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboardView;
