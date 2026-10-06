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

// Calculative geodesic mountain distance formula
const calculateDistanceKm = (from: SectorDepot, to: SectorDepot): number => {
  if (from.id === to.id) return 0;
  const R = 6371;
  const dLat = (to.lat - from.lat) * (Math.PI / 180);
  const dLon = (to.lng - from.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.lat * (Math.PI / 180)) * Math.cos(to.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directKm = R * c;
  // Mountain road tortuosity factor (~1.38 for Himalayan terrain)
  return Math.round(directKm * 1.38);
};

// Calculative transit time
const calculateTransitHours = (distanceKm: number, altitudeFt: number): number => {
  if (distanceKm === 0) return 0;
  const speed = altitudeFt > 13000 ? 32 : 42;
  return +(distanceKm / speed).toFixed(1);
};

// Calculative navigability status
const calculateNavigability = (sector: SectorDepot) => {
  if (sector.status === 'CRITICAL') return { label: '58% Restricted', color: '#f87171' };
  if (sector.isJammed) return { label: '76% EW Rerouting', color: '#fbbf24' };
  return { label: '98.5% Operational', color: '#34d399' };
};

// Broad, Enlarged Tactical Waypoint Node Icon with HOVER-ONLY Callout Card
const createDepotMarkerIcon = (sector: SectorDepot, isSelected: boolean, activeSector: SectorDepot) => {
  const isCritical = sector.status === 'CRITICAL';
  const ringColor = isSelected ? '#38bdf8' : isCritical ? '#f87171' : '#cbd5e1';
  const glowColor = isSelected ? 'rgba(56, 189, 248, 0.8)' : isCritical ? 'rgba(239, 68, 68, 0.5)' : 'rgba(148, 163, 184, 0.4)';

  const distanceKm = calculateDistanceKm(activeSector, sector);
  const transitHours = calculateTransitHours(distanceKm, sector.altitudeFt);
  const navigability = calculateNavigability(sector);

  // Floating Callout Card - Wrapped in .station-hover-callout so it ONLY displays when user hovers!
  const calloutCard = `
    <div class="station-hover-callout" style="
      position: absolute;
      bottom: 38px;
      left: 50%;
      background: #090c13;
      border: 2px solid #233044;
      border-radius: 12px;
      padding: 12px 18px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.95), 0 0 1px #38bdf8;
      min-width: 235px;
      white-space: nowrap;
      pointer-events: auto;
    ">
      <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: #38bdf8; font-size: 14px; margin-bottom: 7px; letter-spacing: -0.2px;">
        <span style="font-size: 15px;">▲</span>
        <span>${sector.name.split(' (')[0]}</span>
      </div>
      <div style="font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 3px;">
        <span>Terminal Chainage:</span>
        <span style="color: #ffffff; font-weight: 800; font-family: monospace;">${distanceKm === 0 ? 'km 0 (Origin)' : `km ${distanceKm} (${transitHours}h)`}</span>
      </div>
      <div style="font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 3px;">
        <span>Altitude Clearance:</span>
        <span style="color: #38bdf8; font-weight: 800; font-family: monospace;">${sector.altitudeFt.toLocaleString()} ft</span>
      </div>
      <div style="font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between;">
        <span>Navigability Status:</span>
        <span style="color: ${navigability.color}; font-weight: 800; font-family: monospace;">${navigability.label}</span>
      </div>
    </div>
  `;

  const html = `
    <div style="position: relative; width: ${isSelected ? '32px' : '24px'}; height: ${isSelected ? '32px' : '24px'};">
      ${calloutCard}
      <!-- Concentric Glowing Ring -->
      <div style="
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: #090c13;
        border: ${isSelected ? '4px solid #38bdf8' : '3px solid ' + ringColor};
        box-shadow: 0 0 ${isSelected ? '20px' : '10px'} ${glowColor}, inset 0 0 6px ${glowColor};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <div style="
          width: ${isSelected ? '9px' : '7px'};
          height: ${isSelected ? '9px' : '7px'};
          border-radius: 50%;
          background: #ffffff;
        "></div>
      </div>

      <!-- Broad, Enlarged Station Badge (Broad text, clear separation) -->
      <div style="
        position: absolute;
        top: ${isSelected ? '36px' : '28px'};
        left: 50%;
        transform: translateX(-50%);
        background: #0d111a;
        border: 1.5px solid ${isSelected ? '#38bdf8' : '#2b364c'};
        color: #ffffff;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.5px;
        padding: 3px 10px;
        border-radius: 6px;
        white-space: nowrap;
        box-shadow: 0 4px 16px rgba(0,0,0,0.9);
        pointer-events: none;
      ">
        ${sector.shortCode}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-depot-node',
    iconSize: isSelected ? [32, 32] : [24, 24],
    iconAnchor: isSelected ? [16, 16] : [12, 12]
  });
};

// Strategic Mountain Pass Marker
const createPassIcon = (pass: StrategicPass) => {
  const isBlocked = pass.status === 'BLOCKED';
  const isAlert = pass.status === 'ALERT';
  const ringColor = isBlocked ? '#ef4444' : isAlert ? '#f59e0b' : '#38bdf8';

  const html = `
    <div style="position: relative; width: 22px; height: 22px;">
      <div style="
        width: 22px;
        height: 22px;
        background: #090c13;
        border: 2px solid ${ringColor};
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px ${isBlocked ? 'rgba(239, 68, 68, 0.5)' : 'rgba(56, 189, 248, 0.4)'};
      ">
        <span style="color: ${ringColor}; font-size: 10px; font-weight: 900; font-family: monospace;">
          ${isBlocked ? '✕' : '▲'}
        </span>
      </div>
      <div style="
        position: absolute;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: #0d111a;
        border: 1px solid #2b364c;
        color: #e2e8f0;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 4px;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.8);
      ">
        ${pass.name.split(' (')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pass-node',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export const InteractiveTacticalMapView: React.FC<InteractiveTacticalMapViewProps> = ({
  activeSector,
  onSelectSector
}) => {
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

  const activeCorridorIds = CORRIDORS
    .filter((c) => c.fromId === activeSector.id || c.toId === activeSector.id)
    .map((c) => c.id);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-[#0a0b0e]">
      {/* Top Banner - Removed static "100.0% Navigable | 4 Mountain Corridors" as requested */}
      <div className="absolute top-4 left-5 z-[400] flex items-center gap-3">
        <div className="bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-xs shadow-xl select-none">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white text-sm">{activeSector.shortCode} Strategic Resupply Route</span>
        </div>
      </div>

      {/* Top Right Map Mode Switchers */}
      <div className="absolute top-4 right-5 z-[400] flex items-center gap-2">
        <div className="bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-lg p-1 flex items-center gap-1 shadow-xl select-none">
          <button
            onClick={() => setMapStyle('DARK')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mapStyle === 'DARK'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark GIS</span>
          </button>

          <button
            onClick={() => setMapStyle('SATELLITE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mapStyle === 'SATELLITE'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite HD</span>
          </button>

          <button
            onClick={() => setMapStyle('LIGHT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mapStyle === 'LIGHT'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Light</span>
          </button>
        </div>

        <button
          onClick={() => setShowLegend(!showLegend)}
          className="bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 shadow-xl transition-colors cursor-pointer select-none"
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
          attribution='&copy; OpenStreetMap contributors'
          url={getTileUrl()}
          maxZoom={15}
          minZoom={6}
        />

        {/* 3-Tier Route Polylines: Highlight Light Blur Layer + Channel + Centerline */}
        {CORRIDORS.map((corr) => {
          const isDrone = corr.transportMode.includes('Drone');
          const isFromActive = activeCorridorIds.includes(corr.id);

          return (
            <React.Fragment key={corr.id}>
              {/* Layer 1: Outer Highlight Light Blur Glow */}
              <Polyline
                positions={corr.coordinates}
                pathOptions={{
                  color: isFromActive ? '#38bdf8' : '#334155',
                  weight: isFromActive ? 16 : 6,
                  opacity: isFromActive ? 0.38 : 0.15,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />

              {/* Layer 2: Main Corridor Channel */}
              <Polyline
                positions={corr.coordinates}
                pathOptions={{
                  color: isFromActive ? '#0284c7' : '#1e293b',
                  weight: isFromActive ? 7 : 3,
                  opacity: isFromActive ? 0.95 : 0.45,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />

              {/* Layer 3: Inner Crisp Centerline */}
              <Polyline
                positions={corr.coordinates}
                pathOptions={{
                  color: isFromActive ? '#ffffff' : '#64748b',
                  weight: isFromActive ? 3 : 1.5,
                  opacity: 1.0,
                  dashArray: isDrone ? '5, 7' : undefined,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 text-xs text-slate-200 min-w-[210px]">
                    <div className="font-bold border-b border-[#232938] pb-1 text-slate-100 flex items-center justify-between">
                      <span>{corr.name}</span>
                      <span className="text-[11px] text-cyan-400 font-mono font-bold">{corr.distanceKm} km</span>
                    </div>
                    <div className="space-y-0.5 text-[11px] text-slate-400">
                      <div>Transport: <span className="text-slate-200 font-medium">{corr.transportMode}</span></div>
                      <div>Transit Time: <span className="text-slate-200 font-medium">{corr.transitHours} hrs</span></div>
                      <div>Fuel Burn: <span className="text-slate-200 font-medium">{corr.fuelBurnLiters} L</span></div>
                      <div>Navigability: <span className="text-cyan-400 font-bold font-mono">{corr.navigabilityPct}%</span></div>
                      <div>EW Threat: <span className="text-slate-200 font-medium">{corr.ewThreatLevel}</span></div>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            </React.Fragment>
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

        {/* Primary Sector Depot Stations - Hover-Only Callout Card with Dynamic Geodesic Distance */}
        {SECTORS.map((sector) => {
          const isSelected = sector.id === activeSector.id;
          return (
            <Marker
              key={sector.id}
              position={[sector.lat, sector.lng]}
              icon={createDepotMarkerIcon(sector, isSelected, activeSector)}
              eventHandlers={{
                click: () => onSelectSector(sector.id)
              }}
            >
              <Popup>
                <div className="p-1 space-y-2 text-xs text-slate-200 min-w-[220px]">
                  <div className="border-b border-[#232938] pb-1 flex items-center justify-between">
                    <span className="font-bold text-slate-100">{sector.name}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e2330] text-cyan-400 font-bold">
                      {sector.shortCode}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                    <div>Elevation: <span className="text-slate-200 font-mono font-bold">{sector.altitudeFt.toLocaleString()} ft</span></div>
                    <div>Force: <span className="text-slate-200 font-mono font-bold">{sector.assignedForce.toLocaleString()}</span></div>
                    <div>Local Loss: <span className="text-slate-200 font-mono">{sector.localLoss}</span></div>
                    <div>Lead Time MAE: <span className="text-slate-200 font-mono font-bold">{sector.localMaeHours}h</span></div>
                  </div>
                  <button
                    onClick={() => onSelectSector(sector.id)}
                    className="w-full mt-2 py-1.5 rounded bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors cursor-pointer text-xs"
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
        <div className="absolute bottom-6 left-6 z-[400] bg-[#0e1015]/95 backdrop-blur-md border border-[#1e222d] rounded-xl p-4 shadow-2xl text-xs space-y-2.5 min-w-[230px] select-none">
          <div className="font-bold text-[11px] uppercase tracking-wider text-slate-300 pb-1 border-b border-[#1e222d]">
            TAC-ROUTE NAVIGABILITY LEGEND
          </div>
          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] shrink-0"></span>
              <span>Active Navigable Corridor (Score &ge; 85%)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
              <span>Conditional (60% - 84% Snow Risk)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
              <span>Non-Navigable (Avalanche Blockage)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveTacticalMapView;
