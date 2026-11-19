import React from 'react';
import { 
  Leaf, 
  Layers, 
  Flame,
  Activity, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Store 
} from 'lucide-react';
import { TabType } from './Navbar';

interface SidebarDockProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const SidebarDock: React.FC<SidebarDockProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Layers size={20} /> },
    { id: 'thermal', label: 'ThermalOps', icon: <Flame size={20} /> },
    { id: 'telemetry', label: 'Kernel Telemetry', icon: <Activity size={20} /> },
    { id: 'boavizta', label: 'Boavizta SCI', icon: <Cpu size={20} /> },
    { id: 'governance', label: 'SEBI BRSR', icon: <ShieldCheck size={20} /> },
    { id: 'gainshare', label: 'Gain-Share', icon: <Zap size={20} /> },
    { id: 'sandbox', label: 'CI/CD Sandbox', icon: <Terminal size={20} /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Store size={20} /> },
  ];

  return (
    <aside style={{
      position: 'fixed',
      left: 24,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }}>
      {/* Brand Top Emblem */}
      <div 
        onClick={() => setActiveTab('overview')}
        title="AETHEL Autonomous GreenOps"
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(35, 83, 71, 0.95), rgba(11, 43, 38, 0.98))',
          border: '1px solid rgba(187, 244, 81, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(187, 244, 81, 0.3)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <Leaf size={24} color="#bbf451" />
      </div>

      {/* Floating Vertical Capsule Pill (Modeled after reference image with AETHEL aesthetic) */}
      <nav style={{
        background: 'rgba(5, 31, 32, 0.82)',
        backdropFilter: 'blur(30px) saturate(190%)',
        WebkitBackdropFilter: 'blur(30px) saturate(190%)',
        border: '1px solid rgba(142, 182, 155, 0.28)',
        borderRadius: 9999,
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(218, 241, 222, 0.25)'
      }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="dock-item"
              aria-label={item.label}
              style={{
                position: 'relative',
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive 
                  ? 'linear-gradient(135deg, #bbf451 0%, #84cc16 100%)' 
                  : 'transparent',
                color: isActive ? '#020D0E' : 'var(--c-sage)',
                boxShadow: isActive ? '0 0 22px rgba(187, 244, 81, 0.65)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.25s ease'
              }}>
                {item.icon}
              </div>

              {/* Tooltip on right */}
              <span className="dock-tooltip">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Live System Beacon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'rgba(11, 43, 38, 0.6)',
        border: '1px solid rgba(187, 244, 81, 0.3)'
      }}>
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#bbf451',
          boxShadow: '0 0 10px #bbf451'
        }} />
      </div>
    </aside>
  );
};
