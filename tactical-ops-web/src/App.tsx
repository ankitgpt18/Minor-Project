import React, { useState } from 'react';
import { SECTORS, type SectorDepot } from './data/sectorsData';
import { Sidebar, type NavView } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { ExecutiveDashboardView } from './components/ExecutiveDashboardView';
import { InteractiveTacticalMapView } from './components/InteractiveTacticalMapView';
import { ConsumptionTrendsView } from './components/ConsumptionTrendsView';
import { ConvoyPathfinderView } from './components/ConvoyPathfinderView';
import { RiskEarlyWarningView } from './components/RiskEarlyWarningView';
import { DocsModal } from './components/DocsModal';
import { ExportModal } from './components/ExportModal';
import { Bell } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<NavView>('EXECUTIVE_DASHBOARD');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeSectorId, setActiveSectorId] = useState<string>('sec-leh');
  const [selectedMonth, setSelectedMonth] = useState<string>('September');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const activeSector = SECTORS.find((s: SectorDepot) => s.id === activeSectorId) || SECTORS[0];

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0b0e] text-slate-100 font-sans">
      {/* Left Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        unreadAlertsCount={7}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar Header */}
        <TopNavbar
          activeSectorId={activeSectorId}
          onSelectSector={setActiveSectorId}
          selectedMonth={selectedMonth}
          onChangeMonth={setSelectedMonth}
          selectedYear={selectedYear}
          onChangeYear={setSelectedYear}
          onRefreshTelemetry={handleRefreshTelemetry}
          isRefreshing={isRefreshing}
          onOpenAlerts={() => setIsAlertsOpen(true)}
          unreadAlertsCount={7}
          onOpenDocs={() => setIsDocsOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto bg-[#0a0b0e]">
          {currentView === 'EXECUTIVE_DASHBOARD' && (
            <ExecutiveDashboardView activeSector={activeSector} />
          )}

          {currentView === 'INTERACTIVE_TACTICAL_MAP' && (
            <InteractiveTacticalMapView
              activeSector={activeSector}
              onSelectSector={setActiveSectorId}
            />
          )}

          {currentView === 'CONSUMPTION_TRENDS' && (
            <ConsumptionTrendsView activeSector={activeSector} />
          )}

          {currentView === 'CONVOY_PATHFINDER' && (
            <ConvoyPathfinderView activeSector={activeSector} />
          )}

          {currentView === 'RISK_EARLY_WARNING' && (
            <RiskEarlyWarningView activeSector={activeSector} />
          )}
        </main>
      </div>

      {/* Architecture Documentation Modal */}
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      {/* Export Telemetry Dossier Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        activeSector={activeSector}
      />

      {/* Alerts Modal Drawer */}
      {isAlertsOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0e1015] border border-[#1e222d] rounded-xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1e222d] pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-rose-400" />
                <span>Tactical Operational Alerts (7 Active)</span>
              </span>
              <button
                onClick={() => setIsAlertsOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                x
              </button>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto">
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-slate-300 space-y-1">
                <div className="font-bold text-rose-400 flex items-center justify-between">
                  <span>Pass Blockage: Sasser Pass</span>
                  <span className="text-[10px] font-mono">17,753 ft</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Heavy snowfall warning. Corridor closed to wheeled transport. Automatic fallback routed to heavy-lift logistics drone.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-slate-300 space-y-1">
                <div className="font-bold text-amber-400 flex items-center justify-between">
                  <span>EW Jamming Beacon: DBO Air Corridor</span>
                  <span className="text-[10px] font-mono">16,614 ft</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Hostile electronic warfare sniffing detected. SecAgg+ zero-knowledge masking activated; bare weights suppressed.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-slate-300 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center justify-between">
                  <span>Advance Winter Stocking: 14 Corps Leh</span>
                  <span className="text-[10px] font-mono">98.2% Accuracy</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Federated GRU completed multi-round consensus. Ammunition safety stock buffer calibrated for 5-month isolation.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-slate-300 space-y-1">
                <div className="font-bold text-amber-400 flex items-center justify-between">
                  <span>Khardung La Wind Advisory</span>
                  <span className="text-[10px] font-mono">17,982 ft</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Sustained 65 km/h crosswinds. UAV vertical lift operations suspended until wind speed drops below 45 km/h threshold.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-slate-300 space-y-1">
                <div className="font-bold text-rose-400 flex items-center justify-between">
                  <span>DBO Ration Stock Critical</span>
                  <span className="text-[10px] font-mono">22 days left</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Forward post rations below 30-day threshold. Emergency drone resupply sortie from Diskit Hub queued.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1e222d]">
              <button
                onClick={() => setIsAlertsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors cursor-pointer text-xs"
              >
                Acknowledge All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
