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
          fontSize: 'clamp(32px, 7vw, 64px)',
          lineHeight: 1.1,
          fontWeight: 800,
          letterSpacing: -1.2,
          color: '#FFFFFF',
          marginBottom: 16
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
          fontSize: 15,
          lineHeight: 1.5,
          color: 'var(--c-sage)',
          maxWidth: 620,
          margin: '0 auto 20px auto'
        }}>
          Cut your cloud bills by 30% to 50% while automatically fulfilling carbon compliance. AETHEL detects wasted server power, frees memory, and protects performance with zero upfront cost.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 12, fontSize: 12, color: 'var(--c-sage)' }}>
          <span>✓ Zero Hardware Required</span>
          <span>✓ Real Silicon Optimization</span>
          <span>✓ Zero Upfront Risk</span>
        </div>
      </section>

      {/* 2. EXECUTIVE MASTER KPIS */}
      <section className="grid-4col" style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div className="liquid-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)' }}>Cloud Dollars Saved</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(187, 244, 81, 0.15)' }}>
              <Zap size={16} color="#bbf451" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF' }}>$40,901</div>
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>↑ 36% Net Efficiency</span>
            <span style={{ color: 'var(--c-sage)' }}>/ yr</span>
          </div>
        </div>

        <div className="liquid-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)' }}>Clean Energy Conserved</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(74, 222, 128, 0.15)' }}>
              <Leaf size={16} color="#4ade80" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF' }}>310 MWh</div>
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 6 }}>
            <span>1.116 GJ avoided</span>
          </div>
        </div>

        <div className="liquid-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)' }}>Avoided Carbon Footprint</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(187, 244, 81, 0.15)' }}>
              <TrendingDown size={16} color="#bbf451" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF' }}>221.9 <span style={{ fontSize: 14, color: '#bbf451' }}>tCO2e</span></div>
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 6 }}>
            <span>-36% Grid Emissions</span>
          </div>
        </div>

        <div className="liquid-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)' }}>Datacenter Water Saved</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(218, 241, 222, 0.15)' }}>
              <ShieldCheck size={16} color="#DAF1DE" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF' }}>558,000 <span style={{ fontSize: 14 }}>Liters</span></div>
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 6 }}>
            <span>WUE 1.8 L/kWh Saved</span>
          </div>
        </div>
      </section>

      {/* 3. HOW AETHEL WORKS IN 3 SIMPLE STEPS */}
      <section style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
            HOW IT WORKS
          </span>
          <h2 style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
            Simple 3-Step Optimization
          </h2>
          <p style={{ fontSize: 13, color: 'var(--c-sage)', marginTop: 6 }}>
            No complex setup. Zero downtime. Guaranteed savings.
          </p>
        </div>

        <div className="grid-3col">
          <div className="liquid-card" style={{ padding: 20 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(187, 244, 81, 0.15)',
              color: '#bbf451',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
              marginBottom: 12
            }}>1</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
              1. Plug In
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--c-sage)', margin: 0 }}>
              Connect AETHEL to AWS, GCP, or Azure in 2 minutes. Requires zero hardware or downtime.
            </p>
          </div>

          <div className="liquid-card" style={{ padding: 20 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(74, 222, 128, 0.15)',
              color: '#4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
              marginBottom: 12
            }}>2</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
              2. Cut Waste
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--c-sage)', margin: 0 }}>
              AI automatically detects idle instances, memory bloat, and thermal throttling in real time.
            </p>
          </div>

          <div className="liquid-card" style={{ padding: 20 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(187, 244, 81, 0.15)',
              color: '#bbf451',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
              marginBottom: 12
            }}>3</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
              3. Save 30-50%
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--c-sage)', margin: 0 }}>
              Watch monthly bills drop immediately. Pay nothing if we don't save you money.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE 4 PILLARS OF AETHEL ARCHITECTURE */}
      <section style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
            CORE CAPABILITIES
          </span>
          <h2 style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
            The 4 Core Pillars
          </h2>
        </div>

        <div className="grid-4col">
          {/* Pillar 1 */}
          <div 
            className="liquid-card" 
            onClick={() => setActiveTab('cockpit')}
            style={{ padding: 20, cursor: 'pointer' }}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(35, 83, 71, 0.4)',
              border: '1px solid rgba(187, 244, 81, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}>
              <Terminal size={18} color="#bbf451" />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#bbf451', marginBottom: 2 }}>PILLAR 1</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
              Live Power Meter
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--c-sage)', margin: 0 }}>
              Measures exact electricity (Watts & Joules) drawn by cloud servers with zero fake mocks.
            </p>
          </div>

          {/* Pillar 2 */}
          <div 
            className="liquid-card" 
            onClick={() => setActiveTab('gainshare')}
            style={{ padding: 20, cursor: 'pointer' }}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(35, 83, 71, 0.4)',
              border: '1px solid rgba(187, 244, 81, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}>
              <Zap size={18} color="#bbf451" />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#bbf451', marginBottom: 2 }}>PILLAR 2</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
              Zero-Risk Savings
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--c-sage)', margin: 0 }}>
              Pay $0 upfront. We only take a 20% cut of verified cash savings on your cloud bill.
            </p>
          </div>

          {/* Pillar 3 */}
          <div 
            className="liquid-card" 
            style={{ padding: 20 }}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(35, 83, 71, 0.4)',
              border: '1px solid rgba(187, 244, 81, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}>
              <ShieldCheck size={18} color="#bbf451" />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#bbf451', marginBottom: 2 }}>PILLAR 3</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
              1-Click Carbon Audit
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--c-sage)', margin: 0 }}>
              Generates official carbon and ESG reports for compliance and leadership review.
            </p>
          </div>

          {/* Pillar 4 */}
          <div 
            className="liquid-card" 
            style={{ padding: 20 }}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(35, 83, 71, 0.4)',
              border: '1px solid rgba(187, 244, 81, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}>
              <Cloud size={18} color="#bbf451" />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#bbf451', marginBottom: 2 }}>PILLAR 4</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
              Cloud Marketplace
            </h4>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--c-sage)', margin: 0 }}>
              Deploy in seconds via AWS, Azure, or GCP marketplace with unified billing.
            </p>
          </div>
        </div>
      </section>

      {/* 5. LIVE REGIONAL CLUSTERS & RECENT EVENTS */}
      <section className="grid-split" style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
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
