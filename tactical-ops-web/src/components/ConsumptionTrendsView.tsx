import React, { useState } from 'react';
import type { SectorDepot } from '../data/sectorsData';
import { SECTORS } from '../data/sectorsData';
import {
  Activity,
  Flame,
  Droplets,
  Package,
  Battery,
  TrendingDown,
  Calendar
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
  LineChart,
  Line,
  Legend
} from 'recharts';

interface ConsumptionTrendsViewProps {
  activeSector: SectorDepot;
}

// Simulated 12-month consumption history for active sector
const generateMonthlyData = (sector: SectorDepot) => {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const base = sector.predicted30D;
  return months.map((m, i) => {
    // Winter months (Oct-Mar) have higher consumption
    const winterFactor = i >= 6 ? 1.0 + (i - 5) * 0.12 : 0.85 + Math.random() * 0.15;
    return {
      month: m,
      Artillery: Math.round(base.artillery155mm * winterFactor * (0.9 + Math.random() * 0.2)),
      Diesel: Math.round(base.winterDieselKL * winterFactor * (0.85 + Math.random() * 0.3)),
      Rations: Math.round(base.dfrlRationsDays * winterFactor * (0.95 + Math.random() * 0.1)),
      DroneCells: Math.round(base.droneBatteryCells * winterFactor * (0.8 + Math.random() * 0.4)),
    };
  });
};

// Stock depletion forecast (next 90 days)
const generateDepletionForecast = (sector: SectorDepot) => {
  const days = [0, 15, 30, 45, 60, 75, 90];
  const stock = sector.stockLevel;
  const burn = sector.predicted30D;

  return days.map((d) => ({
    day: `D+${d}`,
    Artillery: Math.max(0, Math.round(stock.artillery155mm - (burn.artillery155mm / 30) * d)),
    Diesel: Math.max(0, Math.round(stock.winterDieselKL - (burn.winterDieselKL / 30) * d)),
    Rations: Math.max(0, Math.round(stock.dfrlRationsDays - (burn.dfrlRationsDays / 30) * d)),
    DroneCells: Math.max(0, Math.round(stock.droneBatteryCells - (burn.droneBatteryCells / 30) * d)),
  }));
};

// Cross-sector comparison data
const generateCrossSectorComparison = () => {
  return SECTORS.map((s) => ({
    name: s.shortCode.replace('SEC-', '').replace(': ', ' '),
    StockDays: Math.round(s.stockLevel.dfrlRationsDays),
    BurnRate: Math.round(s.predicted30D.dfrlRationsDays),
    DieselKL: s.stockLevel.winterDieselKL,
    ArtilleryRounds: Math.round(s.stockLevel.artillery155mm / 100),
  }));
};

export const ConsumptionTrendsView: React.FC<ConsumptionTrendsViewProps> = ({
  activeSector
}) => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'depletion' | 'comparison'>('monthly');

  const monthlyData = generateMonthlyData(activeSector);
  const depletionData = generateDepletionForecast(activeSector);
  const comparisonData = generateCrossSectorComparison();

  // Summary KPIs
  const daysUntilDieselEmpty = Math.round(activeSector.stockLevel.winterDieselKL / (activeSector.predicted30D.winterDieselKL / 30));
  const daysUntilAmmoEmpty = Math.round(activeSector.stockLevel.artillery155mm / (activeSector.predicted30D.artillery155mm / 30));
  const rationCoverage = activeSector.stockLevel.dfrlRationsDays;
  const droneCellDays = Math.round(activeSector.stockLevel.droneBatteryCells / (activeSector.predicted30D.droneBatteryCells / 30));

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e222d] pb-4">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Consumption Dynamics and Winter Stocking Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            On-device federated time-series predictions calibrated against DFRL 4,500 kcal standards and BRO pass closure records.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#12141a] border border-[#1e222d] rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-white text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly Burn
          </button>
          <button
            onClick={() => setActiveTab('depletion')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'depletion'
                ? 'bg-white text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Depletion Forecast
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-white text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cross-Sector
          </button>
        </div>
      </div>

      {/* 4 Depletion KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-rose-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ammo Runway</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{daysUntilAmmoEmpty}d</div>
            <div className="text-[10px] text-slate-500">155mm shells at current burn</div>
          </div>
        </div>

        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-cyan-400 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Diesel Runway</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{daysUntilDieselEmpty}d</div>
            <div className="text-[10px] text-slate-500">Winter XWG grade coverage</div>
          </div>
        </div>

        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-amber-400 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ration Stock</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{rationCoverage}d</div>
            <div className="text-[10px] text-slate-500">DFRL high-cal ration packs</div>
          </div>
        </div>

        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-emerald-400 shrink-0">
            <Battery className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Drone Cell Runway</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{droneCellDays}d</div>
            <div className="text-[10px] text-slate-500">Cold-rated LiPo cells</div>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      {activeTab === 'monthly' && (
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-white">12-Month Consumption Burn Rate</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Historical monthly consumption at {activeSector.shortCode} with winter escalation curve
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-300">Artillery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                <span className="text-slate-300">Diesel (KL)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-300">Rations</span>
              </div>
            </div>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="artGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="dieselGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c202a" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0e1015', border: '1px solid #1e222d', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="Artillery" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#artGrad)" name="155mm Rounds" />
                <Area type="monotone" dataKey="Diesel" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#dieselGrad)" name="Diesel (KL)" />
                <Area type="monotone" dataKey="Rations" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={0} name="Rations (Days)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'depletion' && (
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span>90-Day Stock Depletion Forecast</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Projected runway at current daily burn rate for {activeSector.shortCode}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
              Federated GRU Prediction
            </span>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={depletionData} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c202a" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0e1015', border: '1px solid #1e222d', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="Artillery" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="155mm Rounds" />
                <Line type="monotone" dataKey="Diesel" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} name="Diesel (KL)" />
                <Line type="monotone" dataKey="DroneCells" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Drone Cells" />
                <Legend
                  wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Cross-Sector Stock Comparison</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ration days, diesel reserves, and artillery stock across all forward depots
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Clustered FL Aggregation
            </span>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c202a" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0e1015', border: '1px solid #1e222d', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="StockDays" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Ration Stock (Days)" />
                <Bar dataKey="DieselKL" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Diesel (KL)" />
                <Bar dataKey="ArtilleryRounds" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Artillery (x100)" />
                <Legend
                  wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AWS Readiness Summary Table */}
      <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Advance Winter Stocking (AWS) Readiness Matrix</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pre-winter isolation stockpile status across all forward operating bases
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            AWS FY 2026-27
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e222d] text-slate-400">
                <th className="text-left py-2.5 px-3 font-bold">Depot</th>
                <th className="text-right py-2.5 px-3 font-bold">155mm Shells</th>
                <th className="text-right py-2.5 px-3 font-bold">Diesel (KL)</th>
                <th className="text-right py-2.5 px-3 font-bold">Rations (Days)</th>
                <th className="text-right py-2.5 px-3 font-bold">Drone Cells</th>
                <th className="text-right py-2.5 px-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {SECTORS.map((s) => {
                const isLow = s.stockLevel.dfrlRationsDays < 40;
                return (
                  <tr key={s.id} className="border-b border-[#1e222d]/50 hover:bg-[#161922] transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-200">{s.shortCode}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{s.stockLevel.artillery155mm.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{s.stockLevel.winterDieselKL}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{s.stockLevel.dfrlRationsDays}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">{s.stockLevel.droneBatteryCells}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        isLow
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {isLow ? 'CRITICAL' : 'STOCKED'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
