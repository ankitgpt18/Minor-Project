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
import { TelemetryConsole } from './components/TelemetryConsole';
import { LoginPage } from './components/LoginPage';
import { Bell, X } from 'lucide-react';

export const App: React.FC = () => {
  // Authentication session state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tandem_auth') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem('tandem_user') || 'Ankit Gupta';
  });

  const [currentView, setCurrentView] = useState<NavView>('EXECUTIVE_DASHBOARD');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeSectorId, setActiveSectorId] = useState<string>('sec-leh');
  const [selectedMonth, setSelectedMonth] = useState<string>('September');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isEmcon, setIsEmcon] = useState<boolean>(false);

  const activeSector = SECTORS.find((s: SectorDepot) => s.id === activeSectorId) || SECTORS[0];

  // Dynamic alert count based on active sector conditions
  const alertCount = (() => {
    let count = 2; // baseline: Sasser Pass blockage + AWS stocking notification
    if (activeSector.isJammed) count += 2;
    if (activeSector.isCompromised) count += 1;
    if (activeSector.stockLevel.dfrlRationsDays < 40) count += 1;
    if (activeSector.altitudeFt > 15000) count += 1;
    if (activeSector.status === 'CRITICAL') count += 1;
    return count;
  })();

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleLogin = (userName: string) => {
    setCurrentUser(userName);
    setIsAuthenticated(true);
    localStorage.setItem('tandem_auth', 'true');
    localStorage.setItem('tandem_user', userName);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tandem_auth');
  };

  // If user is not authenticated, show Vercel-style Tandem Login Screen
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0b0e] text-slate-100 font-sans">
      {/* Left Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        unreadAlertsCount={alertCount}
        onOpenDocs={() => setIsDocsOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
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
          unreadAlertsCount={alertCount}
          onOpenExport={() => setIsExportOpen(true)}
          isEmcon={isEmcon}
          onToggleEmcon={() => setIsEmcon(!isEmcon)}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto bg-[#0a0b0e] pb-10">
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
            <ConsumptionTrendsView
              activeSector={activeSector}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}

          {currentView === 'CONVOY_PATHFINDER' && (
            <ConvoyPathfinderView activeSector={activeSector} />
          )}

          {currentView === 'RISK_EARLY_WARNING' && (
            <RiskEarlyWarningView activeSector={activeSector} />
          )}
        </main>
      </div>

      {/* Real-Time Live Telemetry Console Drawer */}
      <TelemetryConsole
        activeSector={activeSector}
        isEmcon={isEmcon}
        selectedMonth={selectedMonth}
      />

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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-[#0c0e15] border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-white" />
                <span>Tactical Operational Alerts ({alertCount} Active)</span>
              </span>
              <button
                onClick={() => setIsAlertsOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Close Alerts"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              <div className="p-3.5 rounded-lg bg-[#12141a] border border-zinc-800/80 text-zinc-300 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span>Pass Blockage: Sasser Pass</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-200 border border-zinc-700">
                    17,753 ft &bull; CRITICAL
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Heavy snowfall warning. Corridor closed to wheeled transport. Automatic fallback routed to heavy-lift logistics drone.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#12141a] border border-zinc-800/80 text-zinc-300 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                    <span>EW Jamming Beacon: DBO Air Corridor</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-200 border border-zinc-700">
                    16,614 ft &bull; EW WARNING
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Hostile electronic warfare sniffing detected. SecAgg+ zero-knowledge masking activated; bare weights suppressed.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#12141a] border border-zinc-800/80 text-zinc-300 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                    <span>Advance Winter Stocking: 14 Corps Leh</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-200 border border-zinc-700">
                    AWS SYNC &bull; 98.2%
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Federated GRU completed multi-round consensus. Ammunition safety stock buffer calibrated for 5-month isolation.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#12141a] border border-zinc-800/80 text-zinc-300 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                    <span>Khardung La Wind Advisory</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-200 border border-zinc-700">
                    17,982 ft &bull; ADVISORY
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Sustained 65 km/h crosswinds. UAV vertical lift operations suspended until wind speed drops below 45 km/h threshold.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#12141a] border border-zinc-800/80 text-zinc-300 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span>DBO Ration Stock Critical</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-200 border border-zinc-700">
                    22 DAYS &bull; DEPLETION
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Forward post rations below 30-day threshold. Emergency drone resupply sortie from Diskit Hub queued.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-800">
              <button
                onClick={() => setIsAlertsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white text-slate-950 font-bold hover:bg-zinc-200 transition-colors cursor-pointer text-xs shadow-sm"
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
