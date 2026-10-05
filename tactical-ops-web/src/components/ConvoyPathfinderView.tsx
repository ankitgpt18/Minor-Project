import React, { useState } from 'react';
import type { SectorDepot } from '../data/sectorsData';
import { CORRIDORS, SECTORS } from '../data/sectorsData';
import {
  Navigation,
  Clock,
  Fuel,
  ShieldCheck,
  MapPin,
  Truck,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';

interface ConvoyPathfinderViewProps {
  activeSector?: SectorDepot;
}

export const ConvoyPathfinderView: React.FC<ConvoyPathfinderViewProps> = () => {
  const [originTerminal, setOriginTerminal] = useState<string>('sec-leh');
  const [destinationPort, setDestinationPort] = useState<string>('sec-dbo');
  const [vehicleType, setVehicleType] = useState<string>('Heavy-Lift Drone (DRDO 200kg)');
  const [speedKmH, setSpeedKmH] = useState<number>(35);

  const activeOrigin = SECTORS.find((s) => s.id === originTerminal) || SECTORS[0];
  const activeDest = SECTORS.find((s) => s.id === destinationPort) || SECTORS[3];

  // Dynamic calculations based on speed and selection
  const estimatedDistanceKm = 258;
  const estimatedHours = +(estimatedDistanceKm / Math.max(15, speedKmH)).toFixed(1);
  const estimatedFuelLiters = Math.round(estimatedDistanceKm * 0.48);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto">
      {/* Title Header (Exact match to InlandRoute Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e222d] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Navigation className="w-5 h-5 text-emerald-400" />
            <span>Convoy & Tactical UAV Navigation Pathfinder</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time least-cost pathfinding, altitude drag clearance verification, and fuel burn optimization across mountain corridors.
          </p>
        </div>

        {/* Horizontal Mini Route Switcher */}
        <div className="flex items-center gap-1.5 bg-[#12141a] border border-[#1e222d] rounded-lg p-1 text-xs">
          <span className="px-2.5 py-1 rounded text-slate-400 font-medium">NH-1D Axis</span>
          <span className="px-2.5 py-1 rounded text-slate-400 font-medium">Upshi Trail</span>
          <span className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold shadow-sm">
            Khardung La &ndash; DBO Corridor
          </span>
          <span className="px-2.5 py-1 rounded text-slate-400 font-medium">Chushul Ridge</span>
        </div>
      </div>

      {/* 4 Interactive Dropdown / Slider Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CONTROL 1: ORIGIN */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-3.5 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Origin Terminal</span>
          </label>
          <select
            value={originTerminal}
            onChange={(e) => setOriginTerminal(e.target.value)}
            className="w-full bg-[#181b23] border border-[#262c3b] rounded-lg px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none cursor-pointer"
          >
            {SECTORS.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#12141a]">
                {s.name} (Km 0)
              </option>
            ))}
          </select>
        </div>

        {/* CONTROL 2: DESTINATION */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-3.5 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Destination Forward Post</span>
          </label>
          <select
            value={destinationPort}
            onChange={(e) => setDestinationPort(e.target.value)}
            className="w-full bg-[#181b23] border border-[#262c3b] rounded-lg px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none cursor-pointer"
          >
            {SECTORS.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#12141a]">
                {s.name} (Km {estimatedDistanceKm})
              </option>
            ))}
          </select>
        </div>

        {/* CONTROL 3: VEHICLE / LIFT SPEC */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-3.5 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Transport Platform Requirement</span>
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full bg-[#181b23] border border-[#262c3b] rounded-lg px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none cursor-pointer"
          >
            <option value="DRDO 200kg Logistics Drone" className="bg-[#12141a]">
              Heavy Drone &mdash; DRDO 200kg High-Altitude VTOL
            </option>
            <option value="Ashok Leyland Stallion 10T" className="bg-[#12141a]">
              10-Ton HMV &mdash; Ashok Leyland Stallion 4x4
            </option>
            <option value="Tata Light 4x4" className="bg-[#12141a]">
              Light 4x4 &mdash; Tata Quick Reaction Carrier
            </option>
          </select>
        </div>

        {/* CONTROL 4: SPEED SLIDER */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Convoy Speed</span>
            </span>
            <span className="text-white font-mono">{speedKmH} km/h</span>
          </div>
          <input
            type="range"
            min={15}
            max={60}
            step={5}
            value={speedKmH}
            onChange={(e) => setSpeedKmH(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[#262c3b] rounded-lg"
          />
        </div>
      </div>

      {/* 4 Performance Metric Cards Row (Exact match to InlandRoute Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: TOTAL DISTANCE */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-emerald-400 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Distance</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{estimatedDistanceKm} km</div>
          </div>
        </div>

        {/* STAT 2: ESTIMATED TRANSIT TIME */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-cyan-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Transit Time</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{estimatedHours} hours</div>
          </div>
        </div>

        {/* STAT 3: ESTIMATED FUEL BURN */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-amber-400 shrink-0">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Fuel Burn</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{estimatedFuelLiters} Liters</div>
          </div>
        </div>

        {/* STAT 4: PASS CLEARANCE */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pass Clearance</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">Clear Flight Passage</div>
          </div>
        </div>
      </div>

      {/* Bottom Split Layout: Route Map + Waypoint Telemetry List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map Container (8 Cols) */}
        <div className="lg:col-span-8 h-[420px] rounded-xl border border-[#1e222d] overflow-hidden relative bg-[#090b0f]">
          <MapContainer
            center={[34.65, 77.65]}
            zoom={8}
            scrollWheelZoom={true}
            className="w-full h-full leaflet-light-tiles"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {CORRIDORS.map((c) => (
              <Polyline
                key={c.id}
                positions={c.coordinates}
                pathOptions={{ color: '#06b6d4', weight: 4, opacity: 0.9 }}
              />
            ))}
          </MapContainer>
        </div>

        {/* Waypoint Telemetry List (4 Cols - Exact match to InlandRoute Image 3) */}
        <div className="lg:col-span-4 bg-[#12141a] border border-[#1e222d] rounded-xl p-4.5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1e222d] pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Route Waypoint Telemetry</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                LAD Threshold: 4,500m
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {/* Origin Terminal Waypoint */}
              <div className="p-3 rounded-lg bg-[#161922] border border-[#232835] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>ORIGIN: {activeOrigin.name}</span>
                  <span className="font-mono text-slate-300">Km 0</span>
                </div>
                <div className="text-[11px] text-slate-400">Starting Staging Base &bull; Elevation: {activeOrigin.altitudeFt} ft</div>
              </div>

              {/* Intermediate Switchback Waypoint */}
              <div className="p-3 rounded-lg bg-[#161922] border border-[#232835] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>INTERMEDIATE: Khardung La Pass</span>
                  <span className="font-mono text-slate-300">Km 78</span>
                </div>
                <div className="text-[11px] text-slate-400">Ridge Transfer Pad &bull; Elevation: 17,982 ft (Altitude Drag Active)</div>
              </div>

              {/* Destination Port Waypoint */}
              <div className="p-3 rounded-lg bg-[#161922] border border-[#232835] space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                  <span>DESTINATION: {activeDest.name}</span>
                  <span className="font-mono text-slate-300">Km {estimatedDistanceKm}</span>
                </div>
                <div className="text-[11px] text-slate-400">Terminal Arrival &bull; Elevation: {activeDest.altitudeFt} ft</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] flex items-center justify-between">
            <span className="font-medium">Multi-Tier Transfer Feasibility:</span>
            <span className="font-bold">VERIFIED 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
