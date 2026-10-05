import React from 'react';
import type { SectorDepot } from '../data/tacticalData';
import { Box, Fuel, Utensils, Cpu, TrendingUp, AlertOctagon, Radio, MapPin } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DepotDetailPanelProps {
  depot: SectorDepot | null;
  onSimulateJamming: (depotId: string) => void;
  onSimulateCompromise: (depotId: string) => void;
}

export const DepotDetailPanel: React.FC<DepotDetailPanelProps> = ({
  depot,
  onSimulateJamming,
  onSimulateCompromise
}) => {
  if (!depot) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center border border-slate-800 rounded-xl bg-[#0b0d13]">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-500">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300">No Sector Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
          Click on any forward base or transit hub on the tactical map to inspect local telemetry.
        </p>
      </div>
    );
  }

  const comparisonData = [
    {
      name: '155mm Shells (x10)',
      Current: Math.round(depot.currentStock.artilleryShells155mm / 10),
      Predicted30D: Math.round(depot.predicted30DayDemand.artilleryShells155mm / 10)
    },
    {
      name: 'Diesel (KL)',
      Current: depot.currentStock.winterDieselKL,
      Predicted30D: depot.predicted30DayDemand.winterDieselKL
    },
    {
      name: 'Rations (Days)',
      Current: depot.currentStock.highCalorieRationsDays,
      Predicted30D: depot.predicted30DayDemand.highCalorieRationsDays
    },
    {
      name: 'Drone Cells',
      Current: depot.currentStock.droneBatteryCells,
      Predicted30D: depot.predicted30DayDemand.droneBatteryCells
    }
  ];

  return (
    <div className="h-full flex flex-col border border-slate-800 rounded-xl bg-[#0b0d13] p-4 text-xs overflow-y-auto space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
            {depot.code}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
            depot.status === 'OPTIMAL' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60' :
            depot.status === 'CRITICAL_SHORTAGE' ? 'bg-rose-950/80 text-rose-400 border-rose-800/60' :
            'bg-amber-950/80 text-amber-400 border-amber-800/60'
          }`}>
            {depot.status}
          </span>
        </div>
        <h2 className="text-sm font-bold text-slate-100 mt-1.5">{depot.name}</h2>
        <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
          <span>{depot.altitudeFt.toLocaleString()} ft MSL</span>
          <span>&bull;</span>
          <span>{depot.troopsAssigned.toLocaleString()} Assigned Personnel</span>
        </div>
      </div>

      {/* Cluster Allocation */}
      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
          <span>Clustered FL Allocation</span>
          <span className="text-cyan-400 font-mono text-[9px]">CFL-CLUSTER</span>
        </div>
        <div className="text-slate-200 font-medium">{depot.cluster}</div>
        <p className="text-[10px] text-slate-500">
          Base elevation features shared across all 5 nodes; specialized forecasting heads train within functional cluster.
        </p>
      </div>

      {/* 4 Inventory Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span>155mm Heavy Shells</span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono mt-1">
            {depot.currentStock.artilleryShells155mm.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">rds</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            30D Burn: <span className="text-amber-400 font-mono">{depot.predicted30DayDemand.artilleryShells155mm}</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Fuel className="w-3.5 h-3.5 text-cyan-400" />
            <span>Winter Diesel XWG</span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono mt-1">
            {depot.currentStock.winterDieselKL} <span className="text-[10px] text-slate-500 font-normal">KL</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            30D Burn: <span className="text-cyan-400 font-mono">{depot.predicted30DayDemand.winterDieselKL} KL</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Utensils className="w-3.5 h-3.5 text-emerald-400" />
            <span>DFRL Rations Reserve</span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono mt-1">
            {depot.currentStock.highCalorieRationsDays} <span className="text-[10px] text-slate-500 font-normal">days</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            30D Burn: <span className="text-emerald-400 font-mono">{depot.predicted30DayDemand.highCalorieRationsDays} days</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Cold-Rated Drone Cells</span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono mt-1">
            {depot.currentStock.droneBatteryCells} <span className="text-[10px] text-slate-500 font-normal">cells</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            30D Burn: <span className="text-purple-400 font-mono">{depot.predicted30DayDemand.droneBatteryCells}</span>
          </div>
        </div>
      </div>

      {/* Demand vs Current Stock Recharts Visualizer */}
      <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span>Current Stock vs. Predicted 30-Day Burn</span>
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="w-full h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '6px', fontSize: '10px' }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
              />
              <Bar dataKey="Current" fill="#06b6d4" radius={[3, 3, 0, 0]} name="Current Stock" />
              <Bar dataKey="Predicted30D" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Predicted 30D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Node Threat Simulation Toggles */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Local Node Threat Simulation
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSimulateJamming(depot.id)}
            className={`py-1.5 px-2 rounded border flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer text-[11px] ${
              depot.isJammed
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80'
            }`}
          >
            <Radio className="w-3 h-3 text-amber-400" />
            <span>{depot.isJammed ? 'Jamming Active' : 'Inject EW Jamming'}</span>
          </button>

          <button
            onClick={() => onSimulateCompromise(depot.id)}
            className={`py-1.5 px-2 rounded border flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer text-[11px] ${
              depot.isCompromised
                ? 'bg-rose-950 text-rose-300 border-rose-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80'
            }`}
          >
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            <span>{depot.isCompromised ? 'Compromised' : 'Simulate Capture'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
