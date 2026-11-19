import React from 'react';
import { 
  ArrowRight,
  Server,
  Layers,
  Activity,
  Cpu,
  ShieldCheck,
  Zap,
  Terminal,
  Store,
  Flame,
  Sparkles,
  Sliders
} from 'lucide-react';

export type TabType = 
  | 'showcase'
  | 'cockpit'
  | 'overview' 
  | 'thermal'
  | 'telemetry' 
  | 'boavizta' 
  | 'governance' 
  | 'gainshare' 
  | 'sandbox' 
  | 'marketplace';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedCluster: string;
  setSelectedCluster: (cluster: string) => void;
  onTriggerAudit: () => void;
  backendOnline: boolean;
}

const tabMeta: Record<TabType, { title: string; subtitle: string; icon: React.ReactNode }> = {
  showcase: { title: 'Executive Showcase', subtitle: 'Ground-Truth Comparative Impact (Without vs. With AETHEL)', icon: <Sparkles size={16} /> },
  cockpit: { title: 'Silicon Engine & Datacenter Traces', subtitle: 'Host PyTorch INT8 Benchmark & Alibaba PAI Trace Replay', icon: <Cpu size={16} /> },
  overview: { title: 'Executive Cockpit', subtitle: 'Platform Overview & Health', icon: <Layers size={16} /> },
  thermal: { title: 'ThermalOps Co-Scheduler', subtitle: 'Silicon Thermal Equilibrium & Resilience Bunker', icon: <Flame size={16} /> },
  telemetry: { title: 'Kernel Telemetry', subtitle: 'RAPL & NVML Power Oscilloscope', icon: <Activity size={16} /> },
  boavizta: { title: 'Boavizta SCI Engine', subtitle: 'Hardware Embodied & Operational Carbon', icon: <Cpu size={16} /> },
  governance: { title: 'SEBI BRSR Principle 6', subtitle: 'Statutory ESG Regulatory Compliance', icon: <ShieldCheck size={16} /> },
  gainshare: { title: 'Gain-Share FinOps', subtitle: '15-20% Risk-Free Cloud Savings Ledger', icon: <Zap size={16} /> },
  sandbox: { title: 'CI/CD Developer Sandbox', subtitle: 'GitHub Actions & AST Energy Linter', icon: <Terminal size={16} /> },
  marketplace: { title: 'Cloud Marketplace', subtitle: 'AWS, GCP, Azure & Helm Deployments', icon: <Store size={16} /> },
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  selectedCluster,
  setSelectedCluster,
  onTriggerAudit,
  backendOnline
}) => {
  const current = tabMeta[activeTab] || tabMeta.overview;

  return (
    <header style={{
      position: 'sticky',
      top: 16,
      zIndex: 100,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 26px',
      background: 'rgba(5, 31, 32, 0.75)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      borderRadius: 9999,
      border: '1px solid rgba(142, 182, 155, 0.22)',
      boxShadow: '0 16px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(218, 241, 222, 0.25)',
      marginBottom: 36
    }}>
      {/* Current Active Module Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 999,
          background: 'rgba(187, 244, 81, 0.12)',
          border: '1px solid rgba(187, 244, 81, 0.3)',
          color: '#bbf451'
        }}>
          {current.icon}
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>{current.title.toUpperCase()}</span>
        </div>

        <span style={{ fontSize: 13, color: 'var(--c-sage)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>•</span>
          <span>{current.subtitle}</span>
        </span>
      </div>

      {/* Cluster Selector, Backend Status & Quick Audit Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Backend Connectivity Status */}
        <div 
          title={backendOnline ? "Connected to Python FastAPI Backend (Port 8000)" : "Running Autonomous In-Memory Engine"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            color: 'var(--c-sage)',
            background: 'rgba(2, 13, 14, 0.5)',
            padding: '6px 12px',
            borderRadius: 999,
            border: '1px solid rgba(142, 182, 155, 0.2)'
          }}
        >
          <div style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: backendOnline ? '#4ade80' : '#bbf451',
            boxShadow: `0 0 8px ${backendOnline ? '#4ade80' : '#bbf451'}`
          }} />
          <span style={{ fontSize: 11, fontWeight: 700 }}>
            {backendOnline ? 'BACKEND LIVE' : 'AUTONOMOUS'}
          </span>
        </div>

        {/* Cluster Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(2, 13, 14, 0.5)',
          padding: '6px 12px',
          borderRadius: 999,
          border: '1px solid rgba(142, 182, 155, 0.2)'
        }}>
          <Server size={12} color="#bbf451" />
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#DAF1DE',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="mumbai" style={{ background: '#0B2B26', color: '#FFF' }}>ap-south-1 (Mumbai)</option>
            <option value="frankfurt" style={{ background: '#0B2B26', color: '#FFF' }}>eu-central-1 (Frankfurt)</option>
            <option value="oregon" style={{ background: '#0B2B26', color: '#FFF' }}>us-west-2 (Oregon)</option>
            <option value="virginia" style={{ background: '#0B2B26', color: '#FFF' }}>us-east-1 (N. Virginia)</option>
          </select>
        </div>

        {/* Live Audit Action */}
        <button
          className="neon-pill-btn"
          onClick={onTriggerAudit}
          style={{ padding: '8px 18px', fontSize: 12 }}
        >
          <span>Run Live Audit</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </header>
  );
};
