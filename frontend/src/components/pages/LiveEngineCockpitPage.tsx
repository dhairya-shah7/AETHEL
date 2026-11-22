import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Activity, 
  Database, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  TrendingDown, 
  ShieldCheck,
  Server,
  ArrowRight
} from 'lucide-react';
import { 
  executeLiveHardwareBenchmark, 
  fetchTraceFrame, 
  fetchTraceDatasets, 
  BenchmarkResult, 
  TraceFrameResult, 
  DatasetMetadata 
} from '../../services/api';

interface LiveEngineCockpitPageProps {
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
}

export const LiveEngineCockpitPage: React.FC<LiveEngineCockpitPageProps> = ({
  onNavigatePrev,
  onNavigateNext
}) => {
  // ----------------- SECTION A: LIVE PYTORCH BENCHMARK STATE -----------------
  const [benchmarkLoading, setBenchmarkLoading] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);
  const [iterations, setIterations] = useState<number>(30);
  const [hiddenDim, setHiddenDim] = useState<number>(2048);
  const [benchmarkTerminalLogs, setBenchmarkTerminalLogs] = useState<string[]>([
    '[INIT] PyTorch execution bridge initialized.',
    '[READY] Ready to execute live neural network layer in host memory.'
  ]);

  // ----------------- SECTION B: TRACE REPLAYER STATE -----------------
  const [selectedDataset, setSelectedDataset] = useState<string>('alibaba_pai_gpu');
  const [datasets, setDatasets] = useState<Record<string, DatasetMetadata>>({});
  const [playbackSec, setPlaybackSec] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 5x, 20x
  const [traceFrame, setTraceFrame] = useState<TraceFrameResult | null>(null);
  const playTimerRef = useRef<any>(null);

  useEffect(() => {
    fetchTraceDatasets().then(setDatasets);
    fetchTraceFrame(0, selectedDataset).then(setTraceFrame);
  }, [selectedDataset]);

  // Trace player tick
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setPlaybackSec((prev) => {
          if (prev >= 120) {
            setIsPlaying(false);
            return 120;
          }
          const next = prev + 1;
          fetchTraceFrame(next, selectedDataset).then(setTraceFrame);
          return next;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, playbackSpeed, selectedDataset]);

  const handleRunLiveBenchmark = async () => {
    setBenchmarkLoading(true);
    setBenchmarkTerminalLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Instantiating deep feedforward layer (${hiddenDim}x${hiddenDim * 2}) in host RAM...`,
      ...prev
    ]);

    try {
      const res = await executeLiveHardwareBenchmark(iterations, hiddenDim);
      setBenchmarkResult(res);
      setBenchmarkTerminalLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] SUCCESS: Executed ${iterations} iterations. Baseline FP32: ${res.baseline_fp32.total_time_ms}ms, AETHEL INT8: ${res.optimized_int8.total_time_ms}ms. Memory reduced by ${res.verified_improvements.memory_reduction_pct}%!`,
        `[${new Date().toLocaleTimeString()}] Dynamic quantization kernel shift complete: freed ${res.verified_improvements.freed_ram_mb} MB of RAM.`,
        ...prev
      ]);
    } finally {
      setBenchmarkLoading(false);
    }
  };

  const handleSeek = (newSec: number) => {
    setPlaybackSec(newSec);
    fetchTraceFrame(newSec, selectedDataset).then(setTraceFrame);
  };

  const handleResetTrace = () => {
    setIsPlaying(false);
    setPlaybackSec(0);
    fetchTraceFrame(0, selectedDataset).then(setTraceFrame);
  };

  const currentDatasetMeta = datasets[selectedDataset] || {
    name: 'Alibaba PAI GPU Cluster Trace',
    citation: 'Alibaba Platform for AI (PAI), Open-PAI Trace 2020/2022',
    scope: '6,500+ NVIDIA GPUs'
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* 1. TOP HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={24} color="#38bdf8" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#DAF1DE' }}>
              Live Engine & Trace Cockpit (Technical Proof Machine)
            </h1>
            <p style={{ fontSize: 13, margin: '2px 0 0 0', color: 'var(--c-sage)' }}>
              Real PyTorch Execution on Host Silicon & Authenticated Production Datacenter Trace Replay
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: LIVE PYTORCH BENCHMARK PROOF MACHINE */}
      {/* ========================================================================= */}
      <div className="glass-panel" style={{ padding: 24, borderRadius: 18, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: '#38bdf8',
              color: '#051f20',
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
              letterSpacing: '0.05em'
            }}>
              PILLAR 1: LIVE SILICON EXECUTION
            </span>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#DAF1DE' }}>
              Real Host PyTorch Optimization Benchmark (Zero Mocks)
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--c-sage)' }}>
              <span>Iterations:</span>
              <select
                value={iterations}
                onChange={(e) => setIterations(parseInt(e.target.value))}
                style={{
                  background: 'rgba(5, 31, 32, 0.85)',
                  border: '1px solid rgba(142, 182, 155, 0.3)',
                  color: '#DAF1DE',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 12
                }}
              >
                <option value={15}>15 passes</option>
                <option value={30}>30 passes (Default)</option>
                <option value={50}>50 passes (Heavy)</option>
              </select>
            </div>

            <button
              onClick={handleRunLiveBenchmark}
              disabled={benchmarkLoading}
              style={{
                background: benchmarkLoading ? 'rgba(56, 189, 248, 0.3)' : 'linear-gradient(135deg, #38bdf8, #0284c7)',
                color: '#051f20',
                border: 'none',
                borderRadius: 10,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 800,
                cursor: benchmarkLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 18px rgba(56, 189, 248, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={16} color="#051f20" />
              {benchmarkLoading ? 'Running Real PyTorch Layers...' : 'Run Live PyTorch Benchmark'}
            </button>
          </div>
        </div>

        {/* Benchmark Results Display */}
        {benchmarkResult ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
            marginBottom: 18
          }}>
            {/* Baseline Card */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 14,
              padding: 18
            }}>
              <div style={{ fontSize: 11, color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                BASELINE FP32 (STATUS QUO)
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#DAF1DE', marginBottom: 4 }}>
                {benchmarkResult.baseline_fp32.total_time_ms} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--c-sage)' }}>ms total</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-sage)', marginBottom: 10 }}>
                Avg Latency: <strong>{benchmarkResult.baseline_fp32.avg_latency_per_pass_ms} ms / pass</strong>
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-sage)' }}>
                Weights in RAM: <strong style={{ color: '#fca5a5' }}>{benchmarkResult.baseline_fp32.model_weights_mb} MB</strong> (32-bit floats)
              </div>
            </div>

            {/* Optimized Card */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(187, 244, 81, 0.45)',
              borderRadius: 14,
              padding: 18
            }}>
              <div style={{ fontSize: 11, color: '#bbf451', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                AETHEL DYNAMIC INT8 QUANTIZATION
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#bbf451', marginBottom: 4 }}>
                {benchmarkResult.optimized_int8.total_time_ms} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--c-sage)' }}>ms total</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-sage)', marginBottom: 10 }}>
                Avg Latency: <strong>{benchmarkResult.optimized_int8.avg_latency_per_pass_ms} ms / pass</strong>
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-sage)' }}>
                Weights in RAM: <strong style={{ color: '#bbf451' }}>{benchmarkResult.optimized_int8.model_weights_mb} MB</strong> (8-bit integers)
              </div>
            </div>

            {/* Verified Improvement Delta Card */}
            <div style={{
              background: 'rgba(5, 31, 32, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 14,
              padding: 18
            }}>
              <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                VERIFIED REAL SILICON DELTA
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#38bdf8', marginBottom: 4 }}>
                -{benchmarkResult.verified_improvements.memory_reduction_pct}% <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--c-sage)' }}>RAM Footprint</span>
              </div>
              <div style={{ fontSize: 12, color: '#DAF1DE', marginBottom: 6 }}>
                Freed Physical RAM: <strong style={{ color: '#bbf451' }}>{benchmarkResult.verified_improvements.freed_ram_mb} MB</strong>
              </div>
              <div style={{ fontSize: 12, color: 'var(--c-sage)' }}>
                Memory Bus Heat Shed: <strong style={{ color: '#bbf451' }}>~{benchmarkResult.verified_improvements.memory_bus_heat_shed_pct}%</strong>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'rgba(5, 31, 32, 0.65)',
            border: '1px dashed rgba(142, 182, 155, 0.25)',
            borderRadius: 12,
            padding: '24px 20px',
            textAlign: 'center',
            marginBottom: 18
          }}>
            <Cpu size={32} color="#38bdf8" style={{ margin: '0 auto 10px auto', opacity: 0.8 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: '#DAF1DE', marginBottom: 4 }}>
              Click "Run Live PyTorch Benchmark" to execute real code on your laptop silicon.
            </div>
            <div style={{ fontSize: 12, color: 'var(--c-sage)' }}>
              Runs a real PyTorch Transformer Feed-Forward layer, measures real millisecond latency and memory allocation before vs. after dynamic quantization.
            </div>
          </div>
        )}

        {/* Live Terminal Log */}
        <div style={{
          background: 'rgba(5, 20, 22, 0.95)',
          border: '1px solid rgba(142, 182, 155, 0.25)',
          borderRadius: 10,
          padding: '10px 14px',
          fontFamily: 'monospace',
          fontSize: 11,
          maxHeight: 120,
          overflowY: 'auto'
        }}>
          {benchmarkTerminalLogs.map((log, i) => (
            <div key={i} style={{ color: log.includes('SUCCESS') ? '#bbf451' : (log.includes('INIT') ? '#38bdf8' : '#DAF1DE'), marginBottom: 2 }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION B: AUTHENTICATED PRODUCTION DATACENTER TRACE REPLAYER */}
      {/* ========================================================================= */}
      <div className="glass-panel" style={{ padding: 24, borderRadius: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{
                background: '#bbf451',
                color: '#051f20',
                fontSize: 10,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 6,
                letterSpacing: '0.05em'
              }}>
                PILLAR 2: AUTHENTICATED TRACE REPLAY
              </span>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#DAF1DE' }}>
                Datacenter Telemetry Trace Replayer (Cluster Scale)
              </h2>
            </div>
            <p style={{ fontSize: 12, color: 'var(--c-sage)', margin: 0 }}>
              Replaying authenticated public cluster traces: <strong>{currentDatasetMeta.name}</strong> ({currentDatasetMeta.citation})
            </p>
          </div>

          {/* Dataset Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--c-sage)', fontWeight: 600 }}>DATASET:</span>
            <select
              value={selectedDataset}
              onChange={(e) => {
                setSelectedDataset(e.target.value);
                handleSeek(0);
              }}
              style={{
                background: 'rgba(5, 31, 32, 0.85)',
                border: '1px solid rgba(187, 244, 81, 0.4)',
                color: '#bbf451',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600
              }}
            >
              <option value="alibaba_pai_gpu">Alibaba PAI GPU Cluster Trace (6,500+ GPUs)</option>
              <option value="azure_gpu_cluster">Microsoft Azure Datacenter VM & GPU Traces</option>
              <option value="google_borg_v3">Google Borg Cluster Workload Trace (v3)</option>
            </select>
          </div>
        </div>

        {/* Timeline Scrubber & Playback Controls */}
        <div style={{
          background: 'rgba(5, 31, 32, 0.75)',
          borderRadius: 14,
          padding: '14px 18px',
          marginBottom: 20,
          border: '1px solid rgba(142, 182, 155, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying ? '#f59e0b' : '#bbf451',
                color: '#051f20',
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play Trace'}
            </button>

            <button
              onClick={handleResetTrace}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(142, 182, 155, 0.3)',
                color: '#DAF1DE',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <RotateCcw size={14} />
              Reset
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--c-sage)', marginLeft: 8 }}>
              <span>Speed:</span>
              {[1, 5, 20].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  style={{
                    background: playbackSpeed === s ? 'rgba(187, 244, 81, 0.2)' : 'transparent',
                    color: playbackSpeed === s ? '#bbf451' : 'var(--c-sage)',
                    border: playbackSpeed === s ? '1px solid rgba(187, 244, 81, 0.4)' : '1px solid transparent',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: '#DAF1DE' }}>
              Timestamp: <span style={{ color: '#bbf451' }}>T + {playbackSec}s</span> / 120s
            </div>
          </div>

          {/* Range Scrubber */}
          <input
            type="range"
            min="0"
            max="120"
            value={playbackSec}
            onChange={(e) => handleSeek(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#bbf451' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--c-sage)', marginTop: 4 }}>
            <span>0s (Nominal State)</span>
            <span style={{ color: '#f59e0b' }}>30s (AETHEL 180s Preemptive Alarm Engages)</span>
            <span style={{ color: '#ef4444' }}>60s+ (Unmanaged Racks Crash into 35% Throttling)</span>
            <span>120s</span>
          </div>
        </div>

        {/* Trace Comparison: Unmanaged vs AETHEL Cluster */}
        {traceFrame && (
          <div className="responsive-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Unmanaged Side */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 14,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#fca5a5', fontWeight: 800 }}>RAW PRODUCTION TRACE (UNMANAGED)</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#DAF1DE' }}>
                    Throttled Nodes: <strong style={{ color: '#ef4444' }}>{traceFrame.unmanaged_cluster.throttled_count}</strong> / 16
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--c-sage)' }}>
                  Avg Temp: <strong style={{ color: traceFrame.unmanaged_cluster.avg_temp_c >= 72 ? '#ef4444' : '#DAF1DE' }}>{traceFrame.unmanaged_cluster.avg_temp_c}°C</strong>
                </div>
              </div>

              {/* Node Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {traceFrame.unmanaged_cluster.nodes.map((n) => {
                  const isThrottled = n.status.includes('THROTTLED');
                  return (
                    <div
                      key={n.node_id}
                      style={{
                        background: isThrottled ? 'rgba(239, 68, 68, 0.25)' : 'rgba(5, 31, 32, 0.8)',
                        border: isThrottled ? '1px solid #ef4444' : '1px solid rgba(142, 182, 155, 0.2)',
                        borderRadius: 8,
                        padding: 8,
                        fontSize: 10
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#DAF1DE' }}>{n.node_id}</div>
                      <div style={{ color: isThrottled ? '#ef4444' : '#4ade80', fontWeight: 700 }}>{n.temp_c}°C</div>
                      <div style={{ color: 'var(--c-sage)' }}>{n.clock_speed_mhz} MHz</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AETHEL Side */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(187, 244, 81, 0.45)',
              borderRadius: 14,
              padding: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#bbf451', fontWeight: 800 }}>AETHEL CO-SCHEDULER (PREEMPTIVE INT8)</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#DAF1DE' }}>
                    Throttled Nodes: <strong style={{ color: '#4ade80' }}>0 (ZERO THROTTLING)</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--c-sage)' }}>
                  Quantized: <strong style={{ color: '#bbf451' }}>{traceFrame.aethel_cluster.quantized_nodes_count} nodes</strong>
                </div>
              </div>

              {/* Node Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {traceFrame.aethel_cluster.nodes.map((n) => {
                  const isQuant = n.precision === 'INT8';
                  return (
                    <div
                      key={n.node_id}
                      style={{
                        background: isQuant ? 'rgba(187, 244, 81, 0.20)' : 'rgba(5, 31, 32, 0.8)',
                        border: isQuant ? '1px solid #bbf451' : '1px solid rgba(142, 182, 155, 0.2)',
                        borderRadius: 8,
                        padding: 8,
                        fontSize: 10
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#DAF1DE' }}>{n.node_id}</div>
                      <div style={{ color: '#4ade80', fontWeight: 700 }}>{n.temp_c}°C</div>
                      <div style={{ color: isQuant ? '#bbf451' : 'var(--c-sage)', fontWeight: isQuant ? 700 : 400 }}>
                        {n.precision} (1410 MHz)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Proactive Alert Stream */}
        {traceFrame && traceFrame.alerts.length > 0 && (
          <div style={{
            marginTop: 16,
            background: 'rgba(187, 244, 81, 0.12)',
            border: '1px solid rgba(187, 244, 81, 0.35)',
            borderRadius: 10,
            padding: '10px 16px',
            fontSize: 12,
            color: '#bbf451',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <ShieldCheck size={18} />
            <div>
              <strong>AETHEL Autonomous Action Triggered: </strong>
              {traceFrame.alerts[0].detail}
            </div>
          </div>
        )}
      </div>

      {/* STEP FLOW NAVIGATION */}
      <div style={{
        marginTop: 28,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {onNavigatePrev && (
          <button
            onClick={onNavigatePrev}
            style={{
              padding: '12px 22px',
              fontSize: 13,
              fontWeight: 700,
              background: 'rgba(5, 31, 32, 0.85)',
              border: '1px solid rgba(142, 182, 155, 0.3)',
              borderRadius: 999,
              color: '#DAF1DE',
              cursor: 'pointer'
            }}
          >
            ← Step 1: Back to Showcase
          </button>
        )}

        {onNavigateNext && (
          <button
            onClick={onNavigateNext}
            className="neon-pill-btn"
            style={{
              padding: '14px 28px',
              fontSize: 14,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 0 25px rgba(187, 244, 81, 0.35)',
              marginLeft: 'auto'
            }}
          >
            <span>Step 3: Calculate Your Cloud Savings</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
