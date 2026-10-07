import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronUp, ChevronDown, Wifi, WifiOff, Trash2 } from 'lucide-react';
import type { SectorDepot } from '../data/sectorsData';

interface TelemetryConsoleProps {
  activeSector: SectorDepot;
  isEmcon: boolean;
  selectedMonth: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  node: string;
  subsystem: 'FL-CORE' | 'SECAFF' | 'RADIO' | 'DP-SGD' | 'TOP-K' | 'BYZANTINE';
  level: 'INFO' | 'WARN' | 'SECURE';
  message: string;
}

export const TelemetryConsole: React.FC<TelemetryConsoleProps> = ({
  activeSector,
  isEmcon,
  selectedMonth
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate initial operational logs
  useEffect(() => {
    const timeStr = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(Math.floor(d.getMilliseconds() / 100)).padStart(2, '0')}`;
    };

    const initialLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: timeStr(),
        node: 'SEC-1: LEH',
        subsystem: 'FL-CORE',
        level: 'INFO',
        message: 'Clustered Federated Aggregator online. Flower P2P mesh listening on local loopback.'
      },
      {
        id: '2',
        timestamp: timeStr(),
        node: 'CLUSTER-MUN',
        subsystem: 'DP-SGD',
        level: 'SECURE',
        message: 'Adaptive Rényi DP-SGD active (eps=1.85, delta=1e-5). Clipping bound set to S=1.2.'
      },
      {
        id: '3',
        timestamp: timeStr(),
        node: 'SEC-4: DBO',
        subsystem: 'TOP-K',
        level: 'INFO',
        message: 'Top-k 90% sparsification enabled: model weights compressed from 14.2 MB down to 1.42 MB.'
      },
      {
        id: '4',
        timestamp: timeStr(),
        node: activeSector.shortCode,
        subsystem: 'SECAFF',
        level: 'SECURE',
        message: `SecAgg+ Diffie-Hellman secret sharing established with ${activeSector.cluster}. Intercepted payloads appear as Gaussian noise.`
      }
    ];

    setLogs(initialLogs);
  }, []);

  // Inject dynamic log entries when sector or EMCON changes
  useEffect(() => {
    const timeStr = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(Math.floor(d.getMilliseconds() / 100)).padStart(2, '0')}`;
    };

    if (isEmcon) {
      const emconLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: timeStr(),
        node: activeSector.shortCode,
        subsystem: 'RADIO',
        level: 'WARN',
        message: 'EMCON SILENCE ACTIVE: Radio emissions suspended. Outgoing FL gradients queued to local SQLite memory buffer.'
      };
      setLogs((prev) => [...prev.slice(-30), emconLog]);
    } else {
      const sectorLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: timeStr(),
        node: activeSector.shortCode,
        subsystem: 'FL-CORE',
        level: 'INFO',
        message: `Telemetry node attached to ${activeSector.name}. Local Loss=${activeSector.localLoss}, Altitude=${activeSector.altitudeFt}ft MSL, ${selectedMonth} burn calibration.`
      };

      const threatLog: LogEntry = {
        id: (Date.now() + 1).toString(),
        timestamp: timeStr(),
        node: activeSector.shortCode,
        subsystem: activeSector.isJammed ? 'BYZANTINE' : 'SECAFF',
        level: activeSector.isJammed ? 'WARN' : 'SECURE',
        message: activeSector.isJammed
          ? 'ELECTRONIC WARFARE DETECTED: Chinese jamming sniffing detected on VHF hop. Directional cosine momentum filter active.'
          : 'SecAgg+ pairwise zero-knowledge handshake verified across adjacent mountain terminals.'
      };

      setLogs((prev) => [...prev.slice(-30), sectorLog, threatLog]);
    }
  }, [activeSector.id, isEmcon, selectedMonth]);

  // Auto-scroll to bottom of log terminal
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 select-none border-t border-[#1e222d] bg-[#090b0e]/95 backdrop-blur-md">
      {/* Drawer Toggle Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 items-center justify-between px-4 text-[11px] font-mono text-slate-400 hover:bg-[#12151e] cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-bold text-slate-200">TACTICAL EDGE TELEMETRY STREAM</span>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] text-slate-400">Node: {activeSector.shortCode}</span>
          <span className="text-slate-600">|</span>
          {isEmcon ? (
            <span className="flex items-center gap-1 text-[10px] text-zinc-300 font-bold">
              <WifiOff className="w-3 h-3 text-zinc-400" /> EMCON BUFFERING
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-zinc-300 font-semibold">
              <Wifi className="w-3 h-3 text-zinc-400" /> P2P MESH ACTIVE (1.42 MB/rnd)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-500">
            {logs.length} packet events
          </span>
          <div className="text-zinc-400 hover:text-white">
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>

      {/* Expandable Console Terminal Body */}
      {isOpen && (
        <div className="border-t border-[#1a1e29] bg-[#06070a] p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#161a24] text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="text-zinc-300 font-semibold">Decentralized Flower/PyTorch Event Bus</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                Local SQLite Buffer: Synchronized
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLogs([]);
              }}
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Console</span>
            </button>
          </div>

          <div
            ref={scrollRef}
            className="h-44 overflow-y-auto space-y-1 font-mono text-[11px] leading-relaxed pr-2 scrollbar-thin scrollbar-thumb-zinc-800"
          >
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 hover:bg-[#0c0e15] px-1 py-0.5 rounded">
                <span className="text-zinc-500 shrink-0 select-none">[{log.timestamp}]</span>
                <span className="font-bold text-zinc-300 shrink-0 w-24 truncate">{log.node}</span>
                <span
                  className={`px-1.5 py-0 rounded text-[9px] font-mono font-bold shrink-0 ${
                    log.level === 'WARN'
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-600'
                      : log.level === 'SECURE'
                      ? 'bg-zinc-900 text-zinc-100 border border-zinc-700'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {log.subsystem}
                </span>
                <span
                  className={`break-all ${
                    log.level === 'WARN'
                      ? 'text-zinc-300 font-medium'
                      : log.level === 'SECURE'
                      ? 'text-zinc-200'
                      : 'text-zinc-400'
                  }`}
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
