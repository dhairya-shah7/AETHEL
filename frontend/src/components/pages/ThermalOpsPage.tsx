import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  RefreshCw, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Lock, 
  Unlock,
  Activity,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { 
  ThermalNode, 
  BunkerTelemetry, 
  MitigationEvent, 
  fetchThermalNodes, 
  injectChaos, 
  resetChaos, 
  manualMitigate, 
  distillCodeAST,
  generateLocalThermalSimulation 
} from '../../services/api';

export const ThermalOpsPage: React.FC = () => {
  // Multi-tenant isolation filter
  const [selectedTenant, setSelectedTenant] = useState<string>('Facility SuperAdmin');
  
  // Cluster state
  const [nodes, setNodes] = useState<ThermalNode[]>(() => generateLocalThermalSimulation());
  const [circuitState, setCircuitState] = useState<string>('CLOSED');
  const [bunkerData, setBunkerData] = useState<BunkerTelemetry>({
    enclave_mode: 'physical_standby',
    enclave_status: 'SEALED_ARMED',
    circuit_tripped: false,
    trip_timestamp: null,
    sealed_records_count: 4,
    compression_ratio_pct: 85.0,
    retrieval_latency_ms: 0.08,
    cgroups_pinning: 'Dedicated Node-B1,B2',
    uncompressed_kb_ingested: 48.6,
    sealed_vtoken_kb: 7.3,
    last_audit_hash: '0x8F4E2D1A'
  });
  const [events, setEvents] = useState<MitigationEvent[]>([
    {
      id: 'evt-init',
      timestamp: Date.now(),
      timestamp_iso: new Date().toLocaleTimeString(),
      action: 'SYSTEM_BOOT',
      node_id: 'CLUSTER_CORE',
      detail: 'AETHEL Silicon-to-Software Thermal Co-Scheduler initialized with 180s predictive RC model.',
      severity: 'SUCCESS'
    }
  ]);

  // Dynamic Chaos Controls (No Hardcoding)
  const [ingressMultiplier, setIngressMultiplier] = useState<number>(3.5);
  const [latencyTimeout, setLatencyTimeout] = useState<number>(800);
  const [failureCascade, setFailureCascade] = useState<number>(25);
  const [chaosLoading, setChaosLoading] = useState<boolean>(false);
  const [lastQueueSlope, setLastQueueSlope] = useState<number>(14.7);

  // AST Distiller Sandbox
  const [distillCode, setDistillCode] = useState<string>(
    `import torch\n\n# Multi-Head Attention Forward Pass\ndef attention_forward(q, k, v):\n    scores = (q @ k.transpose(-2, -1)) * (1.0 / 8.0)\n    attn_weights = torch.softmax(scores, dim=-1)\n    return attn_weights @ v\n`
  );
  const [distillResult, setDistillResult] = useState<any>(null);
  const [distillLoading, setDistillLoading] = useState<boolean>(false);

  // Action feedback
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // WebSocket Connection with React 19 Strict-Mode Clean Lifecycle
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    let retryDelay = 1000;

    const connectWebSocket = () => {
      // Avoid duplicate socket if already open
      if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
        return;
      }

      try {
        const ws = new WebSocket('ws://localhost:8000/ws/thermal');
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) { ws.close(); return; }
          retryDelay = 1000;
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'THERMAL_TELEMETRY_FRAME') {
              if (data.nodes) setNodes(data.nodes);
              if (data.circuit_state) setCircuitState(data.circuit_state);
              if (data.bunker) setBunkerData(data.bunker);
              if (data.recent_events && data.recent_events.length > 0) {
                setEvents((prev) => {
                  const combined = [...data.recent_events, ...prev];
                  const unique = Array.from(new Map(combined.map(e => [e.id, e])).values());
                  return unique.slice(0, 50);
                });
              }
            }
          } catch (e) {
            console.error('WS frame parse error:', e);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          wsRef.current = null;
          // Exponential backoff reconnect (1s, 2s, 4s max)
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, Math.min(4000, retryDelay));
          retryDelay *= 2;
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        // Fallback reconnection
        if (isMounted) {
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        }
      }
    };

    connectWebSocket();

    // Secondary client polling fallback if WS is disconnected
    const fallbackInterval = setInterval(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        fetchThermalNodes(selectedTenant).then(res => {
          if (isMounted && res.nodes) {
            setNodes(res.nodes);
            setCircuitState(res.circuit_state);
          }
        });
      }
    }, 2500);

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      clearInterval(fallbackInterval);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  // Filter nodes by tenant privacy boundary
  const filteredNodes = nodes.filter(n => {
    if (selectedTenant === 'Facility SuperAdmin') return true;
    return n.tenant_id === selectedTenant;
  });

  // Aggregated KPIs
  const totalPowerW = filteredNodes.reduce((acc, n) => acc + n.power_w, 0);
  const criticalCount = filteredNodes.filter(n => n.thermal_tier === 'CRITICAL').length;
  const cordonedCount = filteredNodes.filter(n => n.status === 'CORDONED').length;
  const int8Count = filteredNodes.filter(n => n.precision === 'INT8').length;
  const totalWasteAvoidedUsd = filteredNodes.reduce((acc, n) => acc + (n.status === 'CORDONED' ? 1.07 : 0), 0) * 24;

  const handleInjectChaos = async () => {
    setChaosLoading(true);
    try {
      const res = await injectChaos({
        ingress_multiplier: ingressMultiplier,
        latency_timeout_ms: latencyTimeout,
        failure_cascade_pct: failureCascade
      });
      if (res.calculated_queue_slope) setLastQueueSlope(res.calculated_queue_slope);
      if (res.circuit_state) setCircuitState(res.circuit_state);
      setActionFeedback(`Injected ${ingressMultiplier}x surge. Queue slope: +${res.calculated_queue_slope}/s`);
      setTimeout(() => setActionFeedback(null), 3500);
    } finally {
      setChaosLoading(false);
    }
  };

  const handleResetCircuit = async () => {
    await resetChaos();
    setCircuitState('CLOSED');
    setActionFeedback('Circuit breaker closed. Normal cluster ingress restored.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleNodeAction = async (nodeId: string, action: string) => {
    await manualMitigate(nodeId, action);
    setActionFeedback(`Executed ${action} on ${nodeId}`);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleDistillAST = async () => {
    setDistillLoading(true);
    try {
      const res = await distillCodeAST(distillCode);
      setDistillResult(res);
    } finally {
      setDistillLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* 1. TOP HEADER & TENANT ISOLATION BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={22} color="#ef4444" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#DAF1DE' }}>
                Silicon Thermal Co-Scheduler & ThermalOps Cockpit
              </h1>
              <p style={{ fontSize: 13, margin: 0, color: 'var(--c-sage)' }}>
                Autonomous Closed-Loop Prevention of GPU Thermal Throttling & Cascading Outages
              </p>
            </div>
          </div>
        </div>

        {/* Dual-Layer Multi-Tenant Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(5, 31, 32, 0.75)',
          padding: '4px 6px',
          borderRadius: 12,
          border: '1px solid rgba(142, 182, 155, 0.25)'
        }}>
          <span style={{ fontSize: 11, color: 'var(--c-sage)', padding: '0 8px', fontWeight: 600 }}>
            TENANT SCOPE:
          </span>
          {['Facility SuperAdmin', 'Acme AI', 'DeepVision Labs'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTenant(t)}
              style={{
                background: selectedTenant === t ? 'rgba(187, 244, 81, 0.18)' : 'transparent',
                color: selectedTenant === t ? '#bbf451' : 'var(--c-sage)',
                border: selectedTenant === t ? '1px solid rgba(187, 244, 81, 0.4)' : '1px solid transparent',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {actionFeedback && (
        <div style={{
          background: 'rgba(187, 244, 81, 0.15)',
          border: '1px solid rgba(187, 244, 81, 0.4)',
          borderRadius: 8,
          padding: '10px 16px',
          marginBottom: 16,
          fontSize: 13,
          color: '#bbf451',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <CheckCircle2 size={16} />
          {actionFeedback}
        </div>
      )}

      {/* 2. TOP RESILIENCE BUNKER & CIRCUIT BREAKER BANNER */}
      <div style={{
        background: circuitState === 'OPEN'
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(80, 15, 15, 0.45))'
          : 'linear-gradient(135deg, rgba(16, 50, 45, 0.65), rgba(7, 25, 23, 0.85))',
        border: circuitState === 'OPEN'
          ? '1px solid rgba(239, 68, 68, 0.6)'
          : '1px solid rgba(142, 182, 155, 0.25)',
        borderRadius: 16,
        padding: '18px 22px',
        marginBottom: 20,
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: circuitState === 'OPEN' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(187, 244, 81, 0.15)',
            border: circuitState === 'OPEN' ? '1px solid #ef4444' : '1px solid #bbf451',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {circuitState === 'OPEN' ? (
              <ShieldAlert size={26} color="#ef4444" />
            ) : (
              <Lock size={24} color="#bbf451" />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--c-sage)', textTransform: 'uppercase' }}>
                VERDE RESILIENCE BUNKER & CASCADING BREAKER
              </span>
              <span style={{
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 999,
                fontWeight: 700,
                background: circuitState === 'OPEN' ? '#ef4444' : '#22c55e',
                color: '#051f20'
              }}>
                BREAKER {circuitState}
              </span>
            </div>
            <div style={{ fontSize: 14, color: '#DAF1DE', marginTop: 3 }}>
              {circuitState === 'OPEN' ? (
                <strong style={{ color: '#fca5a5' }}>
                  CONTAINMENT ACTIVE — Auth & Invariants Sealed in V-Tokens (-85% memory). Ingress Shedding Engaged.
                </strong>
              ) : (
                <span>
                  Enclave Armed ({bunkerData.cgroups_pinning}) • Zero-Amnesia Synapse Retrieval: <strong>{bunkerData.retrieval_latency_ms} ms</strong> • Audit: <code style={{ color: '#bbf451' }}>{bunkerData.last_audit_hash}</code>
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right', marginRight: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>V-TOKEN COMPRESSION</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#bbf451' }}>
              -{bunkerData.compression_ratio_pct}%
            </div>
          </div>

          {circuitState === 'OPEN' && (
            <button
              onClick={handleResetCircuit}
              style={{
                background: '#bbf451',
                color: '#051f20',
                border: 'none',
                borderRadius: 10,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Unlock size={16} />
              Reset Breaker & Unseal
            </button>
          )}
        </div>
      </div>

      {/* 3. FOUR AGGREGATED METRICS CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        <div className="glass-panel" style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--c-sage)', fontWeight: 600 }}>CLUSTER POWER</span>
            <Zap size={16} color="#bbf451" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#DAF1DE' }}>
            {(totalPowerW / 1000).toFixed(2)} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--c-sage)' }}>kW</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 4 }}>
            Active across {filteredNodes.length} compute nodes
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--c-sage)', fontWeight: 600 }}>THERMAL HOTSPOTS</span>
            <Flame size={16} color={criticalCount > 0 ? '#ef4444' : '#bbf451'} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: criticalCount > 0 ? '#ef4444' : '#DAF1DE' }}>
            {criticalCount} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--c-sage)' }}>/ {filteredNodes.length} nodes</span>
          </div>
          <div style={{ fontSize: 11, color: criticalCount > 0 ? '#fca5a5' : 'var(--c-sage)', marginTop: 4 }}>
            {criticalCount > 0 ? 'Preemptive micro-DVFS engaged' : 'Equilibrium nominal (<74°C)'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--c-sage)', fontWeight: 600 }}>AUTONOMOUS TRIAGE</span>
            <Activity size={16} color="#38bdf8" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#38bdf8' }}>
            {cordonedCount} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--c-sage)' }}>cordoned</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 4 }}>
            {int8Count} nodes shifted to INT8 quantization
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--c-sage)', fontWeight: 600 }}>THROTTLING LOSS AVOIDED</span>
            <TrendingDown size={16} color="#bbf451" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#bbf451' }}>
            ${totalWasteAvoidedUsd.toFixed(2)} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--c-sage)' }}>/ day</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 4 }}>
            Preserved 35% GPU compute throughput
          </div>
        </div>
      </div>

      {/* 4. MAIN COCKPIT GRID: HEATMAP + CHAOS/DISTILLER CONTROLS */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        
        {/* LEFT COLUMN: 3D HEATMAP RACK GRID */}
        <div className="glass-panel" style={{ padding: 22, borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#DAF1DE' }}>
                Cluster Silicon Heatmap & 180s Predictive Rate (dT/dt)
              </h2>
              <p style={{ fontSize: 12, color: 'var(--c-sage)', margin: '2px 0 0 0' }}>
                Vectorized lumped-capacitance ODE projecting junction temperatures 3 minutes ahead
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} /> &lt;72°C
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} /> 72-80°C
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> &gt;80°C (Critical)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7' }} /> Bunker
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12
          }}>
            {filteredNodes.map((n) => {
              const isCrit = n.thermal_tier === 'CRITICAL' || n.temp_c >= 80.0;
              const isWarn = n.thermal_tier === 'WARNING' || (n.temp_c >= 72.0 && n.temp_c < 80.0);
              const cardBg = n.is_bunker_node
                ? 'rgba(168, 85, 247, 0.12)'
                : (isCrit ? 'rgba(239, 68, 68, 0.15)' : (isWarn ? 'rgba(245, 158, 11, 0.12)' : 'rgba(7, 30, 28, 0.6)'));
              const borderColor = n.is_bunker_node
                ? 'rgba(168, 85, 247, 0.45)'
                : (isCrit ? 'rgba(239, 68, 68, 0.55)' : (isWarn ? 'rgba(245, 158, 11, 0.45)' : 'rgba(142, 182, 155, 0.2)'));

              return (
                <div
                  key={n.node_id}
                  style={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 12,
                    padding: 14,
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#DAF1DE' }}>{n.node_id}</span>
                      {n.is_bunker_node && (
                        <span style={{ fontSize: 9, background: '#a855f7', color: '#fff', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                          BUNKER
                        </span>
                      )}
                    </div>
                    <span style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 6,
                      fontWeight: 700,
                      background: n.status === 'CORDONED' ? '#ef4444' : (n.status === 'POWER_CAPPED' ? '#f59e0b' : 'rgba(34, 197, 94, 0.2)'),
                      color: n.status === 'CORDONED' ? '#fff' : (n.status === 'POWER_CAPPED' ? '#fbbf24' : '#4ade80')
                    }}>
                      {n.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--c-sage)', marginBottom: 8 }}>
                    {n.arch.replace('NVIDIA_', '')} • {n.tenant_id}
                  </div>

                  {/* Temperature Gauges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 10, color: 'var(--c-sage)' }}>CORE TEMP: </span>
                      <strong style={{
                        fontSize: 18,
                        color: isCrit ? '#ef4444' : (isWarn ? '#fbbf24' : '#4ade80')
                      }}>
                        {n.temp_c}°C
                      </strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 10, color: 'var(--c-sage)' }}>180s PRED: </span>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: n.predicted_temp_180s >= 80 ? '#ef4444' : '#fbbf24'
                      }}>
                        {n.predicted_temp_180s}°C
                      </span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: 'var(--c-sage)', marginBottom: 10 }}>
                    <div>Power: <strong style={{ color: '#DAF1DE' }}>{n.power_w}W</strong> / {n.tdp_watts}W</div>
                    <div>Fan: <strong style={{ color: '#DAF1DE' }}>{n.fan_speed_pct}%</strong></div>
                    <div>Precision: <strong style={{ color: n.precision === 'INT8' ? '#bbf451' : '#38bdf8' }}>{n.precision}</strong></div>
                    <div>Waste: <strong style={{ color: isCrit ? '#ef4444' : '#DAF1DE' }}>${n.financial_waste_usd_hr}/h</strong></div>
                  </div>

                  {/* Node Quick Actions */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => handleNodeAction(n.node_id, n.status === 'CORDONED' ? 'RESTORE' : 'CORDON')}
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(142, 182, 155, 0.25)',
                        color: '#DAF1DE',
                        borderRadius: 6,
                        padding: '4px 6px',
                        fontSize: 10,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {n.status === 'CORDONED' ? 'Uncordon' : 'Cordon'}
                    </button>
                    <button
                      onClick={() => handleNodeAction(n.node_id, 'DVFS_POWER_CAP')}
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(142, 182, 155, 0.25)',
                        color: '#fbbf24',
                        borderRadius: 6,
                        padding: '4px 6px',
                        fontSize: 10,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Power Cap
                    </button>
                    <button
                      onClick={() => handleNodeAction(n.node_id, 'QUANTIZE_INT8')}
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(142, 182, 155, 0.25)',
                        color: '#bbf451',
                        borderRadius: 6,
                        padding: '4px 6px',
                        fontSize: 10,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      INT8
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: CHAOS CONTROLS & AST DISTILLER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* A. DYNAMIC CHAOS INJECTOR (No Hardcoding) */}
          <div className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Sliders size={18} color="#bbf451" />
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#DAF1DE' }}>
                  Dynamic Chaos & Cascading Outage Generator
                </h3>
                <span style={{ fontSize: 11, color: 'var(--c-sage)' }}>Zero hardcoding • Dynamic slope testing</span>
              </div>
            </div>

            {/* Slider 1: Ingress Multiplier */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: 'var(--c-sage)' }}>Ingress Surge:</span>
                <strong style={{ color: '#bbf451' }}>{ingressMultiplier}x normal</strong>
              </div>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                value={ingressMultiplier}
                onChange={(e) => setIngressMultiplier(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#bbf451' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--c-sage)' }}>
                <span>1x (Nominal)</span>
                <span>6x (Breaker Tripwire)</span>
                <span>15x (Extreme)</span>
              </div>
            </div>

            {/* Slider 2: Failure Cascade Rate */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: 'var(--c-sage)' }}>Failure Cascade Rate:</span>
                <strong style={{ color: '#fbbf24' }}>{failureCascade}% of nodes</strong>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={failureCascade}
                onChange={(e) => setFailureCascade(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#fbbf24' }}
              />
            </div>

            {/* Slope & Trip Status */}
            <div style={{
              background: 'rgba(5, 31, 32, 0.75)',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 11,
              marginBottom: 14,
              border: '1px solid rgba(142, 182, 155, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'var(--c-sage)' }}>Queue Rate Slope (dQ/dt):</span>
                <strong style={{ color: lastQueueSlope > 25 ? '#ef4444' : '#4ade80' }}>
                  +{lastQueueSlope} jobs/s
                </strong>
              </div>
              <div style={{ fontSize: 10, color: 'var(--c-sage)' }}>
                Safe numerical floor (Δt ≥ 1ms) enforced to prevent divide-by-zero under surge.
              </div>
            </div>

            <button
              onClick={handleInjectChaos}
              disabled={chaosLoading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(185, 28, 28, 0.95))',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: 700,
                cursor: chaosLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
              }}
            >
              <AlertTriangle size={16} />
              {chaosLoading ? 'Injecting Chaos...' : 'Inject Cascading Surge'}
            </button>
          </div>

          {/* B. VERDE AST CODE DISTILLER */}
          <div className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Terminal size={18} color="#38bdf8" />
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#DAF1DE' }}>
                  VERDE Pre-Execution AST Distiller
                </h3>
                <span style={{ fontSize: 11, color: 'var(--c-sage)' }}>Predicts silicon heat surge before job launch</span>
              </div>
            </div>

            <textarea
              value={distillCode}
              onChange={(e) => setDistillCode(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(5, 31, 32, 0.85)',
                border: '1px solid rgba(142, 182, 155, 0.3)',
                borderRadius: 8,
                padding: 10,
                fontFamily: 'monospace',
                fontSize: 11,
                color: '#DAF1DE',
                marginBottom: 10,
                resize: 'vertical'
              }}
            />

            <button
              onClick={handleDistillAST}
              disabled={distillLoading}
              style={{
                width: '100%',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: distillLoading ? 'not-allowed' : 'pointer',
                marginBottom: 10
              }}
            >
              {distillLoading ? 'Distilling AST...' : 'Distill AST Energy & Thermal Impact'}
            </button>

            {distillResult && (
              <div style={{
                background: 'rgba(5, 31, 32, 0.9)',
                border: '1px solid rgba(142, 182, 155, 0.25)',
                borderRadius: 8,
                padding: 10,
                fontSize: 11
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--c-sage)' }}>Predicted Thermal Surge:</span>
                  <strong style={{ color: distillResult.predicted_thermal_surge_c > 15 ? '#ef4444' : '#4ade80' }}>
                    +{distillResult.predicted_thermal_surge_c}°C
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--c-sage)' }}>Tensor Matrix Multiplications:</span>
                  <span style={{ color: '#DAF1DE' }}>{distillResult.tensor_matmuls_detected} ops</span>
                </div>
                <div style={{ fontSize: 10, color: '#bbf451', marginTop: 4 }}>
                  {distillResult.optimization_recommendation}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. SUB-SECOND REAL-TIME MITIGATION EVENT AUDIT TERMINAL */}
      <div className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={18} color="#bbf451" />
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#DAF1DE' }}>
              Autonomous Mitigation Event Stream (1 Hz Live Audit)
            </h3>
          </div>
          <span style={{ fontSize: 11, color: 'var(--c-sage)' }}>
            Showing {events.length} real-time audit records
          </span>
        </div>

        <div style={{
          background: 'rgba(5, 31, 32, 0.95)',
          border: '1px solid rgba(142, 182, 155, 0.25)',
          borderRadius: 10,
          padding: 12,
          maxHeight: 220,
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: 11
        }}>
          {events.map((evt) => {
            const color = evt.severity === 'CRITICAL' ? '#ef4444' : (evt.severity === 'SUCCESS' ? '#4ade80' : '#fbbf24');
            return (
              <div key={evt.id} style={{ display: 'flex', gap: 10, marginBottom: 4, lineHeight: '1.4' }}>
                <span style={{ color: 'var(--c-sage)', flexShrink: 0 }}>[{evt.timestamp_iso}]</span>
                <span style={{ color, fontWeight: 700, flexShrink: 0 }}>[{evt.action}]</span>
                <span style={{ color: '#38bdf8', flexShrink: 0 }}>{evt.node_id}:</span>
                <span style={{ color: '#DAF1DE' }}>{evt.detail}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
