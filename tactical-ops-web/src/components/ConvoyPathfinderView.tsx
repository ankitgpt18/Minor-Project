import React, { useState } from 'react';
import type { SectorDepot } from '../data/sectorsData';
import { SECTORS } from '../data/sectorsData';
import {
  Navigation,
  Clock,
  Fuel,
  ShieldCheck,
  MapPin,
  Truck,
  Sliders,
  CheckCircle2,
  Send,
  Check
} from 'lucide-react';
import { MapContainer, TileLayer, Polyline, ZoomControl, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface ConvoyPathfinderViewProps {
  activeSector?: SectorDepot;
}

interface RoutePreset {
  id: string;
  name: string;
  originId: string;
  destId: string;
  distanceKm: number;
  vehicle: string;
  speedKmH: number;
  coordinates: [number, number][];
  waypoints: {
    stage: 'ORIGIN' | 'TRANSIT' | 'DESTINATION';
    name: string;
    km: number;
    altitudeFt: number;
    note: string;
  }[];
}

const ROUTE_PRESETS: RoutePreset[] = [
  {
    id: 'khardung-dbo',
    name: 'Khardung La - DBO Corridor',
    originId: 'sec-leh',
    destId: 'sec-dbo',
    distanceKm: 258,
    vehicle: 'DRDO 200kg Logistics Drone',
    speedKmH: 45,
    coordinates: [
      [34.1526, 77.5771],
      [34.2787, 77.6047],
      [34.5428, 77.5619],
      [34.7800, 77.7000],
      [35.1200, 77.8500],
      [35.4022, 77.9314]
    ],
    waypoints: [
      { stage: 'ORIGIN', name: '14 Corps Master Logistics Base (Leh)', km: 0, altitudeFt: 11562, note: 'Starting Base Staging Pad' },
      { stage: 'TRANSIT', name: 'Khardung La Pass Crossing', km: 78, altitudeFt: 17982, note: 'Ridge Airway / Altitude Drag Active' },
      { stage: 'TRANSIT', name: 'Diskit Drone Resupply Hub', km: 118, altitudeFt: 10315, note: 'Mid-Point Rotor Battery Swap' },
      { stage: 'DESTINATION', name: 'Sub-Sector North Advance Post (DBO)', km: 258, altitudeFt: 16614, note: 'Terminal Airfield Landing' }
    ]
  },
  {
    id: 'nh-1d',
    name: 'NH-1D Axis',
    originId: 'sec-leh',
    destId: 'sec-kargil',
    distanceKm: 216,
    vehicle: 'Ashok Leyland Stallion 10T',
    speedKmH: 40,
    coordinates: [
      [34.1526, 77.5771],
      [34.2250, 77.2000],
      [34.3500, 76.8000],
      [34.4500, 76.4000],
      [34.5539, 76.1349]
    ],
    waypoints: [
      { stage: 'ORIGIN', name: '14 Corps Master Logistics Base (Leh)', km: 0, altitudeFt: 11562, note: 'Starting Depot Convoy Assembly' },
      { stage: 'TRANSIT', name: 'Khaltsi Indus Valley Bridge', km: 95, altitudeFt: 9800, note: 'Convoy Fuel & Water Resupply' },
      { stage: 'TRANSIT', name: 'Bodhkharbu Mountain Corridor', km: 150, altitudeFt: 11200, note: 'Switchback Speed Restricted' },
      { stage: 'DESTINATION', name: '8 Mountain Division Base (Kargil)', km: 216, altitudeFt: 8780, note: 'Division Central Ordnance Storage' }
    ]
  },
  {
    id: 'upshi-trail',
    name: 'Upshi Trail',
    originId: 'sec-leh',
    destId: 'sec-nyoma',
    distanceKm: 182,
    vehicle: 'Tata Light 4x4',
    speedKmH: 35,
    coordinates: [
      [34.1526, 77.5771],
      [33.9500, 77.7500],
      [33.6000, 78.1500],
      [33.3500, 78.4500],
      [33.1945, 78.6653]
    ],
    waypoints: [
      { stage: 'ORIGIN', name: '14 Corps Master Logistics Base (Leh)', km: 0, altitudeFt: 11562, note: 'Starting Base Dispatch' },
      { stage: 'TRANSIT', name: 'Upshi Strategic Junction', km: 48, altitudeFt: 11800, note: 'Route Verification Point' },
      { stage: 'TRANSIT', name: 'Chumathang High-Altitude Staging', km: 142, altitudeFt: 13200, note: 'Thermal Engine Preheat' },
      { stage: 'DESTINATION', name: '3 Infantry Division Depot (Nyoma)', km: 182, altitudeFt: 13700, note: 'Chushul Sector Forward Depot' }
    ]
  },
  {
    id: 'chushul-ridge',
    name: 'Chushul Ridge',
    originId: 'sec-diskit',
    destId: 'sec-nyoma',
    distanceKm: 195,
    vehicle: 'DRDO 200kg Logistics Drone',
    speedKmH: 50,
    coordinates: [
      [34.5428, 77.5619],
      [34.2787, 77.6047],
      [34.0483, 77.9306],
      [33.1945, 78.6653]
    ],
    waypoints: [
      { stage: 'ORIGIN', name: 'Nubra Valley Autonomous Drone Hub (Diskit)', km: 0, altitudeFt: 10315, note: 'Hangar Sortie Launch' },
      { stage: 'TRANSIT', name: 'Chang La Ridge Traverse', km: 92, altitudeFt: 17590, note: 'Radar Shadow Corridor' },
      { stage: 'DESTINATION', name: '3 Infantry Division Depot (Nyoma)', km: 195, altitudeFt: 13700, note: 'Pangong South Air Terminal' }
    ]
  }
];

// Concentric waypoint pin icon for convoy map
const createConvoyPinIcon = (isOrigin: boolean, isDest: boolean) => {
  const color = isOrigin ? '#ffffff' : isDest ? '#38bdf8' : '#94a3b8';
  const html = `
    <div style="
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #090b10;
      border: 2.5px solid ${color};
      box-shadow: 0 0 10px ${color}80;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 5px; height: 5px; border-radius: 50%; background: #ffffff;"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'convoy-pin-icon',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

export const ConvoyPathfinderView: React.FC<ConvoyPathfinderViewProps> = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('khardung-dbo');
  const [originTerminal, setOriginTerminal] = useState<string>('sec-leh');
  const [destinationPort, setDestinationPort] = useState<string>('sec-dbo');
  const [vehicleType, setVehicleType] = useState<string>('DRDO 200kg Logistics Drone');
  const [speedKmH, setSpeedKmH] = useState<number>(45);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchedId, setDispatchedId] = useState<string | null>(null);

  // Active preset or fallback
  const activePreset = ROUTE_PRESETS.find((p) => p.id === selectedPresetId) || ROUTE_PRESETS[0];

  // Handle switching preset buttons
  const handleSelectPreset = (preset: RoutePreset) => {
    setSelectedPresetId(preset.id);
    setOriginTerminal(preset.originId);
    setDestinationPort(preset.destId);
    setVehicleType(preset.vehicle);
    setSpeedKmH(preset.speedKmH);
    setDispatchedId(null);
  };

  // Handle Origin / Destination dropdown changes
  const handleOriginChange = (newOrigin: string) => {
    setOriginTerminal(newOrigin);
    setDispatchedId(null);
    const matched = ROUTE_PRESETS.find((p) => p.originId === newOrigin && p.destId === destinationPort);
    if (matched) setSelectedPresetId(matched.id);
  };

  const handleDestChange = (newDest: string) => {
    setDestinationPort(newDest);
    setDispatchedId(null);
    const matched = ROUTE_PRESETS.find((p) => p.originId === originTerminal && p.destId === newDest);
    if (matched) setSelectedPresetId(matched.id);
  };

  // Calculations
  const distanceKm = activePreset.distanceKm;
  const transitHours = +(distanceKm / Math.max(15, speedKmH)).toFixed(1);
  const fuelBurnLiters = Math.round(distanceKm * (vehicleType.includes('Drone') ? 0.22 : vehicleType.includes('Stallion') ? 0.65 : 0.42));

  // Authorize Dispatch Action
  const handleAuthorizeDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      const generatedId = `DSP-${Math.floor(1000 + Math.random() * 9000)}`;
      setDispatchedId(generatedId);
    }, 900);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto overflow-y-auto">
      {/* Title Header with Functional Route Switcher Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e222d] pb-4">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2.5">
            <Navigation className="w-5 h-5 text-slate-300" />
            <span>Convoy & Tactical UAV Navigation Pathfinder</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time least-cost pathfinding, altitude drag clearance verification, and fuel burn optimization across mountain corridors.
          </p>
        </div>

        {/* Functional Horizontal Route Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-[#12141a] border border-[#1e222d] rounded-lg p-1 text-xs">
          {ROUTE_PRESETS.map((preset) => {
            const isActive = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#181c25]'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Interactive Dropdown / Slider Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CONTROL 1: ORIGIN */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-3.5 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Origin Terminal</span>
          </label>
          <select
            value={originTerminal}
            onChange={(e) => handleOriginChange(e.target.value)}
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
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Destination Forward Post</span>
          </label>
          <select
            value={destinationPort}
            onChange={(e) => handleDestChange(e.target.value)}
            className="w-full bg-[#181b23] border border-[#262c3b] rounded-lg px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none cursor-pointer"
          >
            {SECTORS.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#12141a]">
                {s.name} (Km {distanceKm})
              </option>
            ))}
          </select>
        </div>

        {/* CONTROL 3: VEHICLE / LIFT SPEC */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-3.5 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            <span>Transport Platform Requirement</span>
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full bg-[#181b23] border border-[#262c3b] rounded-lg px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none cursor-pointer"
          >
            <option value="DRDO 200kg Logistics Drone" className="bg-[#12141a]">
              Heavy Drone - DRDO 200kg VTOL
            </option>
            <option value="Ashok Leyland Stallion 10T" className="bg-[#12141a]">
              10-Ton HMV - Ashok Leyland 4x4
            </option>
            <option value="Tata Light 4x4" className="bg-[#12141a]">
              Light 4x4 - Tata QRF Carrier
            </option>
          </select>
        </div>

        {/* CONTROL 4: SPEED SLIDER */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Convoy Speed</span>
            </span>
            <span className="text-white font-mono">{speedKmH} km/h</span>
          </div>
          <input
            type="range"
            min={15}
            max={70}
            step={5}
            value={speedKmH}
            onChange={(e) => setSpeedKmH(Number(e.target.value))}
            className="w-full accent-white cursor-pointer h-1.5 bg-[#262c3b] rounded-lg"
          />
        </div>
      </div>

      {/* 4 Performance Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: TOTAL DISTANCE */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-slate-400 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Distance</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{distanceKm} km</div>
          </div>
        </div>

        {/* STAT 2: ESTIMATED TRANSIT TIME */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-slate-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Transit Time</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{transitHours} hours</div>
          </div>
        </div>

        {/* STAT 3: ESTIMATED FUEL BURN */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-slate-400 shrink-0">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Fuel Burn</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">{fuelBurnLiters} L</div>
          </div>
        </div>

        {/* STAT 4: PASS CLEARANCE */}
        <div className="bg-[#12141a] border border-[#1e222d] rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#181b23] border border-[#232835] flex items-center justify-center text-slate-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pass Clearance</div>
            <div className="text-xl font-bold text-slate-200 mt-0.5">Flight Passage Clear</div>
          </div>
        </div>
      </div>

      {/* Bottom Split Layout: Route Map + Waypoint Telemetry List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map Container (8 Cols) - Dynamically Renders Active Preset Route */}
        <div className="lg:col-span-8 h-[440px] rounded-xl border border-[#1e222d] overflow-hidden relative bg-[#090b0f]">
          <MapContainer
            center={activePreset.coordinates[Math.floor(activePreset.coordinates.length / 2)]}
            zoom={8}
            zoomControl={false}
            scrollWheelZoom={true}
            className="w-full h-full leaflet-dark-tiles"
            key={activePreset.id}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Glowing route polyline with highlight blur */}
            <Polyline
              positions={activePreset.coordinates}
              pathOptions={{ color: '#38bdf8', weight: 12, opacity: 0.35, lineCap: 'round', lineJoin: 'round' }}
            />
            <Polyline
              positions={activePreset.coordinates}
              pathOptions={{ color: '#0284c7', weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }}
            />
            <Polyline
              positions={activePreset.coordinates}
              pathOptions={{ color: '#ffffff', weight: 2.5, opacity: 1.0, lineCap: 'round', lineJoin: 'round' }}
            />

            {/* Waypoint markers on map */}
            {activePreset.coordinates.map((coord, idx) => {
              const isOrigin = idx === 0;
              const isDest = idx === activePreset.coordinates.length - 1;
              return (
                <Marker
                  key={`${coord[0]}-${coord[1]}`}
                  position={coord}
                  icon={createConvoyPinIcon(isOrigin, isDest)}
                >
                  <Popup>
                    <div className="p-1 text-xs text-slate-200 font-sans">
                      <div className="font-bold border-b border-[#232938] pb-1">
                        {isOrigin ? 'Origin Terminal' : isDest ? 'Destination Forward Post' : `Route Waypoint ${idx}`}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        Coordinates: {coord[0].toFixed(4)}N, {coord[1].toFixed(4)}E
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Waypoint Telemetry List & Action Dispatch Console (4 Cols) */}
        <div className="lg:col-span-4 bg-[#12141a] border border-[#1e222d] rounded-xl p-4.5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1e222d] pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-400" />
                <span>Route Waypoint Telemetry</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Alt Ceiling: 4,500m
              </span>
            </div>

            {/* Dynamic Waypoints List */}
            <div className="mt-4 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {activePreset.waypoints.map((wp) => (
                <div key={wp.name} className="p-2.5 rounded-lg bg-[#161922] border border-[#232835] space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="truncate pr-2">{wp.stage}: {wp.name}</span>
                    <span className="font-mono text-cyan-400 shrink-0">Km {wp.km}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{wp.note}</span>
                    <span className="font-mono text-slate-300">{wp.altitudeFt.toLocaleString()} ft</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fully Interactive Mission Dispatch Control Console */}
          <div className="p-3.5 rounded-lg bg-[#151922] border border-[#252c3c] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Mission Operational Status</span>
              {dispatchedId ? (
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  <Check className="w-3 h-3" /> {dispatchedId} ACTIVE
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  READY FOR DISPATCH
                </span>
              )}
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Payload Capacity Margin:</span>
                <span className="font-mono text-slate-200">92% Available</span>
              </div>
              <div className="w-full bg-[#1c2230] rounded-full h-1 overflow-hidden">
                <div className="h-1 bg-cyan-400 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <button
              onClick={handleAuthorizeDispatch}
              disabled={isDispatching}
              className="w-full py-2 px-3 rounded-lg bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:bg-slate-700 disabled:text-slate-400"
            >
              <Send className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin' : ''}`} />
              <span>{isDispatching ? 'Transmitting Sortie Orders...' : dispatchedId ? 'Re-Dispatch Mission Update' : 'Authorize Convoy Mission'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvoyPathfinderView;
