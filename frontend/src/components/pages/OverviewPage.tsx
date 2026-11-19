import React from 'react';
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
  Sparkles
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
      {/* 1. HERO SECTION */}
      <section style={{ textAlign: 'center', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        {/* Announcement Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 18px',
          borderRadius: 9999,
          background: 'rgba(22, 56, 50, 0.65)',
          border: '1px solid rgba(187, 244, 81, 0.35)',
          marginBottom: 24,
          fontSize: 12,
          color: 'var(--c-mint-light)'
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#bbf451', boxShadow: '0 0 10px #bbf451' }} />
          <strong style={{ color: '#bbf451' }}>AETHEL Green Cloud AI</strong>
          <span>The Smart Power Meter & Bill Cutter for Cloud Software</span>
          <ChevronRight size={14} color="var(--c-sage)" />
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 64,
          lineHeight: 1.1,
          fontWeight: 800,
          letterSpacing: -1.8,
          color: '#FFFFFF',
          marginBottom: 20
        }}>
          Intelligence that{' '}
          <span style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontStyle: 'italic', 
            fontWeight: 500,
            background: 'linear-gradient(135deg, #DAF1DE 0%, #bbf451 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            heals
          </span>{' '}
          the cloud.
        </h1>

        <p style={{
          fontSize: 17,
          lineHeight: 1.6,
          color: 'var(--c-sage)',
          maxWidth: 680,
          margin: '0 auto 34px auto'
        }}>
          Cut your enterprise cloud bills by 30% to 50% while automatically fulfilling government carbon compliance. AETHEL detects wasted server power, cleans up heavy code, and provides official SEBI green audits with zero upfront cost.
        </p>

        {/* Hero CTA Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="neon-pill-btn" onClick={onTriggerAudit}>
            <Zap size={16} />
            <span>Start Live Energy Audit</span>
            <ArrowRight size={16} />
          </button>
          <button 
            className="glass-outline-btn" 
            onClick={() => setActiveTab('sandbox')}
          >
            <Terminal size={15} color="#bbf451" />
            <span>Launch CI/CD Profiler</span>
          </button>
          <button 
            className="glass-outline-btn" 
            onClick={() => setActiveTab('governance')}
          >
            <ShieldCheck size={15} color="#bbf451" />
            <span>Generate BRSR Audit</span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24, fontSize: 12, color: 'var(--c-sage)' }}>
          <span>✓ Zero Hardware Required</span>
          <span>✓ CEA India & GSF SCI Compliant</span>
          <span>✓ 15% Gain-Share Risk Free</span>
        </div>
      </section>

      {/* 2. EXECUTIVE MASTER KPIS */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%'
      }}>
        <div className="liquid-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)' }}>Cloud Dollars Saved</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(187, 244, 81, 0.15)' }}>
              <Zap size={16} color="#bbf451" />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>$40,901</div>
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>↑ 36% Net Efficiency</span>
            <span style={{ color: 'var(--c-sage)' }}>/ yr run-rate</span>
          </div>
        </div>

        <div className="liquid-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)' }}>Clean Energy Conserved</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(74, 222, 128, 0.15)' }}>
              <Leaf size={16} color="#4ade80" />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>310 MWh</div>
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 8 }}>
            <span>Equivalent to 1.116 GJ avoided</span>
          </div>
        </div>

        <div className="liquid-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)' }}>Avoided Carbon Footprint</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(187, 244, 81, 0.15)' }}>
              <TrendingDown size={16} color="#bbf451" />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>221.9 <span style={{ fontSize: 16, color: '#bbf451' }}>tCO2e</span></div>
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 8 }}>
            <span>-36% Scope 2 Grid Emissions</span>
          </div>
        </div>

        <div className="liquid-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)' }}>Datacenter Water Saved</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(218, 241, 222, 0.15)' }}>
              <ShieldCheck size={16} color="#DAF1DE" />
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}>558,000 <span style={{ fontSize: 16 }}>Liters</span></div>
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 8 }}>
            <span>WUE 1.8 L/kWh Saved</span>
          </div>
        </div>
      </section>

      {/* 3. HOW AETHEL WORKS IN 3 SIMPLE STEPS */}
      <section style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
            HOW IT WORKS
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
            Simple, Human-Friendly Cloud Optimization
          </h2>
          <p style={{ fontSize: 14, color: 'var(--c-sage)', marginTop: 8 }}>
            No complex setup. Zero downtime. 100% auditable cloud savings.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <div className="liquid-card" style={{ padding: 28 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(187, 244, 81, 0.15)',
              color: '#bbf451',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              marginBottom: 16
            }}>1</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
              1. Plug In with 1 Line
            </h4>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--c-sage)' }}>
              Add AETHEL to your cloud (AWS/GCP/Azure) or GitHub in 2 minutes. Requires zero hardware and never interrupts running production workloads.
            </p>
          </div>

          <div className="liquid-card" style={{ padding: 28 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(74, 222, 128, 0.15)',
              color: '#4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              marginBottom: 16
            }}>2</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
              2. AI Trims Compute Waste
            </h4>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--c-sage)' }}>
              Our engine identifies idle servers, unoptimized database queries, and memory leaks, automatically scaling down waste in real time.
            </p>
          </div>

          <div className="liquid-card" style={{ padding: 28 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(187, 244, 81, 0.15)',
              color: '#bbf451',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              marginBottom: 16
            }}>3</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
              3. Save Cash & Comply
            </h4>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--c-sage)' }}>
              Watch your monthly cloud invoice drop by 30–50%. Export certified government SEBI green reports for your board with one click.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE 4 PILLARS OF AETHEL ARCHITECTURE */}
      <section style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
            COMPLETE GREENOPS INFRASTRUCTURE
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
            The 4-Pillar Autonomous Engine
          </h2>
          <p style={{ fontSize: 14, color: 'var(--c-sage)', marginTop: 8 }}>
            From microsecond kernel power registers to board-level SEBI ESG filings and gain-share invoicing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {/* Pillar 1 */}
          <div 
            className="liquid-card" 
            onClick={() => setActiveTab('telemetry')}
            style={{ padding: 28, cursor: 'pointer' }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(35, 83, 71, 0.4)',
              border: '1px solid rgba(187, 244, 81, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <Terminal size={20} color="#bbf451" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#bbf451', marginBottom: 4 }}>PILLAR 1</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
              Live Software Power Meter
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--c-sage)', marginBottom: 20 }}>
              Measures the exact electricity (Watts & Joules) drawn by your cloud servers and code. No theoretical estimates—pure live telemetry.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#bbf451', fontWeight: 600 }}>
              <span>Open Power Meter</span> <ArrowRight size={13} />
            </div>
          </div>

          {/* Pillar 2 */}
          <div 
            className="liquid-card" 
            onClick={() => setActiveTab('gainshare')}
            style={{ padding: 28, cursor: 'pointer' }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(35, 83, 71, 0.4)',
              border: '1px solid rgba(187, 244, 81, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <Zap size={20} color="#bbf451" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#bbf451', marginBottom: 4 }}>PILLAR 2</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
              Zero-Risk Gain-Share Pricing
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--c-sage)', marginBottom: 20 }}>
              Pay ₹0 upfront. We only collect a 20% success fee on the money we actually cut from your AWS, GCP, or Azure invoices.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#bbf451', fontWeight: 600 }}>
              <span>View Savings Calculator</span> <ArrowRight size={13} />
            </div>
          </div>

          {/* Pillar 3 */}
          <div 
            className="liquid-card" 
            onClick={() => setActiveTab('governance')}
            style={{ padding: 28, cursor: 'pointer' }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(35, 83, 71, 0.4)',
              border: '1px solid rgba(187, 244, 81, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <ShieldCheck size={20} color="#bbf451" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#bbf451', marginBottom: 4 }}>PILLAR 3</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
              1-Click SEBI Carbon Audit
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--c-sage)', marginBottom: 20 }}>
              Generates official government-certified ESG compliance reports required by SEBI and your board with a single click.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#bbf451', fontWeight: 600 }}>
              <span>Export Carbon Audit</span> <ArrowRight size={13} />
            </div>
          </div>

          {/* Pillar 4 */}
          <div 
            className="liquid-card" 
            onClick={() => setActiveTab('marketplace')}
            style={{ padding: 28, cursor: 'pointer' }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(35, 83, 71, 0.4)',
              border: '1px solid rgba(187, 244, 81, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <Cloud size={20} color="#bbf451" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#bbf451', marginBottom: 4 }}>PILLAR 4</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
              1-Click Cloud Marketplace
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--c-sage)', marginBottom: 20 }}>
              Install directly from AWS, Azure, or Google Cloud marketplace with unified billing and zero vendor procurement friction.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#bbf451', fontWeight: 600 }}>
              <span>Explore Marketplace</span> <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE REGIONAL CLUSTERS & RECENT EVENTS */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: 24,
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Active Node Telemetry */}
        <div className="liquid-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#bbf451' }}>
                HYPERSCALE MESH
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { id: 'mumbai', name: 'ap-south-1 (Mumbai)', intensity: '716 gCO2e/kWh', nodes: 64, cut: '38.4%', active: selectedCluster === 'mumbai' },
              { id: 'frankfurt', name: 'eu-central-1 (Frankfurt)', intensity: '320 gCO2e/kWh', nodes: 48, cut: '42.1%', active: selectedCluster === 'frankfurt' },
              { id: 'oregon', name: 'us-west-2 (Oregon)', intensity: '180 gCO2e/kWh', nodes: 92, cut: '39.7%', active: selectedCluster === 'oregon' },
              { id: 'virginia', name: 'us-east-1 (N. Virginia)', intensity: '379 gCO2e/kWh', nodes: 120, cut: '35.2%', active: selectedCluster === 'virginia' },
            ].map(c => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderRadius: 16,
                  background: c.active ? 'rgba(35, 83, 71, 0.4)' : 'rgba(2, 13, 14, 0.5)',
                  border: c.active ? '1px solid rgba(187, 244, 81, 0.4)' : '1px solid rgba(35, 83, 71, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Server size={16} color={c.active ? '#bbf451' : 'var(--c-sage)'} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>{c.intensity} • {c.nodes} active nodes</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#bbf451' }}>↓ {c.cut}</div>
                  <div style={{ fontSize: 10, color: 'var(--c-sage)' }}>Compute Waste Cut</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Stream of Autonomous Actions */}
        <div className="liquid-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Clock size={16} color="#bbf451" />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
              Autonomous Stream
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { time: '2m ago', title: 'Fused Matrix Kernel', desc: 'Pruned 42.8% redundant memory hops on g4dn.xlarge' },
              { time: '14m ago', title: 'Hydro-Grid Shift', desc: 'Rescheduled 18 batch inference runs to low-carbon window' },
              { time: '41m ago', title: 'GitHub PR #142 Audited', desc: 'CI badge generated: 35.4% energy saved' },
              { time: '1h ago', title: 'SEBI Annexure Signed', desc: 'Q3 digital carbon report certified for BSE filing' }
            ].map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#bbf451', marginTop: 6 }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>{ev.title}</span>
                    <span style={{ fontSize: 10, color: 'var(--c-sage)' }}>{ev.time}</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 2 }}>{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
