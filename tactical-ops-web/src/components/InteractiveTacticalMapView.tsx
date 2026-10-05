import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { SECTORS, PASSES, CORRIDORS } from '../data/sectorsData';
import type { SectorDepot, StrategicPass } from '../data/sectorsData';
import {
  Sun,
  Moon,
  Satellite,
  Eye,
  EyeOff,
  Activity,
  Mountain
} from 'lucide-react';

interface InteractiveTacticalMapViewProps {
  activeSector: SectorDepot;
  onSelectSector: (sectorId: string) => void;
}

// Marker Factory
const createMarkerIcon = (sector: SectorDepot, isSelected: boolean) => {
  let color = '#06b6d4'; // cyan default
  if (sector.status === 'CRITICAL') color = '#f43f5e';
  if (sector.status === 'JAMMED') color = '#f59e0b';

  const html = `
    <div style="position: relative; width: 32px; height: 32px;">
      <div style="
        position: absolute;
        inset: 0;
        background: ${color}20;
        border: 2px solid ${isSelected ? '#ffffff' : color};
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: ${isSelected ? '0 0 16px #ffffff' : '0 0 10px ' + color + '60'};
        backdrop-filter: blur(4px);
      ">
        <span style="color: ${isSelected ? '#ffffff' : color}; font-size: 8px; font-weight: 800; font-family: monospace;">
          ${sector.id.replace('sec-', '').toUpperCase()}
        </span>
      </div>
      <div style="
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background: ${color};
        border-radius: 50%;
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-sector-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28]
  });
};

const createPassIcon = (pass: StrategicPass) => {
  let color = '#10b981';
  let char = 'P';
  if (pass.status === 'BLOCKED') {
    color = '#f43f5e';
    char = 'X';
  } else if (pass.status === 'ALERT') {
    color = '#f59e0b';
    char = '!';
  }

  const html = `
    <div style="
      width: 22px;
      height: 22px;
      background: #0f1219;
      border: 1.5px solid ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 8px ${color}80;
    ">
      <span style="color: ${color}; font-size: 9px; font-weight: 900;">${char}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pass-icon',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export const InteractiveTacticalMapView: React.FC<InteractiveTacticalMapViewProps> = ({
  activeSector,
  onSelectSector
}) => {
  const [mapStyle, setMapStyle] = useState<'DARK' | 'SATELLITE' | 'LIGHT'>('LIGHT');
  const [showLegend, setShowLegend] = useState<boolean>(true);

  // Map Tile layer mapping
  const getTileUrl = () => {
    if (mapStyle === 'SATELLITE') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  const getTileClass = () => {
    if (mapStyle === 'DARK') return 'leaflet-dark-tiles';
    if (mapStyle === 'SATELLITE') return 'leaflet-satellite-tiles';
    return 'leaflet-light-tiles';
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-[#0a0b0e]">
      {/* Top Banner (Exact InlandRoute pill: "NW-3 Route | 100.0% Navigable | 7 Reaches") */}
      <div className="absolute top-4 left-6 z-[400] flex items-center gap-3">
        <div className="bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-lg px-4 py-2 flex items-center gap-3 text-xs shadow-xl select-none">
          <div className="flex items-center gap-2 font-bold text-white">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>{activeSector.shortCode} Strategic Resupply Route</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="font-bold text-emerald-400 font-mono">100.0% Navigable</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-medium">4 Mountain Corridors</span>
        </div>
      </div>

      {/* Top Right Map Mode Switchers (Dark GIS | Satellite HD | Light | Hide Legend) */}
      <div className="absolute top-4 right-6 z-[400] flex items-center gap-2">
        <div className="bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-lg p-1 flex items-center gap-1 shadow-xl select-none">
          <button
            onClick={() => setMapStyle('DARK')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              mapStyle === 'DARK'
                ? 'bg-white text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark GIS</span>
          </button>

          <button
            onClick={() => setMapStyle('SATELLITE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              mapStyle === 'SATELLITE'
                ? 'bg-white text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite HD</span>
          </button>

          <button
            onClick={() => setMapStyle('LIGHT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              mapStyle === 'LIGHT'
                ? 'bg-white text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Light</span>
          </button>
        </div>

        <button
          onClick={() => setShowLegend(!showLegend)}
          className="bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 shadow-xl transition-colors cursor-pointer select-none"
        >
          {showLegend ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showLegend ? 'Hide Legend' : 'Show Legend'}</span>
        </button>
      </div>

      {/* Main Map Element */}
      <MapContainer
        center={[34.40, 77.25]}
        zoom={8}
        scrollWheelZoom={true}
        className={`w-full h-full ${getTileClass()}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={getTileUrl()}
          maxZoom={15}
          minZoom={6}
        />

        {/* Transit Corridors */}
        {CORRIDORS.map((corr) => {
          const isDrone = corr.transportMode.includes('Drone');
          const isFromActive = corr.fromId === activeSector.id || corr.toId === activeSector.id;

          return (
            <Polyline
              key={corr.id}
              positions={corr.coordinates}
              pathOptions={{
                color: isFromActive ? '#06b6d4' : isDrone ? '#10b981' : '#3b82f6',
                weight: isFromActive ? 4 : 2.5,
                dashArray: isDrone ? '6, 8' : undefined,
                opacity: isFromActive ? 0.95 : 0.65
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 text-xs text-slate-200">
                  <div className="font-bold border-b border-slate-700/80 pb-1 text-slate-100 flex items-center justify-between">
                    <span>{corr.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{corr.distanceKm} km</span>
                  </div>
                  <div className="space-y-0.5 text-[11px] text-slate-400">
                    <div>Transport: <span className="text-slate-200">{corr.transportMode}</span></div>
                    <div>Est. Transit: <span className="text-slate-200">{corr.transitHours} hrs</span></div>
                    <div>Fuel Burn: <span className="text-slate-200">{corr.fuelBurnLiters} Liters</span></div>
                    <div>Navigability: <span className="text-emerald-400 font-bold">{corr.navigabilityPct}%</span></div>
                    <div>EW Jamming Risk: <span className={corr.ewThreatLevel === 'SEVERE' ? 'text-rose-400 font-bold' : 'text-slate-300'}>{corr.ewThreatLevel}</span></div>
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Strategic Passes */}
        {PASSES.map((pass) => (
          <Marker
            key={pass.id}
            position={[pass.lat, pass.lng]}
            icon={createPassIcon(pass)}
          >
            <Popup>
              <div className="p-1 space-y-1 text-xs text-slate-200 min-w-[190px]">
                <div className="font-bold flex items-center gap-1.5 border-b border-slate-700 pb-1 text-amber-400">
                  <Mountain className="w-3.5 h-3.5" />
                  <span>{pass.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>Elevation: <span className="text-slate-200">{pass.altitudeFt.toLocaleString()} ft MSL</span></div>
                  <div>Status: <span className="text-slate-100 font-semibold">{pass.status}</span></div>
                  <div>Annual Snow Closure: <span className="text-slate-200">{pass.annualClosureDays} days</span></div>
                  <div className="text-[10px] text-slate-500 pt-0.5">{pass.connectedSectors}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Sector Depots */}
        {SECTORS.map((sector) => {
          const isSelected = sector.id === activeSector.id;
          return (
            <Marker
              key={sector.id}
              position={[sector.lat, sector.lng]}
              icon={createMarkerIcon(sector, isSelected)}
              eventHandlers={{
                click: () => onSelectSector(sector.id)
              }}
            >
              <Popup>
                <div className="p-1 space-y-2 text-xs text-slate-200 min-w-[220px]">
                  <div className="border-b border-slate-700 pb-1 flex items-center justify-between">
                    <span className="font-bold text-slate-100">{sector.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400">
                      {sector.shortCode}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                    <div>Elevation: <span className="text-slate-200">{sector.altitudeFt.toLocaleString()} ft</span></div>
                    <div>Force: <span className="text-slate-200">{sector.assignedForce.toLocaleString()}</span></div>
                    <div>Local Loss: <span className="text-slate-200">{sector.localLoss}</span></div>
                    <div>Lead Time MAE: <span className="text-slate-200">{sector.localMaeHours}h</span></div>
                  </div>
                  <button
                    onClick={() => onSelectSector(sector.id)}
                    className="w-full mt-2 py-1 rounded bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors cursor-pointer text-xs"
                  >
                    Select Operational Node
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Bottom Left Legend (Exact InlandRoute Legend Box) */}
      {showLegend && (
        <div className="absolute bottom-6 left-6 z-[400] bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-xl p-3.5 shadow-2xl text-xs space-y-2 min-w-[210px] select-none">
          <div className="font-bold text-[10px] uppercase tracking-wider text-slate-300 pb-1 border-b border-[#1e222d]">
            TAC-ROUTE NAVIGABILITY LEGEND
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>Navigable Corridor (Score &ge; 85%)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Conditional (60% &ndash; 84% Snow Risk)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
              <span>Non-Navigable (Avalanche / Blockage)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
