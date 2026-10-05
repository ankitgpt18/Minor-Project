import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import type { SectorDepot, MountainPass, TransitCorridor } from '../data/tacticalData';
import { Shield, Mountain, ArrowUpRight } from 'lucide-react';

interface TacticalMapProps {
  depots: SectorDepot[];
  passes: MountainPass[];
  corridors: TransitCorridor[];
  selectedDepot: SectorDepot | null;
  onSelectDepot: (depot: SectorDepot) => void;
  showRadarZones: boolean;
  showCorridors: boolean;
}

// Custom Leaflet Icons using clean SVG shapes without external assets
const createDepotIcon = (role: string, isJammed: boolean, isCompromised: boolean) => {
  let bgColor = '#06b6d4'; // cyan default
  let borderColor = '#22d3ee';
  let label = 'SEC';

  if (isCompromised) {
    bgColor = '#ef4444'; // red
    borderColor = '#f87171';
    label = 'ALERT';
  } else if (isJammed) {
    bgColor = '#f59e0b'; // amber
    borderColor = '#fbbf24';
    label = 'JAMMED';
  } else if (role.includes('Command')) {
    bgColor = '#3b82f6'; // blue
    borderColor = '#60a5fa';
    label = 'HQ';
  } else if (role.includes('Drone')) {
    bgColor = '#10b981'; // emerald
    borderColor = '#34d399';
    label = 'UAV';
  } else if (role.includes('Isolated')) {
    bgColor = '#8b5cf6'; // purple
    borderColor = '#a78bfa';
    label = 'POST';
  }

  const svgHtml = `
    <div style="position: relative; width: 34px; height: 34px;">
      <div style="
        position: absolute;
        inset: 0;
        background: ${bgColor}25;
        border: 2px solid ${borderColor};
        border-radius: 6px;
        box-shadow: 0 0 14px ${bgColor}50;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
      ">
        <span style="color: ${borderColor}; font-size: 8px; font-weight: 700; letter-spacing: -0.5px;">${label}</span>
      </div>
      <div style="
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background: ${borderColor};
        border-radius: 50%;
      "></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-depot-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32]
  });
};

const createPassIcon = (status: string) => {
  let color = '#10b981';
  let symbol = 'P';
  if (status === 'BLOCKED_SNOW') {
    color = '#f43f5e';
    symbol = 'X';
  } else if (status === 'RESTRICTED') {
    color = '#f59e0b';
    symbol = '!';
  }

  const svgHtml = `
    <div style="
      width: 22px;
      height: 22px;
      background: #0f172a;
      border: 1.5px solid ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 8px ${color}60;
    ">
      <span style="color: ${color}; font-size: 9px; font-weight: 800;">${symbol}</span>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-pass-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export const TacticalMap: React.FC<TacticalMapProps> = ({
  depots,
  passes,
  corridors,
  selectedDepot,
  onSelectDepot,
  showCorridors
}) => {
  // Center of Eastern Ladakh / Leh
  const mapCenter: [number, number] = [34.35, 77.40];

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-xl overflow-hidden border border-slate-800 bg-[#08090d]">
      <MapContainer
        center={mapCenter}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ background: '#08090d' }}
      >
        {/* OpenStreetMap public tiles with CSS dark inversion filter configured in index.css */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={14}
          minZoom={6}
        />

        {/* Tactical Transit Corridors */}
        {showCorridors &&
          corridors.map((corr) => {
            const isDrone = corr.transferType.includes('Drone');
            const strokeColor = isDrone ? '#10b981' : '#06b6d4';
            const isSelected =
              selectedDepot &&
              (selectedDepot.id === corr.sourceDepot || selectedDepot.id === corr.targetDepot);

            return (
              <Polyline
                key={corr.id}
                positions={corr.coordinates}
                pathOptions={{
                  color: isSelected ? '#38bdf8' : strokeColor,
                  weight: isSelected ? 4 : 2,
                  dashArray: isDrone ? '6, 8' : undefined,
                  opacity: isSelected ? 0.95 : 0.65
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 min-w-[210px] text-xs">
                    <div className="font-semibold text-slate-100 flex items-center justify-between border-b border-slate-700/60 pb-1">
                      <span>{corr.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {corr.distanceKm} km
                      </span>
                    </div>
                    <div className="text-slate-400 space-y-0.5 text-[11px]">
                      <div>Mode: <span className="text-slate-200">{corr.transferType}</span></div>
                      <div>Transit Latency: <span className="text-slate-200">{corr.avgTravelTimeHours} hrs</span></div>
                      <div>Road Quality Index: <span className="text-slate-200">{corr.roadConditionScore}/100</span></div>
                      <div>EW Intercept Risk: <span className={corr.enemyEWSpoofRisk === 'SEVERE' ? 'text-rose-400 font-medium' : 'text-slate-300'}>{corr.enemyEWSpoofRisk}</span></div>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            );
          })}

        {/* Mountain Passes */}
        {passes.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={createPassIcon(p.status)}
          >
            <Popup>
              <div className="p-1 space-y-1 min-w-[190px] text-xs">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5 border-b border-slate-700/60 pb-1">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" />
                  <span>{p.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>Elevation: <span className="text-slate-200">{p.altitudeFt.toLocaleString()} ft</span></div>
                  <div>Current Pass Status: <span className="text-slate-200 font-semibold">{p.status}</span></div>
                  <div>Annual Snow Closure: <span className="text-slate-200">{p.closureHistoryDaysAnnual} days</span></div>
                  <div className="text-[10px] text-slate-500 pt-0.5">{p.activeTransitCorridor}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Tactical Sector Depots */}
        {depots.map((depot) => (
          <Marker
            key={depot.id}
            position={[depot.lat, depot.lng]}
            icon={createDepotIcon(depot.role, depot.isJammed, depot.isCompromised)}
            eventHandlers={{
              click: () => onSelectDepot(depot)
            }}
          >
            <Popup>
              <div className="p-1 space-y-2 min-w-[240px] text-xs">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                  <div>
                    <div className="font-semibold text-slate-100">{depot.name}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{depot.code}</div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    depot.status === 'OPTIMAL' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' :
                    depot.status === 'CRITICAL_SHORTAGE' ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60' :
                    'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                  }`}>
                    {depot.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-400">
                  <div>Elevation: <span className="text-slate-200 font-mono">{depot.altitudeFt.toLocaleString()} ft</span></div>
                  <div>Assigned Force: <span className="text-slate-200 font-mono">{depot.troopsAssigned.toLocaleString()}</span></div>
                  <div>Local Loss: <span className="text-slate-200 font-mono">{depot.localModelMetrics.loss}</span></div>
                  <div>Lead Time MAE: <span className="text-slate-200 font-mono">{depot.localModelMetrics.maeHours}h</span></div>
                </div>

                <div className="border-t border-slate-800 pt-1.5 space-y-1 text-[11px]">
                  <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Critical Inventory Status:</div>
                  <div className="flex justify-between text-slate-400">
                    <span>155mm Heavy Shells:</span>
                    <span className="font-mono text-slate-200 font-medium">{depot.currentStock.artilleryShells155mm.toLocaleString()} rds</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Winter Diesel XWG:</span>
                    <span className="font-mono text-slate-200 font-medium">{depot.currentStock.winterDieselKL} KL</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>DFRL Rations Reserve:</span>
                    <span className="font-mono text-slate-200 font-medium">{depot.currentStock.highCalorieRationsDays} days</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectDepot(depot)}
                  className="w-full mt-2 py-1 px-2 rounded bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/50 text-cyan-300 text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Select Sector Node</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Tactical Map Overlay Controls */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 shadow-xl text-xs space-y-2 pointer-events-auto min-w-[180px]">
        <div className="font-semibold text-slate-300 text-[11px] flex items-center gap-1.5 pb-1 border-b border-slate-800">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Operational Layers</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block"></span>
            <span>HQ / Transit Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
            <span>Drone UAV Flight Base</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block"></span>
            <span>Frontier High-Altitude Post</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-emerald-400 border-b border-dashed inline-block"></span>
            <span>Drone Resupply Flight Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span>
            <span>Heavy Truck Ground Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};
