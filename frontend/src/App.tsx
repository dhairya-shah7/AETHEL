import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar, TabType } from './components/Navbar';
import { SidebarDock } from './components/SidebarDock';
import { VideoBackground } from './components/VideoBackground';
import { OverviewPage } from './components/pages/OverviewPage';
import { ThermalOpsPage } from './components/pages/ThermalOpsPage';
import { TelemetryPage } from './components/pages/TelemetryPage';
import { BoaviztaPage } from './components/pages/BoaviztaPage';
import { GovernancePage } from './components/pages/GovernancePage';
import { GainSharePage } from './components/pages/GainSharePage';
import { SandboxPage } from './components/pages/SandboxPage';
import { MarketplacePage } from './components/pages/MarketplacePage';
import { checkBackendHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedCluster, setSelectedCluster] = useState<string>('mumbai');
  const [surgeActive, setSurgeActive] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    checkBackendHealth().then(setBackendOnline);
    const interval = setInterval(() => {
      checkBackendHealth().then(setBackendOnline);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const triggerAuditConfetti = () => {
    setSurgeActive(true);
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#bbf451', '#4ade80', '#DAF1DE', '#163832']
    });
    setTimeout(() => setSurgeActive(false), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex' }}>
      {/* 1. CINEMATIC SLOWED NIGHT CLOUD-FOREST DATACENTER VIDEO BACKGROUND */}
      <VideoBackground surgeActive={surgeActive} />

      {/* 2. FLOATING LEFT CAPSULE DOCK (Modeled precisely after reference pill with AETHEL aesthetic) */}
      <SidebarDock activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 3. MAIN CONTENT VIEWPORT */}
      <div style={{
        marginLeft: 96,
        width: 'calc(100% - 116px)',
        padding: '0 24px 80px 10px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* TOP STATUS, CLUSTER & AUDIT ACTION BAR */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCluster={selectedCluster}
          setSelectedCluster={setSelectedCluster}
          onTriggerAudit={triggerAuditConfetti}
          backendOnline={backendOnline}
        />

        {/* DYNAMIC ACTIVE MODULE VIEWPORT (Single-Page App Flow) */}
        <main style={{ maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
          {activeTab === 'overview' && (
            <OverviewPage
              onTriggerAudit={triggerAuditConfetti}
              setActiveTab={setActiveTab}
              surgeActive={surgeActive}
              selectedCluster={selectedCluster}
            />
          )}

          {activeTab === 'thermal' && <ThermalOpsPage />}

          {activeTab === 'telemetry' && <TelemetryPage />}

          {activeTab === 'boavizta' && <BoaviztaPage />}

          {activeTab === 'governance' && <GovernancePage />}

          {activeTab === 'gainshare' && <GainSharePage />}

          {activeTab === 'sandbox' && <SandboxPage />}

          {activeTab === 'marketplace' && <MarketplacePage />}
        </main>

        {/* CLEAN ENTERPRISE FOOTER */}
        <footer style={{
          maxWidth: 1280,
          margin: '60px auto 0 auto',
          paddingTop: 24,
          borderTop: '1px solid rgba(35, 83, 71, 0.4)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>
            © 2026 AETHEL GreenOps Inc. All rights reserved. Certified SEBI BRSR Principal 6 & Green Software Foundation SCI Compliant.
          </div>
        </footer>
      </div>
    </div>
  );
}
