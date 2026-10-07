import React from 'react';
import type { SectorDepot } from '../data/sectorsData';
import { CORRIDORS, PASSES } from '../data/sectorsData';
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

// Dynamic elevation profile generator per sector
const getSectorElevationProfile = (sectorId: string) => {
  switch (sectorId) {
    case 'sec-dbo':
      return [
        { km: 0, distance: '0 km', elevationM: 3500, targetAltitude: 4500, passLabel: 'Leh Base (3,500m)' },
        { km: 78, distance: '78 km', elevationM: 5359, targetAltitude: 4500, passLabel: 'Khardung La Pass (5,359m)' },
        { km: 118, distance: '118 km', elevationM: 3144, targetAltitude: 4500, passLabel: 'Diskit Drone Hub' },
        { km: 165, distance: '165 km', elevationM: 4100, targetAltitude: 4500, passLabel: 'Shyok River Confluence' },
        { km: 210, distance: '210 km', elevationM: 4700, targetAltitude: 4500, passLabel: 'Murgo Staging Point' },
        { km: 258, distance: '258 km', elevationM: 5064, targetAltitude: 4500, passLabel: 'DBO Airfield (5,064m)' }
      ];
    case 'sec-kargil':
      return [
        { km: 0, distance: '0 km', elevationM: 2676, targetAltitude: 4500, passLabel: 'Kargil Base (2,676m)' },
        { km: 55, distance: '55 km', elevationM: 3700, targetAltitude: 4500, passLabel: 'Namika La Pass (3,700m)' },
        { km: 110, distance: '110 km', elevationM: 4108, targetAltitude: 4500, passLabel: 'Fotu La Pass (4,108m)' },
        { km: 165, distance: '165 km', elevationM: 3150, targetAltitude: 4500, passLabel: 'Lamayuru Plateau' },
        { km: 216, distance: '216 km', elevationM: 3524, targetAltitude: 4500, passLabel: 'Leh Logistics Hub (3,524m)' }
      ];
    case 'sec-nyoma':
      return [
        { km: 0, distance: '0 km', elevationM: 3500, targetAltitude: 4500, passLabel: 'Leh Base (3,500m)' },
        { km: 48, distance: '48 km', elevationM: 3600, targetAltitude: 4500, passLabel: 'Upshi Strategic Junction' },
        { km: 105, distance: '105 km', elevationM: 4020, targetAltitude: 4500, passLabel: 'Chumathang Thermal Camp' },
        { km: 150, distance: '150 km', elevationM: 4200, targetAltitude: 4500, passLabel: 'Mahe Bridge Checkpoint' },
        { km: 182, distance: '182 km', elevationM: 4180, targetAltitude: 4500, passLabel: 'Nyoma Advanced Depot (4,180m)' }
      ];
    case 'sec-diskit':
      return [
        { km: 0, distance: '0 km', elevationM: 3500, targetAltitude: 4500, passLabel: 'Leh Airhead (3,500m)' },
        { km: 42, distance: '42 km', elevationM: 4600, targetAltitude: 4500, passLabel: 'South Pullu' },
        { km: 78, distance: '78 km', elevationM: 5359, targetAltitude: 4500, passLabel: 'Khardung La (5,359m)' },
        { km: 100, distance: '100 km', elevationM: 4200, targetAltitude: 4500, passLabel: 'North Pullu' },
        { km: 118, distance: '118 km', elevationM: 3144, targetAltitude: 4500, passLabel: 'Diskit Drone Hub (3,144m)' }
      ];
    case 'sec-leh':
    default:
      return [
        { km: 0, distance: '0 km', elevationM: 3500, targetAltitude: 4500, passLabel: 'Leh Staging (3,500m)' },
        { km: 45, distance: '45 km', elevationM: 3200, targetAltitude: 4500, passLabel: 'Khaltsi Bridge' },
        { km: 90, distance: '90 km', elevationM: 4108, targetAltitude: 4500, passLabel: 'Fotu La Pass (4,108m)' },
        { km: 150, distance: '150 km', elevationM: 3100, targetAltitude: 4500, passLabel: 'Mulbekh' },
        { km: 216, distance: '216 km', elevationM: 2676, targetAltitude: 4500, passLabel: 'Kargil Division Base (2,676m)' }
      ];
  }
};

