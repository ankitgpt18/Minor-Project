import React from 'react';
import { Download, FileText, CheckCircle2, X } from 'lucide-react';
import { SECTORS, PASSES, CORRIDORS } from '../data/sectorsData';
import type { SectorDepot } from '../data/sectorsData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSector: SectorDepot;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  activeSector
}) => {
  if (!isOpen) return null;

  const handleDownloadJSON = () => {
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      classification: 'CLASSIFIED // NORTHERN COMMAND LOGISTICS',
      theater: 'LAC Eastern Ladakh Frontier (Sub-Sector North, Nubra, Indus, Chushul)',
      selectedSector: activeSector,
      allSectors: SECTORS,
      strategicPasses: PASSES,
      transitCorridors: CORRIDORS,
      privacyFramework: 'Adaptive Renyi DP-SGD (epsilon=1.85, delta=1e-5)',
      consensusProtocol: 'SecAgg+ Zero-Knowledge Masking & Directional Cosine Momentum'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tactical_Resupply_Dossier_${activeSector.id}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const headers = ['Sector ID', 'Name', 'Altitude (ft)', 'Assigned Force', '155mm Shells', 'Diesel (KL)', 'Rations (Days)', 'Drone Cells', 'Status'];
    const rows = SECTORS.map((s) => [
      s.id,
      `"${s.name}"`,
      s.altitudeFt,
      s.assignedForce,
      s.stockLevel.artillery155mm,
      s.stockLevel.winterDieselKL,
      s.stockLevel.dfrlRationsDays,
      s.stockLevel.droneBatteryCells,
      s.status
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LAC_Sector_Stock_Matrix_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#0e1015] border border-[#1e222d] rounded-xl p-5 shadow-2xl space-y-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e222d] pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Download className="w-4 h-4 text-slate-300" />
            <span>Export Tactical Logistics Telemetry Dossier</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-slate-300">
          <p className="text-slate-400 text-xs">
            Export authenticated inventory stocks, road clearance indices, and decentralized FL forecasts for <span className="text-white font-semibold">{activeSector.name}</span>.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleDownloadJSON}
              className="p-3.5 rounded-lg bg-[#141822] border border-[#232a3a] hover:bg-[#1a202c] hover:border-slate-500 transition-all cursor-pointer text-left space-y-2 group"
            >
              <div className="w-7 h-7 rounded-md bg-[#1d2332] flex items-center justify-center text-slate-200 group-hover:text-white">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-xs">JSON Telemetry Dossier</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Machine-readable JSON data with coordinates & DP bounds</div>
              </div>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="p-3.5 rounded-lg bg-[#141822] border border-[#232a3a] hover:bg-[#1a202c] hover:border-slate-500 transition-all cursor-pointer text-left space-y-2 group"
            >
              <div className="w-7 h-7 rounded-md bg-[#1d2332] flex items-center justify-center text-slate-200 group-hover:text-white">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-xs">CSV Stock Ledger</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Spreadsheet-compatible inventory audit matrix</div>
              </div>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-[#12151e] border border-[#1f2535] text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Verification Signature</span>
            </div>
            <div className="text-slate-400 space-y-0.5 text-[10.5px]">
              <div>Target Sector: <span className="text-slate-200 font-mono">{activeSector.shortCode}</span></div>
              <div>Security Mask: <span className="text-slate-200 font-mono">SecAgg+ Zero-Knowledge Hash Validated</span></div>
              <div>Export Format: <span className="text-slate-200 font-mono">UTF-8 Encoded Defense Telemetry</span></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#1e222d]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
