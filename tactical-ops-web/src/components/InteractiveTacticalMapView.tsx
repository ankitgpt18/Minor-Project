import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet';
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

// Uniform Monochrome Sector Badge
const createMarkerIcon = (sector: SectorDepot, isSelected: boolean) => {
  const isCritical = sector.status === 'CRITICAL';
  const html = `
    <div style="
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      background: ${isSelected ? '#ffffff' : '#0e1117'};
      border: 1px solid ${isSelected ? '#ffffff' : isCritical ? '#7f1d1d' : '#272d3b'};
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.7);
      cursor: pointer;
      white-space: nowrap;
    ">
      <span style="
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: ${isSelected ? '#090a0d' : isCritical ? '#ef4444' : '#94a3b8'};
      "></span>
      <span style="
        color: ${isSelected ? '#090a0d' : '#f1f5f9'};
        font-size: 10px;
        font-weight: 700;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        letter-spacing: 0.5px;
      ">
        ${sector.id.replace('sec-', '').toUpperCase()}
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-sector-badge',
    iconSize: [60, 24],
    iconAnchor: [30, 12],
    popupAnchor: [0, -14]
  });
};

// Uniform Tactical Mountain Pass Marker
const createPassIcon = (pass: StrategicPass) => {
  const isBlocked = pass.status === 'BLOCKED';
  const isAlert = pass.status === 'ALERT';
  const html = `
    <div style="
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: #141720;
      border: 1px solid ${isBlocked ? '#7f1d1d' : isAlert ? '#78350f' : '#272d3b'};
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    ">
      <span style="
        color: ${isBlocked ? '#ef4444' : isAlert ? '#f59e0b' : '#64748b'};
        font-size: 8px;
        font-weight: 800;
        font-family: monospace;
      ">
        ${isBlocked ? '✕' : '▲'}
      </span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pass-badge',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10]
  });
};

export const InteractiveTacticalMapView: React.FC<InteractiveTacticalMapViewProps> = ({
  activeSector,
  onSelectSector
}) => {
  // Default to DARK GIS to maintain clean black/grey uniformity
  const [mapStyle, setMapStyle] = useState<'DARK' | 'SATELLITE' | 'LIGHT'>('DARK');
  const [showLegend, setShowLegend] = useState<boolean>(true);

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
      {/* Top Banner (Clean Dark Pill - No overlap with zoom controls) */}
      <div className="absolute top-4 left-5 z-[400] flex items-center gap-3">
        <div className="bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-lg px-3.5 py-2 flex items-center gap-3 text-xs shadow-xl select-none">
          <div className="flex items-center gap-2 font-semibold text-slate-100">
            <Activity className="w-3.5 h-3.5 text-slate-300" />
            <span>{activeSector.shortCode} Strategic Resupply Route</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-slate-300 font-medium">100.0% Navigable</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 font-medium">4 Corridors</span>
        </div>
      </div>

      {/* Top Right Map Mode Switchers */}
      <div className="absolute top-4 right-5 z-[400] flex items-center gap-2">
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
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
        </div>

        <button
          onClick={() => setShowLegend(!showLegend)}
          className="bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 shadow-xl transition-colors cursor-pointer select-none"
        >
          {showLegend ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showLegend ? 'Hide Legend' : 'Legend'}</span>
        </button>
      </div>

      {/* Main Map Element with zoomControl placed at bottomright to prevent top-left overlap */}
      <MapContainer
        center={[34.40, 77.25]}
        zoom={8}
        zoomControl={false}
        scrollWheelZoom={true}
        className={`w-full h-full ${getTileClass()}`}
      >
        <ZoomControl position="bottomright" />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={getTileUrl()}
          maxZoom={15}
          minZoom={6}
        />

        {/* Transit Corridors - Cohesive Slate / White Styling */}
        {CORRIDORS.map((corr) => {
          const isDrone = corr.transportMode.includes('Drone');
          const isFromActive = corr.fromId === activeSector.id || corr.toId === activeSector.id;

          return (
            <Polyline
              key={corr.id}
              positions={corr.coordinates}
              pathOptions={{
                color: isFromActive ? '#f8fafc' : '#475569',
                weight: isFromActive ? 3 : 1.5,
                dashArray: isDrone ? '4, 6' : undefined,
                opacity: isFromActive ? 0.95 : 0.6
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 text-xs text-slate-200 min-w-[200px]">
                  <div className="font-bold border-b border-[#232938] pb-1 text-slate-100 flex items-center justify-between">
                    <span>{corr.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{corr.distanceKm} km</span>
                  </div>
                  <div className="space-y-0.5 text-[11px] text-slate-400">
                    <div>Platform: <span className="text-slate-200">{corr.transportMode}</span></div>
                    <div>Transit Time: <span className="text-slate-200">{corr.transitHours} hrs</span></div>
                    <div>Fuel: <span className="text-slate-200">{corr.fuelBurnLiters} L</span></div>
                    <div>Navigability: <span className="text-slate-200 font-mono">{corr.navigabilityPct}%</span></div>
                    <div>EW Threat: <span className="text-slate-200">{corr.ewThreatLevel}</span></div>
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
                <div className="font-bold flex items-center gap-1.5 border-b border-[#232938] pb-1 text-slate-100">
                  <Mountain className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pass.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>Elevation: <span className="text-slate-200 font-mono">{pass.altitudeFt.toLocaleString()} ft MSL</span></div>
                  <div>Status: <span className="text-slate-200 font-semibold">{pass.status}</span></div>
                  <div>Annual Snow Closure: <span className="text-slate-200 font-mono">{pass.annualClosureDays} days</span></div>
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
                <div className="p-1 space-y-2 text-xs text-slate-200 min-w-[210px]">
                  <div className="border-b border-[#232938] pb-1 flex items-center justify-between">
                    <span className="font-bold text-slate-100">{sector.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e2330] text-slate-300">
                      {sector.shortCode}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                    <div>Elevation: <span className="text-slate-200 font-mono">{sector.altitudeFt.toLocaleString()} ft</span></div>
                    <div>Force: <span className="text-slate-200 font-mono">{sector.assignedForce.toLocaleString()}</span></div>
                    <div>Local Loss: <span className="text-slate-200 font-mono">{sector.localLoss}</span></div>
                    <div>Lead Time MAE: <span className="text-slate-200 font-mono">{sector.localMaeHours}h</span></div>
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

      {/* Bottom Left Legend Box (Unified Dark Palette) */}
      {showLegend && (
        <div className="absolute bottom-6 left-6 z-[400] bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-xl p-3.5 shadow-2xl text-xs space-y-2 min-w-[210px] select-none">
          <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400 pb-1 border-b border-[#1e222d]">
            TAC-ROUTE NAVIGABILITY LEGEND
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>
              <span>Navigable Corridor (Score &ge; 85%)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <span>Conditional (60% &ndash; 84% Snow Risk)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <span>Non-Navigable (Avalanche Blockage)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveTacticalMapView;