// Dynamic dispatch queues per sector
const getSectorDispatchQueue = (sectorId: string) => {
  switch (sectorId) {
    case 'sec-dbo':
      return [
        { title: 'Sub-Zero Drone Battery Sortie', route: 'Diskit Hub to DBO Advance Post', status: 'EN ROUTE', statusColor: 'text-amber-400' },
        { title: 'Emergency DFRL High-Calorie Rations', route: 'Forward Air-Drop via Siachen Sector', status: 'QUEUED', statusColor: 'text-slate-400' }
      ];
    case 'sec-kargil':
      return [
        { title: '155mm Heavy Shells Road Convoy', route: 'Leh Central Ordnance to 8 Mtn Div', status: 'EN ROUTE', statusColor: 'text-amber-400' },
        { title: 'Winter XWG Diesel Tanker Sortie', route: 'Zojila Axis to Dras Logistics Depot', status: 'QUEUED', statusColor: 'text-slate-400' }
      ];
    case 'sec-nyoma':
      return [
        { title: 'Thermal Engine Preheat Spares Convoy', route: 'Upshi Strategic Junction to Nyoma', status: 'EN ROUTE', statusColor: 'text-amber-400' },
        { title: 'Pangong South Munitions Buffer Sortie', route: 'Chumathang to Chushul Post', status: 'QUEUED', statusColor: 'text-slate-400' }
      ];
    case 'sec-diskit':
      return [
        { title: 'UAV Rotor Replacement & Avionics Sortie', route: 'Diskit Autonomous Hub to Panamik', status: 'EN ROUTE', statusColor: 'text-amber-400' },
        { title: 'Cold-Rated LiPo Recharge Sortie', route: 'Nubra Perimeter to Forward Heli-Pad', status: 'QUEUED', statusColor: 'text-slate-400' }
      ];
    case 'sec-leh':
    default:
      return [
        { title: 'Advance Winter Stocking Central Aggregation', route: 'Northern Command to 14 Corps Base', status: 'EN ROUTE', statusColor: 'text-amber-400' },
        { title: 'High-Altitude Medical Evacuation Sortie', route: 'Command Hospital Leh to Forward Sectors', status: 'QUEUED', statusColor: 'text-slate-400' }
      ];
  }
};

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  activeSector
}) => {
  // 1. CALCULATIVE NAVIGABILITY SCORE
  const connectedCorridors = CORRIDORS.filter(
    (c) => c.fromId === activeSector.id || c.toId === activeSector.id
  );
  const avgCorridorNav = connectedCorridors.length > 0
    ? connectedCorridors.reduce((acc, c) => acc + c.navigabilityPct, 0) / connectedCorridors.length
    : 90.0;
  
  const navigabilityScore = +(
    avgCorridorNav -
    (activeSector.isJammed ? 6.5 : 0) -
    (activeSector.status === 'CRITICAL' ? 14.0 : 0)
  ).toFixed(1);

  const navigabilityDelta = navigabilityScore >= 90 ? '+3.8%' : navigabilityScore >= 80 ? '+1.2%' : '-12.8%';

  // 2. CALCULATIVE NAVIGABLE REACH
  const navigableReachKm = connectedCorridors.reduce((acc, c) => acc + c.distanceKm, 0);
  const navigableReachDelta = activeSector.status === 'CRITICAL' ? '-14%' : activeSector.isJammed ? '-5%' : '+8%';

  // 3. CALCULATIVE ACTIVE RISK WARNINGS
  let warningCount = 0;
  if (activeSector.isJammed) warningCount += 2;
  if (activeSector.isCompromised) warningCount += 2;
  if (activeSector.stockLevel.dfrlRationsDays < 40) warningCount += 2;
  if (activeSector.altitudeFt > 15000) warningCount += 1;
  if (activeSector.status === 'JAMMED') warningCount += 1;
  warningCount += PASSES.filter((p) => p.status === 'ALERT' || p.status === 'BLOCKED').length;
  if (activeSector.id === 'sec-dbo' || activeSector.id === 'sec-diskit') warningCount += 1; // Sasser Pass threat
  const finalWarningCount = Math.max(1, warningCount);

  // 4. CALCULATIVE SAFETY INDEX
  const rawSafety = 1.0 - (activeSector.localLoss * 0.8) - (activeSector.isJammed ? 0.08 : 0) - (activeSector.isCompromised ? 0.15 : 0) - (activeSector.stockLevel.dfrlRationsDays < 30 ? 0.07 : 0);
  const safetyIndex = Math.max(0.65, Math.min(0.99, +rawSafety.toFixed(2)));
  const safetyDelta = safetyIndex >= 0.9 ? '+2.1%' : safetyIndex >= 0.8 ? '+0.4%' : '-6.5%';

  // Dynamic elevation profile & dispatch queue for active sector
  const elevationProfileData = getSectorElevationProfile(activeSector.id);
  const totalCorridorKm = elevationProfileData[elevationProfileData.length - 1].km;
  const dispatchQueue = getSectorDispatchQueue(activeSector.id);

  const stockBarData = [
    {
      item: '155mm Shells (x10)',
      Current: Math.round(activeSector.stockLevel.artillery155mm / 10),
      Predicted30D: Math.round(activeSector.predicted30D.artillery155mm / 10)
    },
    {
      item: 'Winter Diesel (KL)',
      Current: activeSector.stockLevel.winterDieselKL,
      Predicted30D: activeSector.predicted30D.winterDieselKL
    },
    {
      item: 'DFRL Rations (Days)',
      Current: activeSector.stockLevel.dfrlRationsDays,
      Predicted30D: activeSector.predicted30D.dfrlRationsDays
    },
    {
      item: 'Drone Cells',
      Current: activeSector.stockLevel.droneBatteryCells,
      Predicted30D: activeSector.predicted30D.droneBatteryCells
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto">
      {/* 4 Primary KPI Cards (Fully Calculative per active sector) */}
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
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{navigabilityScore}%</span>
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-0.5">
              {navigabilityDelta.startsWith('+') ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-rose-400" />}
              {navigabilityDelta}
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
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{navigableReachKm} km</span>
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-0.5">
              {navigableReachDelta.startsWith('+') ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-rose-400" />}
              {navigableReachDelta}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Operational corridor &ge; 4.5m width requirement across {activeSector.shortCode} approaches
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
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{finalWarningCount}</span>
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-0.5">
              {finalWarningCount <= 2 ? <TrendingDown className="w-3 h-3 text-emerald-400" /> : <TrendingUp className="w-3 h-3 text-amber-400" />}
              {finalWarningCount <= 2 ? 'Low Threat' : 'Elevated'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Snow-drift bottlenecks, RF jamming & sub-zero risks flagged for {activeSector.shortCode}
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
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{safetyIndex}</span>
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-0.5">
              {safetyDelta.startsWith('+') ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-rose-400" />}
              {safetyDelta}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Clustered FL + ST-GNN prediction confidence score across {activeSector.shortCode} forward outposts
          </p>
        </div>
      </div>

      {/* Main Longitudinal Profile Chart (Uniform Slate/Monochrome Palette) */}
      <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white">Longitudinal Frontier Elevation Profile</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Terrain elevation gradient along {activeSector.shortCode} approach corridor ({totalCorridorKm} km transit span)
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
            <AreaChart data={elevationProfileData} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
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
                On-device federated demand predictions across munitions, fuel, rations, and drone battery banks at {activeSector.shortCode}
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
              {dispatchQueue.map((item, idx) => (
                <div key={idx} className="p-2 rounded bg-[#11131a] border border-[#1e2330] flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-200">{item.title}</div>
                    <div className="text-[10px] text-slate-500">{item.route}</div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${item.statusColor}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboardView;
