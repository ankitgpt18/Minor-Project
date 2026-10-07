import {
  LayoutDashboard,
  Map as MapIcon,
  Activity,
  Navigation,
  ShieldAlert,
  ChevronLeft,
  BookOpen,
  LogOut,
  User
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
  currentUser?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  unreadAlertsCount = 7,
  onOpenDocs,
  currentUser = 'Duty Logistics Officer',
  onLogout
}) => {
  return (
    <aside
      className={`h-screen bg-[#0e1015] border-r border-[#1e222d] flex flex-col transition-all duration-200 z-50 select-none shrink-0 ${
        isCollapsed ? 'w-[68px]' : 'w-[250px]'
      }`}
    >
      {/* Brand Header: Cleanly centered when collapsed, spaced when expanded */}
      <div
        className={`h-16 border-b border-[#1e222d] flex items-center ${
          isCollapsed ? 'justify-center px-0' : 'justify-between px-4'
        }`}
      >
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 rounded-lg bg-[#141720] border border-[#232835] hover:bg-[#1b1f2b] p-1.5 flex items-center justify-center transition-colors cursor-pointer"
            title="Expand Navigation"
          >
            <img src="/tandem-logo.png" alt="Tandem" className="w-6 h-6 object-contain rounded" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#141720] border border-[#232835] flex items-center justify-center shrink-0 overflow-hidden p-1">
                <img src="/tandem-logo.png" alt="Tandem" className="w-6 h-6 object-contain rounded" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-base tracking-tight text-white">
                  Tandem
                </div>
              </div>
            </div>

            <button
              onClick={onToggleCollapse}
              className="w-7 h-7 rounded-md bg-[#141720] border border-[#232835] hover:bg-[#1b1f2b] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Collapse Navigation"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {/* SECTION 1: OVERVIEW */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
              Overview
            </div>
          )}
          <button
            onClick={() => onSelectView('EXECUTIVE_DASHBOARD')}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
            } py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentView === 'EXECUTIVE_DASHBOARD'
                ? 'bg-white text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141720]'
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
            <div className="px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
              Geospatial & Telemetry
            </div>
          )}
          <button
            onClick={() => onSelectView('INTERACTIVE_TACTICAL_MAP')}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
            } py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentView === 'INTERACTIVE_TACTICAL_MAP'
                ? 'bg-white text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141720]'
            }`}
            title="Interactive Frontier Map"
          >
            <MapIcon className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Interactive Frontier Map</span>}
          </button>

          <button
            onClick={() => onSelectView('CONSUMPTION_TRENDS')}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
            } py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentView === 'CONSUMPTION_TRENDS'
                ? 'bg-white text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141720]'
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
            <div className="px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
              Operations
            </div>
          )}
          <button
            onClick={() => onSelectView('CONVOY_PATHFINDER')}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
            } py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentView === 'CONVOY_PATHFINDER'
                ? 'bg-white text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141720]'
            }`}
            title="Convoy & UAV Pathfinder"
          >
            <Navigation className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Convoy & UAV Pathfinder</span>}
          </button>

          <button
            onClick={() => onSelectView('RISK_EARLY_WARNING')}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
            } py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentView === 'RISK_EARLY_WARNING'
                ? 'bg-white text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#141720]'
            }`}
            title="Pass Risk & Early Warning"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Risk & Early Warning</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* SECTION 4: ARCHITECTURE & SPECS */}
        <div className="space-y-1 pt-2 border-t border-[#1e222d]/60">
          {!isCollapsed && (
            <div className="px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
              Documentation
            </div>
          )}
          <button
            onClick={onOpenDocs}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
            } py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-[#141720] transition-all cursor-pointer`}
            title="System Architecture & Docs"
          >
            <BookOpen className="w-4 h-4 shrink-0 text-slate-400" />
            {!isCollapsed && <span>Architecture & Specs</span>}
          </button>
        </div>

        {/* SECTION 5: ACCOUNT */}
        {onLogout && (
          <div className="space-y-1 pt-2 border-t border-[#1e222d]/60">
            {!isCollapsed && (
              <div className="px-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                Account
              </div>
            )}
            <button
              onClick={onLogout}
              className={`w-full flex items-center justify-between ${
                isCollapsed ? 'justify-center px-0' : 'px-3'
              } py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-[#141720] transition-all cursor-pointer group`}
              title={`${currentUser} (Click to Sign Out)`}
            >
              <div className="flex items-center gap-3 truncate mr-1.5">
                <User className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-white transition-colors" />
                {!isCollapsed && <span className="font-semibold text-slate-200 truncate">{currentUser}</span>}
              </div>
              {!isCollapsed && (
                <LogOut className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-white transition-colors" />
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
