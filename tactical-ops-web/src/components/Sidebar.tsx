import React from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Activity,
  Navigation,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export type NavView =
  | 'EXECUTIVE_DASHBOARD'
  | 'INTERACTIVE_TACTICAL_MAP'
  | 'CONSUMPTION_TRENDS'
  | 'CONVOY_PATHFINDER'
  | 'RISK_EARLY_WARNING';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  unreadAlertsCount?: number;
  onOpenDocs?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  onOpenDocs
}) => {
  return (
    <aside
      className={`h-screen bg-[#0e1015] border-r border-[#1e222d] flex flex-col transition-all duration-300 z-50 select-none ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#1e222d]/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>TacticalRoute</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                LAC Defense FL Intelligence
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-md bg-[#161922] border border-[#232836] hover:bg-[#1f2432] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {/* SECTION 1: OVERVIEW */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
              Overview
            </div>
          )}
          <button
            onClick={() => onSelectView('EXECUTIVE_DASHBOARD')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentView === 'EXECUTIVE_DASHBOARD'
                ? 'bg-white text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#161922]'
            }`}
            title="Executive Dashboard"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Executive Dashboard</span>}
          </button>
        </div>

        {/* SECTION 2: GEOSPATIAL & TELEMETRY */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
              Geospatial & Telemetry
            </div>
          )}
          <button
            onClick={() => onSelectView('INTERACTIVE_TACTICAL_MAP')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentView === 'INTERACTIVE_TACTICAL_MAP'
                ? 'bg-white text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#161922]'
            }`}
            title="Interactive Frontier Map"
          >
            <MapIcon className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Interactive Frontier Map</span>}
          </button>

          <button
            onClick={() => onSelectView('CONSUMPTION_TRENDS')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentView === 'CONSUMPTION_TRENDS'
                ? 'bg-white text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#161922]'
            }`}
            title="Consumption & Stock Trends"
          >
            <Activity className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Consumption & Stock Trends</span>}
          </button>
        </div>

        {/* SECTION 3: OPERATIONS */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
              Operations
            </div>
          )}
          <button
            onClick={() => onSelectView('CONVOY_PATHFINDER')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentView === 'CONVOY_PATHFINDER'
                ? 'bg-white text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#161922]'
            }`}
            title="Convoy & UAV Pathfinder"
          >
            <Navigation className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Convoy & UAV Pathfinder</span>}
          </button>

          <button
            onClick={() => onSelectView('RISK_EARLY_WARNING')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentView === 'RISK_EARLY_WARNING'
                ? 'bg-white text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#161922]'
            }`}
            title="Pass Risk & Early Warning"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Risk & Early Warning</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono">
                Alerts
              </span>
            )}
          </button>
        </div>

        {/* SECTION 4: ARCHITECTURE & SPECS */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
              Architecture & Specs
            </div>
          )}
          <button
            onClick={onOpenDocs}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:bg-[#161922] transition-all cursor-pointer"
            title="System Architecture & Docs"
          >
            <BookOpen className="w-4 h-4 shrink-0 text-cyan-400" />
            {!isCollapsed && <span>System Architecture Docs</span>}
          </button>
        </div>
      </div>

      {/* Bottom Collapsed Toggle bar */}
      <div className="h-12 border-t border-[#1e222d] px-3 flex items-center justify-center">
        <button
          onClick={onToggleCollapse}
          className="text-slate-500 hover:text-slate-300 text-xs transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
