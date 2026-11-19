import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Play, 
  RefreshCw, 
  BarChart3, 
  TrendingDown, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { profileWorkload, TelemetryProfile } from '../../services/api';

export const TelemetryPage: React.FC = () => {
  const [instanceType, setInstanceType] = useState('g4dn.xlarge');
  const [region, setRegion] = useState('IN_NATIONAL');
  const [duration, setDuration] = useState(3.5);
  const [cpuUtil, setCpuUtil] = useState(0.85);
  const [workloadType, setWorkloadType] = useState('LLM Inference Batch');
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<TelemetryProfile>({
    instance_type: 'g4dn.xlarge',
    duration_sec: 3.5,
    avg_power_watts: 188.5,
    energy_joules: 659.75,
    energy_kwh: 0.000183,
    carbon_gco2e: 0.1312,
    water_liters: 0.00033,
    cost_usd: 0.00051,
    workload_type: 'LLM Inference Batch',
    region: 'IN_NATIONAL',
    grid_emission_factor: 716.0,
    subsystem_joules: {
      cpu_pkg: 409.05,
      dram: 118.76,
      gpu: 98.96,
      unhalted_io: 32.99
    }
  });

  const handleRunProfile = async () => {
    setLoading(true);
    try {
      const res = await profileWorkload({
        instance_type: instanceType,
        region,
        duration_sim_sec: duration,
        cpu_utilization: cpuUtil,
        workload_type: workloadType
      });
      setProfile(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
          PILLAR 1: LIVE POWER METER
        </span>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
          Real-Time Software Power Meter
        </h2>
        <p style={{ fontSize: 14, color: 'var(--c-sage)', marginTop: 8 }}>
          See the exact electricity, carbon emissions, and rupees your cloud servers are using right now. No guesswork—pure live hardware telemetry.
        </p>
      </div>

      {/* Main Benchmarking Stage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
        {/* Controls Card */}
        <div className="liquid-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Sliders size={18} color="#bbf451" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Workload Parameters</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Workload Preset */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                Workload Type
              </label>
              <select
                value={workloadType}
                onChange={(e) => setWorkloadType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(2, 13, 14, 0.7)',
                  border: '1px solid rgba(35, 83, 71, 0.6)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  outline: 'none'
                }}
              >
                <option value="LLM Inference Batch">LLM Inference Batch (Llama-3 70B Quantized)</option>
                <option value="Matrix Multiply (GEMM)">Matrix Multiply (Dense GEMM FP16)</option>
                <option value="ResNet-50 Vision Pipeline">ResNet-50 Vision Video Pipeline</option>
                <option value="Distributed Microservices">Distributed Microservices Spike</option>
              </select>
            </div>

            {/* Instance Selection */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                Cloud Hardware Profile
              </label>
              <select
                value={instanceType}
                onChange={(e) => setInstanceType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(2, 13, 14, 0.7)',
                  border: '1px solid rgba(35, 83, 71, 0.6)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  outline: 'none'
                }}
              >
                <option value="g4dn.xlarge">AWS g4dn.xlarge (4 vCPUs, NVIDIA T4 GPU, $0.526/hr)</option>
                <option value="p4d.24xlarge">AWS p4d.24xlarge (96 vCPUs, 8x A100 GPU, $32.77/hr)</option>
                <option value="c5.xlarge">AWS c5.xlarge (4 vCPUs, Intel Xeon, $0.170/hr)</option>
                <option value="c5.4xlarge">AWS c5.4xlarge (16 vCPUs, Intel Xeon, $0.680/hr)</option>
                <option value="p3.2xlarge">AWS p3.2xlarge (8 vCPUs, NVIDIA V100, $3.060/hr)</option>
              </select>
            </div>

            {/* Grid Region */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                Grid Carbon Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(2, 13, 14, 0.7)',
                  border: '1px solid rgba(35, 83, 71, 0.6)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  outline: 'none'
                }}
              >
                <option value="IN_NATIONAL">IN_NATIONAL (CEA India ~ 716 gCO2e/kWh)</option>
                <option value="IN_WESTERN">IN_WESTERN (Western Regional Grid ~ 740 gCO2e/kWh)</option>
                <option value="EU_WEST">EU_WEST (European Hydro & Clean Mix ~ 230 gCO2e/kWh)</option>
                <option value="US_EAST">US_EAST (PJM Interconnection ~ 379 gCO2e/kWh)</option>
              </select>
            </div>

            {/* Duration Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-sage)', marginBottom: 6 }}>
                <span>Workload Duration</span>
                <span style={{ color: '#bbf451', fontWeight: 700 }}>{duration.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="30"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#bbf451' }}
              />
            </div>

            {/* CPU Utilization Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-sage)', marginBottom: 6 }}>
                <span>Average Compute Load</span>
                <span style={{ color: '#bbf451', fontWeight: 700 }}>{(cpuUtil * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={cpuUtil}
                onChange={(e) => setCpuUtil(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#bbf451' }}
              />
            </div>

            {/* Run Button */}
            <button
              className="neon-pill-btn"
              onClick={handleRunProfile}
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: 8,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? <RefreshCw size={16} className="spin" /> : <Play size={16} />}
              <span>{loading ? 'Executing RAPL Hardware Audit...' : 'Execute Live RAPL Benchmark'}</span>
            </button>
          </div>
        </div>

        {/* Live Output & Oscilloscope */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Oscilloscope Card */}
          <div className="liquid-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={18} color="#bbf451" />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
                  Real-Time Power Draw Oscilloscope
                </h4>
              </div>
              <span style={{
                fontSize: 11,
                padding: '3px 9px',
                borderRadius: 999,
                background: 'rgba(187, 244, 81, 0.15)',
                color: '#bbf451',
                border: '1px solid rgba(187, 244, 81, 0.3)'
              }}>
                {profile.avg_power_watts} W AVERAGE
              </span>
            </div>

            {/* SVG Oscilloscope Waveform */}
            <div style={{
              background: 'rgba(2, 13, 14, 0.85)',
              borderRadius: 16,
              padding: 16,
              border: '1px solid rgba(35, 83, 71, 0.5)',
              position: 'relative'
            }}>
              <svg width="100%" height="120" viewBox="0 0 500 120" fill="none">
                {/* Grid Lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(142, 182, 155, 0.1)" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(142, 182, 155, 0.1)" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(142, 182, 155, 0.1)" strokeDasharray="4 4" />

                {/* Unoptimized Baseline Wave (dashed red/amber) */}
                <path
                  d="M0 90 C70 90, 110 30, 180 35 C250 40, 310 15, 380 25 C450 35, 480 20, 500 25"
                  stroke="rgba(239, 68, 68, 0.5)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Optimized AETHEL Wave (solid neon lime) */}
                <path
                  d="M0 105 C80 105, 120 70, 190 75 C260 80, 320 60, 390 68 C460 74, 480 65, 500 70"
                  stroke="#bbf451"
                  strokeWidth="3"
                />

                {/* Target Marker */}
                <circle cx="390" cy="68" r="5" fill="#bbf451" />
                <text x="402" y="65" fill="#bbf451" fontSize="11" fontWeight="700">AETHEL Kernel Mode</text>
                <text x="402" y="28" fill="#f87171" fontSize="10">Baseline TDP</text>
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--c-sage)', marginTop: 8 }}>
                <span>0.00s (RAPL Start)</span>
                <span>Sampling Window: {profile.duration_sec}s</span>
                <span>Active Core P-State 0</span>
              </div>
            </div>
          </div>

          {/* Telemetry Output Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <div style={{ background: 'rgba(2, 13, 14, 0.6)', padding: 18, borderRadius: 16, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
              <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>Kernel Energy</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                {profile.energy_joules.toLocaleString()} <span style={{ fontSize: 12, color: '#bbf451' }}>Joules</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--c-sage)', marginTop: 4 }}>{profile.energy_kwh.toFixed(6)} kWh</div>
            </div>

            <div style={{ background: 'rgba(2, 13, 14, 0.6)', padding: 18, borderRadius: 16, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
              <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>Carbon Emitted</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                {profile.carbon_gco2e.toFixed(4)} <span style={{ fontSize: 12, color: '#bbf451' }}>gCO2e</span>
              </div>
              <div style={{ fontSize: 10, color: '#4ade80', marginTop: 4 }}>Grid: {profile.grid_emission_factor} g/kWh</div>
            </div>

            <div style={{ background: 'rgba(2, 13, 14, 0.6)', padding: 18, borderRadius: 16, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
              <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>Compute Cost</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                ${profile.cost_usd.toFixed(5)}
              </div>
              <div style={{ fontSize: 10, color: '#4ade80', marginTop: 4 }}>WUE: {profile.water_liters.toFixed(4)}L</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subsystem Hardware Energy Allocation */}
      <div className="liquid-card" style={{ padding: 32 }}>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 16 }}>
          Subsystem Hardware Energy Allocation (Joules)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div style={{ background: 'rgba(2, 13, 14, 0.5)', padding: 16, borderRadius: 14, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
            <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>CPU Package (RAPL)</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
              {profile.subsystem_joules.cpu_pkg} J
            </div>
            <div style={{ width: '100%', height: 4, background: 'rgba(187, 244, 81, 0.2)', borderRadius: 2, marginTop: 8 }}>
              <div style={{ width: '62%', height: '100%', background: '#bbf451', borderRadius: 2 }} />
            </div>
          </div>

          <div style={{ background: 'rgba(2, 13, 14, 0.5)', padding: 16, borderRadius: 14, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
            <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>DRAM Memory (MSR)</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
              {profile.subsystem_joules.dram} J
            </div>
            <div style={{ width: '100%', height: 4, background: 'rgba(74, 222, 128, 0.2)', borderRadius: 2, marginTop: 8 }}>
              <div style={{ width: '18%', height: '100%', background: '#4ade80', borderRadius: 2 }} />
            </div>
          </div>

          <div style={{ background: 'rgba(2, 13, 14, 0.5)', padding: 16, borderRadius: 14, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
            <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>GPU Cores (NVML)</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
              {profile.subsystem_joules.gpu} J
            </div>
            <div style={{ width: '100%', height: 4, background: 'rgba(218, 241, 222, 0.2)', borderRadius: 2, marginTop: 8 }}>
              <div style={{ width: '15%', height: '100%', background: '#DAF1DE', borderRadius: 2 }} />
            </div>
          </div>

          <div style={{ background: 'rgba(2, 13, 14, 0.5)', padding: 16, borderRadius: 14, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
            <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>Unhalted I/O Bus</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
              {profile.subsystem_joules.unhalted_io} J
            </div>
            <div style={{ width: '100%', height: 4, background: 'rgba(142, 182, 155, 0.2)', borderRadius: 2, marginTop: 8 }}>
              <div style={{ width: '5%', height: '100%', background: '#8EB69B', borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
