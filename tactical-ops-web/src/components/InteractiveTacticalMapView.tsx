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

// Intermediate tactical milestone waypoints along corridors (matching InlandRoute milestone nodes)
interface MilestoneWaypoint {
  id: string;
  name: string;
  shortLabel: string;
  lat: number;
  lng: number;
  altitudeFt: number;
  chainageKm: number;
  corridorIds: string[];
}

const MILESTONES: MilestoneWaypoint[] = [
  // NH-1D Corridor milestones (Leh <-> Kargil)
  { id: 'ms-nimmu', name: 'Nimmu Confluence Staging', shortLabel: 'Nimmu (Km 35)', lat: 34.2250, lng: 77.2000, altitudeFt: 10300, chainageKm: 35, corridorIds: ['corr-1'] },
  { id: 'ms-khaltsi', name: 'Khaltsi Gorge Checkpoint', shortLabel: 'Khaltsi (Km 95)', lat: 34.3500, lng: 76.8000, altitudeFt: 9800, chainageKm: 95, corridorIds: ['corr-1'] },
  { id: 'ms-bodh', name: 'Bodhkharbu Forward Station', shortLabel: 'Bodhkharbu (Km 150)', lat: 34.4500, lng: 76.4000, altitudeFt: 11200, chainageKm: 150, corridorIds: ['corr-1'] },

  // Upshi - Nyoma corridor milestones
  { id: 'ms-upshi', name: 'Upshi Strategic Junction', shortLabel: 'Upshi (Km 48)', lat: 33.9500, lng: 77.7500, altitudeFt: 11800, chainageKm: 48, corridorIds: ['corr-2'] },
  { id: 'ms-kiari', name: 'Kiari Forward Staging Pad', shortLabel: 'Kiari (Km 105)', lat: 33.6000, lng: 78.1500, altitudeFt: 12900, chainageKm: 105, corridorIds: ['corr-2'] },
  { id: 'ms-chumathang', name: 'Chumathang Transit Base', shortLabel: 'Chumathang (Km 142)', lat: 33.3500, lng: 78.4500, altitudeFt: 13200, chainageKm: 142, corridorIds: ['corr-2'] },

  // Khardung - Diskit corridor milestones
  { id: 'ms-npullu', name: 'North Pullu Avalanche Shelter', shortLabel: 'N. Pullu (Km 65)', lat: 34.4200, lng: 77.5800, altitudeFt: 15200, chainageKm: 65, corridorIds: ['corr-3'] },

  // Shyok - DBO corridor milestones
  { id: 'ms-shyok', name: 'Shyok River Radar-Mask Pad', shortLabel: 'Shyok (Km 165)', lat: 34.7800, lng: 77.7000, altitudeFt: 11800, chainageKm: 165, corridorIds: ['corr-4'] },
  { id: 'ms-murgo', name: 'Murgo Defended Staging Node', shortLabel: 'Murgo (Km 210)', lat: 35.1200, lng: 77.8500, altitudeFt: 14200, chainageKm: 210, corridorIds: ['corr-4'] },
];

