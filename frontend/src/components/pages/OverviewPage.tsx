import React, { useState } from 'react';
import { 
  Leaf, 
  ArrowRight, 
  Terminal, 
  ChevronRight, 
  TrendingDown, 
  ShieldCheck, 
  Zap, 
  Database, 
  Cloud, 
  Code2, 
  CheckCircle2, 
  Clock, 
  Server,
  Sparkles,
  Layers,
  Flame,
  Activity,
  Award,
  Globe,
  Sliders
} from 'lucide-react';
import { TabType } from '../Navbar';

interface OverviewPageProps {
  onTriggerAudit: () => void;
  setActiveTab: (tab: TabType) => void;
  surgeActive: boolean;
  selectedCluster: string;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onTriggerAudit,
  setActiveTab,
  surgeActive,
  selectedCluster
}) => {
  const [comparisonMode, setComparisonMode] = useState<'both' | 'without' | 'with'>('both');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
      {/* 1. HERO SECTION */}
      <section style={{ textAlign: 'center', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        {/* Global Standard Announcement Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 18px',
          borderRadius: 9999,
          background: 'rgba(22, 56, 50, 0.65)',
          border: '1px solid rgba(187, 244, 81, 0.35)',
          marginBottom: 20,
          fontSize: 12,
          color: 'var(--c-mint-light)'
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#bbf451', boxShadow: '0 0 10px #bbf451' }} />
          <strong style={{ color: '#bbf451' }}>Global ESG & Carbon Compliance</strong>
          <span>GHG Protocol Scope 2 & ISO/IEC 21031 Certified</span>
          <Globe size={14} color="#bbf451" />
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 54px)',
          lineHeight: 1.15,
          fontWeight: 800,
          letterSpacing: -1.2,
          color: '#FFFFFF',
          marginBottom: 16
        }}>
          System Diagnostics &{' '}
          <span style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontStyle: 'italic', 
            fontWeight: 500,
            background: 'linear-gradient(135deg, #DAF1DE 0%, #bbf451 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Global Carbon
          </span>{' '}
          Audit
        </h1>

        <p style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: 'var(--c-sage)',
          maxWidth: 720,
          margin: '0 auto 20px auto'
        }}>
          Continuous hardware telemetry, multi-region grid intensity tracking, and statutory ESG emissions reporting across worldwide enterprise clusters.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', fontSize: 12, color: 'var(--c-sage)' }}>
          <span>✓ Zero Hardware Required</span>
          <span>✓ GHG Protocol Corporate Standard</span>
          <span>✓ ISO/IEC 21031 (GSF SCI) Compliant</span>
          <span>✓ 100% Risk-Free Gain-Share</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WITH AETHEL VS WITHOUT AETHEL INTERACTIVE BENCHMARK LEDGER */}
      {/* ========================================================================= */}
      <section className="liquid-card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#bbf451' }}>
              HEAD-TO-HEAD CLUSTER IMPACT
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
              Without AETHEL vs. With AETHEL
            </h2>
          </div>

          {/* Toggle View Buttons */}
          <div style={{ display: 'flex', background: 'rgba(2, 13, 14, 0.7)', padding: 4, borderRadius: 10, border: '1px solid rgba(142, 182, 155, 0.25)' }}>
            {(['both', 'without', 'with'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setComparisonMode(mode)}
                style={{
                  background: comparisonMode === mode ? '#bbf451' : 'transparent',
                  color: comparisonMode === mode ? '#051f20' : 'var(--c-sage)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {mode === 'both' ? 'Side-by-Side' : `${mode} AETHEL`}
              </button>
            ))}
          </div>
        </div>

        <div className={comparisonMode === 'both' ? 'grid-split' : ''} style={{
          display: 'grid',
          gap: 20
        }}>
          {/* A. WITHOUT AETHEL */}
          {(comparisonMode === 'both' || comparisonMode === 'without') && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 18,
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fca5a5', letterSpacing: 1 }}>
                  LEGACY UNMANAGED CLUSTER
                </span>
                <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 800, background: 'rgba(239, 68, 68, 0.18)', padding: '2px 8px', borderRadius: 999 }}>
                  HIGH WASTE & EMISSIONS
                </span>
              </div>

              <div style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF' }}>
                $48,500 <span style={{ fontSize: 13, color: 'var(--c-sage)', fontWeight: 500 }}>/ month spend</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(239, 68, 68, 0.15)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--c-sage)' }}>Datacenter PUE (Cooling):</span>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>1.58 (Heavy AC waste)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(239, 68, 68, 0.15)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--c-sage)' }}>GPU Thermal Performance:</span>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>Chokes at 82°C (-35% clock loss)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(239, 68, 68, 0.15)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--c-sage)' }}>Model Parameter Routing:</span>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>100% routed to 70B ($1.80/M tokens)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(239, 68, 68, 0.15)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--c-sage)' }}>Daily Scope 2 Carbon:</span>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>1,420 kg CO2e / day</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--c-sage)' }}>Software Subscriptions:</span>
                  <span style={{ color: 'var(--c-sage)' }}>4 Separate Vendor Licenses</span>
                </div>
              </div>
            </div>
          )}

          {/* B. WITH AETHEL */}
          {(comparisonMode === 'both' || comparisonMode === 'with') && (
            <div style={{
              background: 'rgba(187, 244, 81, 0.08)',
              border: '1px solid rgba(187, 244, 81, 0.45)',
              borderRadius: 18,
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#bbf451', letterSpacing: 1 }}>
                  AETHEL AUTONOMOUS SOVEREIGN OS
                </span>
                <span style={{ fontSize: 11, color: '#051f20', fontWeight: 800, background: '#bbf451', padding: '2px 8px', borderRadius: 999 }}>
                  -43.5% CASH SAVED
                </span>
              </div>

              <div style={{ fontSize: 26, fontWeight: 800, color: '#bbf451' }}>
                $27,400 <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 500 }}>/ month spend (Saved $21,100/mo)</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(187, 244, 81, 0.2)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--c-sage)' }}>Datacenter PUE (Cooling):</span>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>1.18 (Autonomous Thermal Co-Sched)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(187, 244, 81, 0.2)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--c-sage)' }}>GPU Thermal Performance:</span>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>Stabilized at 62°C (0% clock loss)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(187, 244, 81, 0.2)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--c-sage)' }}>Model Parameter Routing:</span>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>Autonomous 8B/14B/70B Router</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(187, 244, 81, 0.2)', paddingBottom: 6 }}>
                  <span style={{ color: 'var(--c-sage)' }}>Daily Scope 2 Carbon:</span>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>860 kg CO2e / day (-39.4% cut)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--c-sage)' }}>Software Subscriptions:</span>
                  <span style={{ color: '#bbf451', fontWeight: 700 }}>1 Sovereign Kernel ($0 Upfront)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. EXECUTIVE MASTER KPIS */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
        gap: 20,
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%'
      }}>
        <div className="liquid-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#bbf451' }}>
              NET CASH SAVED
            </span>
            <div style={{ padding: 8, borderRadius: 10, background: 'rgba(187, 244, 81, 0.1)' }}>
              <TrendingDown size={18} color="#bbf451" />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 12 }}>
            $40,901
          </div>
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 4 }}>
            ↑ 36% Net Efficiency / yr
          </div>
        </div>

        <div className="liquid-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#4ade80' }}>
              ENERGY CONSERVED
            </span>
            <div style={{ padding: 8, borderRadius: 10, background: 'rgba(74, 222, 128, 0.1)' }}>
              <Zap size={18} color="#4ade80" />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 12 }}>
            310 MWh
          </div>
          <div style={{ fontSize: 12, color: 'var(--c-sage)', marginTop: 4 }}>
            1,116 GJ primary power avoided
          </div>
        </div>

        <div className="liquid-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#38bdf8' }}>
              CARBON AVOIDED
            </span>
            <div style={{ padding: 8, borderRadius: 10, background: 'rgba(56, 189, 248, 0.1)' }}>
              <Leaf size={18} color="#38bdf8" />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 12 }}>
            221 MT
          </div>
          <div style={{ fontSize: 12, color: '#38bdf8', marginTop: 4 }}>
            GHG Protocol Scope 2 Certified
          </div>
        </div>

        <div className="liquid-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#f59e0b' }}>
              WATER CONSERVED
            </span>
            <div style={{ padding: 8, borderRadius: 10, background: 'rgba(245, 158, 11, 0.1)' }}>
              <Cloud size={18} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 12 }}>
            558 kL
          </div>
          <div style={{ fontSize: 12, color: 'var(--c-sage)', marginTop: 4 }}>
            Evaporative cooling water saved
          </div>
        </div>
      </section>

      {/* 4. GLOBAL MULTI-REGION CLUSTERS & AUDIT STREAM */}
      <section className="grid-split" style={{ maxWidth: 1280, margin: '0 auto', width: '100%', alignItems: 'start' }}>
        {/* Active Node Telemetry */}
        <div className="liquid-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#bbf451' }}>
                HYPERSCALE MESH
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                Global Multi-Region Grid Alignment
              </h3>
            </div>
            <span style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(74, 222, 128, 0.15)',
              color: '#4ade80',
              border: '1px solid rgba(74, 222, 128, 0.3)'
            }}>
              4 CLUSTERS ONLINE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { id: 'oregon', name: 'AWS us-west-2 (Oregon)', intensity: '180 gCO2e/kWh', nodes: 92, cut: '46.7%', pue: 1.12 },
              { id: 'frankfurt', name: 'AWS eu-central-1 (Frankfurt)', intensity: '320 gCO2e/kWh', nodes: 48, cut: '42.1%', pue: 1.18 },
              { id: 'virginia', name: 'AWS us-east-1 (N. Virginia)', intensity: '379 gCO2e/kWh', nodes: 120, cut: '35.2%', pue: 1.20 },
              { id: 'mumbai', name: 'AWS ap-south-1 (Mumbai)', intensity: '716 gCO2e/kWh', nodes: 64, cut: '38.4%', pue: 1.28 }
            ].map(c => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  borderRadius: 14,
                  background: 'rgba(2, 13, 14, 0.75)',
                  border: '1px solid rgba(142, 182, 155, 0.2)'
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 2 }}>
                    Grid: {c.intensity} • PUE: {c.pue}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#bbf451' }}>↓ {c.cut}</div>
                  <div style={{ fontSize: 10, color: 'var(--c-sage)' }}>{c.nodes} Active GPUs</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Event Audit Log */}
        <div className="liquid-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#bbf451' }}>
                AUTONOMOUS LEDGER
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                Real-Time Event Audit Stream
              </h3>
            </div>
            <span style={{ fontSize: 11, color: 'var(--c-sage)' }}>LIVE MONITOR</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { time: 'Just now', title: 'Quality Gate Verified', desc: 'INT8 Dynamic Quantization locked (Cosine Sim: 0.99954)' },
              { time: '4m ago', title: 'Semantic Model Routed', desc: 'Ticket classification prompt dispatched to 8B Tier (-88% power)' },
              { time: '12m ago', title: 'Thermal Surge Neutralized', desc: 'Capped GPU power at 274W on rack 14; 0% clock drop' },
              { time: '28m ago', title: 'Prefix Cache Reused', desc: 'Shared system prompt hash hit: 480 prefill tokens saved' },
              { time: '1h ago', title: 'Global ESG Report Exported', desc: 'GHG Protocol Scope 2 certificate signed for board review' }
            ].map((e, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: 12,
                  borderRadius: 12,
                  background: 'rgba(2, 13, 14, 0.6)',
                  border: '1px solid rgba(35, 83, 71, 0.4)'
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: idx === 0 ? '#bbf451' : 'var(--c-sage)',
                  marginTop: 6,
                  boxShadow: idx === 0 ? '0 0 8px #bbf451' : 'none'
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>{e.title}</span>
                    <span style={{ fontSize: 10, color: 'var(--c-sage)' }}>{e.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 2 }}>{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TOUR RESTART */}
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <button
          onClick={() => setActiveTab('showcase')}
          className="neon-pill-btn"
          style={{
            padding: '14px 28px',
            fontSize: 14,
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <span>Return to Step 1: Executive Overview</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
