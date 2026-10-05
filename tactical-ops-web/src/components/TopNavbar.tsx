import React from 'react';
import {
  RefreshCw,
  Bell,
  Download,
  Satellite
} from 'lucide-react';
import { SECTORS } from '../data/sectorsData';

interface TopNavbarProps {
  activeSectorId: string;
  onSelectSector: (sectorId: string) => void;
  selectedMonth: string;
  onChangeMonth: (m: string) => void;
  selectedYear: string;
  onChangeYear: (y: string) => void;
  onRefreshTelemetry: () => void;
  isRefreshing: boolean;
  onOpenAlerts: () => void;
  unreadAlertsCount: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeSectorId,
  onSelectSector,
  selectedMonth,
  onChangeMonth,
  selectedYear,
  onChangeYear,
  onRefreshTelemetry,
  isRefreshing,
  onOpenAlerts,
  unreadAlertsCount
}) => {
  return (
    <header className="h-16 px-4 bg-[#0e1015] border-b border-[#1e222d] flex items-center justify-between text-xs select-none sticky top-0 z-40">
      {/* Left: Sector Selector Horizontal Pills (Like NW-1, NW-2, NW-3 in InlandRoute) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[620px] scrollbar-none">
        {SECTORS.map((sector) => {
          const isActive = sector.id === activeSectorId;
          return (
            <button
              key={sector.id}
              onClick={() => onSelectSector(sector.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-950 font-bold shadow-sm'
                  : 'bg-[#151820] text-slate-400 hover:text-slate-200 border border-[#232835]'
              }`}
            >
              {sector.shortCode}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Sentinel Date, Theme Toggle, Refresh, Alerts, Export */}
      <div className="flex items-center gap-2.5">
        {/* Sensor / Period Dropdown Pill */}
        <div className="hidden md:flex items-center gap-2 bg-[#151820] border border-[#232835] rounded-lg px-2.5 py-1.5 text-slate-300">
          <Satellite className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">NASA DEM / IMD:</span>
          <select
            value={selectedMonth}
            onChange={(e) => onChangeMonth(e.target.value)}
            className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer"
          >
            <option value="September" className="bg-[#151820]">September</option>
            <option value="October" className="bg-[#151820]">October</option>
            <option value="November" className="bg-[#151820]">November (AWS Peak)</option>
            <option value="December" className="bg-[#151820]">December (Sub-Zero)</option>
            <option value="January" className="bg-[#151820]">January (Pass Freeze)</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => onChangeYear(e.target.value)}
            className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer"
          >
            <option value="2026" className="bg-[#151820]">2026</option>
            <option value="2025" className="bg-[#151820]">2025</option>
          </select>
        </div>

        {/* Sync / Refresh Button */}
        <button
          onClick={onRefreshTelemetry}
          disabled={isRefreshing}
          className="w-8 h-8 rounded-lg bg-[#151820] border border-[#232835] hover:bg-[#1e2330] text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          title="Synchronize Decentralized Telemetry"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Alerts Pill */}
        <button
          onClick={onOpenAlerts}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151820] border border-[#232835] hover:bg-[#1e2330] text-slate-300 font-medium cursor-pointer transition-colors"
        >
          <Bell className="w-3.5 h-3.5 text-rose-400" />
          <span>Alerts</span>
          {unreadAlertsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] flex items-center justify-center font-bold">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Export Dossier Dropdown Button */}
        <button
          onClick={() => {
            alert('Exporting Classified High-Altitude Telemetry Dossier (DP-Sanitized PDF/XLSX)...');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