// Circular Waypoint Node Icon with highlight light blur (Exact match to InlandRoute Image 4)
const createDepotMarkerIcon = (sector: SectorDepot, isSelected: boolean) => {
  const isCritical = sector.status === 'CRITICAL';
  const ringColor = isSelected ? '#38bdf8' : isCritical ? '#f87171' : '#94a3b8';
  const glowColor = isSelected ? 'rgba(56, 189, 248, 0.7)' : isCritical ? 'rgba(239, 68, 68, 0.4)' : 'rgba(148, 163, 184, 0.3)';

  // If selected, include the floating callout card directly attached above the node (just like Sadiya Terminal card in Image 4!)
  const calloutCard = isSelected
    ? `
      <div style="
        position: absolute;
        bottom: 34px;
        left: 50%;
        transform: translateX(-50%);
        background: #0b0e14;
        border: 1.5px solid #1e293b;
        border-radius: 9px;
        padding: 9px 13px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.9), 0 0 1px #38bdf8;
        min-width: 205px;
        white-space: nowrap;
        pointer-events: auto;
        z-index: 1000;
      ">
        <div style="display: flex; align-items: center; gap: 7px; font-weight: 700; color: #38bdf8; font-size: 12px; margin-bottom: 5px;">
          <span style="font-size: 13px;">▲</span>
          <span>${sector.name.split(' (')[0]}</span>
        </div>
        <div style="font-size: 10.5px; color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 2px;">
          <span>Terminal Chainage:</span>
          <span style="color: #ffffff; font-weight: 700; font-family: monospace;">km ${sector.id === 'sec-leh' ? '0' : sector.id === 'sec-kargil' ? '216' : sector.id === 'sec-dbo' ? '258' : sector.id === 'sec-nyoma' ? '182' : '118'}</span>
        </div>
        <div style="font-size: 10.5px; color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 2px;">
          <span>Altitude Clearance:</span>
          <span style="color: #38bdf8; font-weight: 700; font-family: monospace;">${sector.altitudeFt.toLocaleString()} ft</span>
        </div>
        <div style="font-size: 10.5px; color: #94a3b8; display: flex; justify-content: space-between;">
          <span>Navigability Status:</span>
          <span style="color: #10b981; font-weight: 700; font-family: monospace;">100% Operational</span>
        </div>
      </div>
    `
    : '';

  const html = `
    <div style="position: relative; width: ${isSelected ? '28px' : '22px'}; height: ${isSelected ? '28px' : '22px'};">
      ${calloutCard}
      <!-- Outer Glowing Circular Ring -->
      <div style="
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: #090b10;
        border: ${isSelected ? '3.5px solid #38bdf8' : '2.5px solid ' + ringColor};
        box-shadow: 0 0 ${isSelected ? '16px' : '8px'} ${glowColor}, inset 0 0 6px ${glowColor};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <!-- Inner Core Dot -->
        <div style="
          width: ${isSelected ? '8px' : '6px'};
          height: ${isSelected ? '8px' : '6px'};
          border-radius: 50%;
          background: #ffffff;
        "></div>
      </div>

      <!-- Station Label Chip below node -->
      <div style="
        position: absolute;
        top: ${isSelected ? '30px' : '24px'};
        left: 50%;
        transform: translateX(-50%);
        background: rgba(11, 14, 20, 0.92);
        border: 1px solid ${isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)'};
        color: ${isSelected ? '#ffffff' : '#cbd5e1'};
        font-size: 9px;
        font-weight: 700;
        font-family: ui-monospace, SFMono-Regular, monospace;
        letter-spacing: 0.4px;
        padding: 2px 6px;
        border-radius: 4px;
        white-space: nowrap;
        box-shadow: 0 4px 10px rgba(0,0,0,0.8);
        backdrop-filter: blur(4px);
        pointer-events: none;
      ">
        ${sector.shortCode}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-depot-node',
    iconSize: isSelected ? [28, 28] : [22, 22],
    iconAnchor: isSelected ? [14, 14] : [11, 11]
  });
};

// Milestone waypoint circular node icon (Image 4 style: white center dot, subtle ring)
const createMilestoneIcon = (ms: MilestoneWaypoint, isHighlighted: boolean) => {
  const html = `
    <div style="position: relative; width: 14px; height: 14px;">
      <div style="
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #090b10;
        border: ${isHighlighted ? '2px solid #38bdf8' : '1.5px solid #64748b'};
        box-shadow: 0 0 ${isHighlighted ? '8px rgba(56, 189, 248, 0.5)' : '4px rgba(0,0,0,0.6)'};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${isHighlighted ? '#ffffff' : '#94a3b8'};
        "></div>
      </div>
      <!-- Milestone Tooltip Label -->
      <div style="
        position: absolute;
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(11, 14, 20, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #94a3b8;
        font-size: 8px;
        font-family: ui-monospace, SFMono-Regular, monospace;
        padding: 1px 4px;
        border-radius: 3px;
        white-space: nowrap;
        pointer-events: none;
      ">
        ${ms.shortLabel}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-milestone-node',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

// Strategic Mountain Pass Marker
const createPassIcon = (pass: StrategicPass) => {
  const isBlocked = pass.status === 'BLOCKED';
  const isAlert = pass.status === 'ALERT';
  const ringColor = isBlocked ? '#ef4444' : isAlert ? '#f59e0b' : '#38bdf8';

  const html = `
    <div style="position: relative; width: 18px; height: 18px;">
      <div style="
        width: 18px;
        height: 18px;
        background: #090b10;
        border: 1.5px solid ${ringColor};
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 8px ${isBlocked ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.3)'};
      ">
        <span style="color: ${ringColor}; font-size: 8px; font-weight: 800; font-family: monospace;">
          ${isBlocked ? '✕' : '▲'}
        </span>
      </div>
      <div style="
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(11, 14, 20, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        font-size: 8.5px;
        font-weight: 600;
        padding: 1px 4px;
        border-radius: 3px;
        white-space: nowrap;
      ">
        ${pass.name.split(' (')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pass-node',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

export const InteractiveTacticalMapView: React.FC<InteractiveTacticalMapViewProps> = ({
  activeSector,
  onSelectSector
}) => {
  // Default to Dark GIS
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

  // Identify active corridors connected to the selected sector
  const activeCorridorIds = CORRIDORS
    .filter((c) => c.fromId === activeSector.id || c.toId === activeSector.id)
    .map((c) => c.id);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-[#0a0b0e]">
      {/* Top Banner (Clean Dark Pill matching InlandRoute Image 4) */}
      <div className="absolute top-4 left-5 z-[400] flex items-center gap-3">
        <div className="bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-lg px-3.5 py-2 flex items-center gap-3 text-xs shadow-xl select-none">
          <div className="flex items-center gap-2 font-semibold text-slate-100">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeSector.shortCode} Strategic Resupply Route</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-cyan-400 font-medium">100.0% Navigable</span>
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
            <Sun className="w-3.5 h-3.5 text-amber-500" />
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

      {/* Main Map Element */}
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

        {/* 3-Tier Route Polylines: Highlight Light Blur Layer + Channel + Centerline (Image 4 Style!) */}
        {CORRIDORS.map((corr) => {
          const isDrone = corr.transportMode.includes('Drone');
          const isFromActive = activeCorridorIds.includes(corr.id);

          return (
            <React.Fragment key={corr.id}>
              {/* Layer 1: Outer Highlight Light Blur Glow (Exact match to InlandRoute's thick blue glow in Image 4) */}
              <Polyline
                positions={corr.coordinates}
                pathOptions={{
                  color: isFromActive ? '#38bdf8' : '#334155',
                  weight: isFromActive ? 14 : 5,
                  opacity: isFromActive ? 0.35 : 0.12,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />

              {/* Layer 2: Main Corridor Channel */}
              <Polyline
                positions={corr.coordinates}
                pathOptions={{
                  color: isFromActive ? '#0284c7' : '#1e293b',
                  weight: isFromActive ? 6 : 2.5,
                  opacity: isFromActive ? 0.9 : 0.4,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />

              {/* Layer 3: Inner Crisp Centerline */}
              <Polyline
                positions={corr.coordinates}
                pathOptions={{
                  color: isFromActive ? '#ffffff' : '#64748b',
                  weight: isFromActive ? 2.5 : 1,
                  opacity: isFromActive ? 1.0 : 0.6,
                  dashArray: isDrone ? '4, 6' : undefined,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 text-xs text-slate-200 min-w-[200px]">
                    <div className="font-bold border-b border-[#232938] pb-1 text-slate-100 flex items-center justify-between">
                      <span>{corr.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">{corr.distanceKm} km</span>
                    </div>
                    <div className="space-y-0.5 text-[11px] text-slate-400">
                      <div>Transport: <span className="text-slate-200">{corr.transportMode}</span></div>
                      <div>Transit Time: <span className="text-slate-200">{corr.transitHours} hrs</span></div>
                      <div>Fuel: <span className="text-slate-200">{corr.fuelBurnLiters} L</span></div>
                      <div>Navigability: <span className="text-cyan-400 font-mono">{corr.navigabilityPct}%</span></div>
                      <div>EW Threat: <span className="text-slate-200">{corr.ewThreatLevel}</span></div>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            </React.Fragment>
          );
        })}

        {/* Milestone Waypoints along corridors (Circular Rings matching Image 4) */}
        {MILESTONES.map((ms) => {
          const isHighlighted = ms.corridorIds.some((cid) => activeCorridorIds.includes(cid));
          return (
            <Marker
              key={ms.id}
              position={[ms.lat, ms.lng]}
              icon={createMilestoneIcon(ms, isHighlighted)}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs text-slate-200 min-w-[170px]">
                  <div className="font-bold text-slate-100 border-b border-[#232938] pb-1">
                    {ms.name}
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-0.5">
                    <div>Chainage: <span className="text-white font-mono">Km {ms.chainageKm}</span></div>
                    <div>Elevation: <span className="text-cyan-400 font-mono">{ms.altitudeFt.toLocaleString()} ft</span></div>
                  </div>
                </div>
              </Popup>
            </Marker>
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
                  <Mountain className="w-3.5 h-3.5 text-cyan-400" />
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

        {/* Sector Depot Stations (Glowing Circular Rings + Floating Active Callout Card) */}
        {SECTORS.map((sector) => {
          const isSelected = sector.id === activeSector.id;
          return (
            <Marker
              key={sector.id}
              position={[sector.lat, sector.lng]}
              icon={createDepotMarkerIcon(sector, isSelected)}
              eventHandlers={{
                click: () => onSelectSector(sector.id)
              }}
            >
              <Popup>
                <div className="p-1 space-y-2 text-xs text-slate-200 min-w-[210px]">
                  <div className="border-b border-[#232938] pb-1 flex items-center justify-between">
                    <span className="font-bold text-slate-100">{sector.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e2330] text-cyan-400">
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

      {/* Bottom Left Legend Box */}
      {showLegend && (
        <div className="absolute bottom-6 left-6 z-[400] bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-xl p-3.5 shadow-2xl text-xs space-y-2 min-w-[220px] select-none">
          <div className="font-bold text-[10px] uppercase tracking-wider text-slate-400 pb-1 border-b border-[#1e222d]">
            TAC-ROUTE NAVIGABILITY LEGEND
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] shrink-0"></span>
              <span>Active Navigable Corridor (Score &ge; 85%)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Conditional (60% &ndash; 84% Snow Risk)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
              <span>Non-Navigable (Avalanche Blockage)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveTacticalMapView;
