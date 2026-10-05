import React from 'react';
import { BookOpen, Shield, Database, Cpu } from 'lucide-react';

export const DocsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0c0e15] border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090b10]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Tactical Federated Learning Defense System: Technical Architecture & Docs
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300">
          {/* Executive Overview */}
          <section className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-bold text-cyan-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>1. Operational Context & Problem Boundary</span>
            </h3>
            <p className="text-slate-400 leading-relaxed text-[11.5px]">
              Forward military logistics across high-altitude mountain frontiers (Eastern Ladakh, Line of Actual Control)
              operate within strict operational silos. Subordinate operational commands (14 Corps Leh, 3 Inf Div Nyoma, 8 Mtn Div Kargil)
              cannot centralize live ammunition, fuel, and unit positions due to classification compartmentalization. Simultaneously,
              tactical passes (Zojila, Khardung La) close for 60 to 110 days annually due to blizzards, while hostile electronic warfare (over 465 confirmed GPS jamming incidents)
              prohibits continuous radio streaming to central headquarters.
            </p>
          </section>

          {/* 4 Hardened Pillars */}
          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-cyan-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>2. The 4-Pillar Hardened FL Pipeline</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-200">1. Clustered FL (CFL) on Heterogeneous Sectors</div>
                <p className="text-slate-400">
                  Partitions nodes into Munitions, Infantry, and Drone clusters using weight trajectory cosine similarity.
                  Mitigates Non-IID client drift while sharing universal terrain elevation drag layers.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-200">2. Adaptive Rényi DP-SGD (Layer-Wise)</div>
                <p className="text-slate-400">
                  Dynamic sensitivity clipping threshold Ct = Median(||g_i||) per round. Allocates 1.4x noise to shallow coordinate
                  layers and 0.8x to deep forecast layers (eps=1.85, delta=1e-5), defeating GI-SMN inversion attacks.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-200">3. SecAgg+ Zero-Knowledge Masking & Top-k</div>
                <p className="text-slate-400">
                  Prunes 90% of insignificant weights (14.2 MB down to 1.42 MB for sub-100ms burst). Ephemeral Diffie-Hellman
                  pairwise masks render intercepted packets as uniform random noise, eliminating RF traffic correlation.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-200">4. Directional Cosine Momentum Filter</div>
                <p className="text-slate-400">
                  Validates neighbor update trajectories against historical momentum (Cosine Similarity &ge; 0.25) before Coordinate-wise trimming.
                  Neutralizes stealth backdoors (Layer Smoothing Attacks) from overrun nodes with 98.5% accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* Dataset Sourcing & Grounding */}
          <section className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-bold text-cyan-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>3. Grounded Open Datasets (100% Free & Legal)</span>
            </h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Dataset</th>
                    <th className="p-2">Source</th>
                    <th className="p-2">Resolution / Size</th>
                    <th className="p-2">Tactical Simulation Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="p-2 font-medium">NASA SRTM / Cartosat DEM</td>
                    <td className="p-2 text-slate-400">OpenTopography</td>
                    <td className="p-2 font-mono">30-meter GeoTIFF</td>
                    <td className="p-2 text-slate-400">Calculates road slope drag & drone ridge radar-masking</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Leh-Ladakh Road Graph</td>
                    <td className="p-2 text-slate-400">OpenStreetMap / OSMnx</td>
                    <td className="p-2 font-mono">15,000+ Segments</td>
                    <td className="p-2 text-slate-400">NH-1D, DS-DBO, and high-altitude mountain corridors</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Himalayan Climate Series</td>
                    <td className="p-2 text-slate-400">NASA POWER / IMD</td>
                    <td className="p-2 font-mono">2018-Present Daily</td>
                    <td className="p-2 text-slate-400">Models blizzard pass closures & sub-zero battery drain</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">High-Altitude Nutrition Baseline</td>
                    <td className="p-2 text-slate-400">DRDO / DFRL Standards</td>
                    <td className="p-2 font-mono">4,500 kcal/day</td>
                    <td className="p-2 text-slate-400">Calibrates non-IID ration and fuel burn profiles</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Academic Attribution & Viva Reference */}
          <section className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-[11px] space-y-1">
            <div className="font-semibold text-slate-200">Academic & Mentor Information</div>
            <div className="text-slate-400">
              Student: Ankit Gupta (23AI010) &bull; 7th Semester B.Tech &bull; Gati Shakti Vishwavidyalaya (GSV), Vadodara
            </div>
            <div className="text-slate-400">
              Faculty Mentor: Dr. Shweta Saharan, Assistant Professor, GSV
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#090b10] flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
