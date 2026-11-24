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
  showcase: { title: '1. Overview', subtitle: 'How AETHEL Protects Servers & Cuts Bills', icon: <Sparkles size={16} /> },
  cockpit: { title: '2. Live Test', subtitle: 'Real Memory Savings Test & Cloud Traffic Replay', icon: <Cpu size={16} /> },
  gainshare: { title: '3. Savings Calculator', subtitle: 'Calculate Exact Cash & Carbon Saved on AWS, Azure & GCP', icon: <Zap size={16} /> },
  overview: { title: '4. Diagnostics & Global ESG', subtitle: 'Global GHG Protocol Scope 2 & Multi-Region Telemetry', icon: <Layers size={16} /> },
  thermal: { title: 'ThermalOps Co-Scheduler', subtitle: 'Silicon Thermal Equilibrium & Resilience Bunker', icon: <Flame size={16} /> },
  telemetry: { title: 'Kernel Telemetry', subtitle: 'RAPL & NVML Power Oscilloscope', icon: <Activity size={16} /> },
  boavizta: { title: 'Boavizta SCI Engine', subtitle: 'Hardware Embodied & Operational Carbon', icon: <Cpu size={16} /> },
  governance: { title: 'Global ESG & ISO 21031', subtitle: 'Statutory Emissions & SCI Compliance', icon: <ShieldCheck size={16} /> },
  sandbox: { title: 'CI/CD Developer Sandbox', subtitle: 'GitHub Actions & AST Energy Linter', icon: <Terminal size={16} /> },
  marketplace: { title: 'Cloud Marketplace', subtitle: 'AWS, GCP, Azure & Helm Deployments', icon: <Store size={16} /> },
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCluster,
  setSelectedCluster,
  onTriggerAudit,
  backendOnline
}) => {
  const current = tabMeta[activeTab] || tabMeta.showcase;

  return (
    <>
      {/* 1. DESKTOP NAVBAR (>= 1024px) */}
      <header className="app-top-navbar navbar-desktop" style={{
        position: 'sticky',
        top: 16,
        zIndex: 100,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 22px',
        background: 'rgba(5, 31, 32, 0.85)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderRadius: 9999,
        border: '1px solid rgba(142, 182, 155, 0.25)',
        boxShadow: '0 16px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(218, 241, 222, 0.25)',
        marginBottom: 32,
        gap: 12
      }}>
        {/* Left: Current Active Step Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 999,
            background: 'rgba(187, 244, 81, 0.12)',
            border: '1px solid rgba(187, 244, 81, 0.35)',
            color: '#bbf451'
          }}>
            {current.icon}
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5 }}>{current.title.toUpperCase()}</span>
          </div>
        </div>

        {/* Center: 3-Step App Flow Switcher */}
        <div className="navbar-step-switcher" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(2, 13, 14, 0.7)',
          padding: '4px 6px',
          borderRadius: 999,
          border: '1px solid rgba(142, 182, 155, 0.25)'
        }}>
          <button
            onClick={() => setActiveTab('showcase')}
            style={{
              background: activeTab === 'showcase' ? '#bbf451' : 'transparent',
              color: activeTab === 'showcase' ? '#051f20' : '#DAF1DE',
              fontWeight: activeTab === 'showcase' ? 800 : 600,
              fontSize: 12,
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Sparkles size={13} />
            <span>1. Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('cockpit')}
            style={{
              background: activeTab === 'cockpit' ? '#bbf451' : 'transparent',
              color: activeTab === 'cockpit' ? '#051f20' : '#DAF1DE',
              fontWeight: activeTab === 'cockpit' ? 800 : 600,
              fontSize: 12,
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Cpu size={13} />
            <span>2. Live Test</span>
          </button>

          <button
            onClick={() => setActiveTab('gainshare')}
            style={{
              background: activeTab === 'gainshare' ? '#bbf451' : 'transparent',
              color: activeTab === 'gainshare' ? '#051f20' : '#DAF1DE',
              fontWeight: activeTab === 'gainshare' ? 800 : 600,
              fontSize: 12,
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Zap size={13} />
            <span>3. Savings</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            style={{
              background: activeTab === 'overview' ? '#bbf451' : 'transparent',
              color: activeTab === 'overview' ? '#051f20' : '#DAF1DE',
              fontWeight: activeTab === 'overview' ? 800 : 600,
              fontSize: 12,
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Layers size={13} />
            <span>4. Diagnostics</span>
          </button>
        </div>

        {/* Right: Cluster Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(2, 13, 14, 0.6)',
            padding: '6px 14px',
            borderRadius: 999,
            border: '1px solid rgba(142, 182, 155, 0.25)'
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
        </div>
      </header>
    </>
  );
};
