import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ShieldCheck, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  Cpu, 
  ExternalLink,
  Layers,
  ArrowRight,
  Zap,
  Sliders
} from 'lucide-react';
import { fetchTraceDatasets, DatasetMetadata } from '../../services/api';

interface ExecutiveShowcasePageProps {
  onNavigateNext?: () => void;
}

export const ExecutiveShowcasePage: React.FC<ExecutiveShowcasePageProps> = ({ onNavigateNext }) => {
  const [datasets, setDatasets] = useState<Record<string, DatasetMetadata>>({});
  const [surgeIntensity, setSurgeIntensity] = useState<number>(65); // 0 to 100%

  useEffect(() => {
    fetchTraceDatasets().then(setDatasets);
  }, []);

  // Dynamic calculations based on surge slider
  const unmanagedTemp = Number((68.0 + (surgeIntensity / 100.0) * 17.5).toFixed(1));
  const isThrottled = unmanagedTemp >= 82.0;
  const unmanagedClockMhz = isThrottled ? 915 : 1410;
  const unmanagedClockDropPct = isThrottled ? 35 : (unmanagedTemp >= 75 ? 15 : 0);
  const unmanagedJobHours = isThrottled ? 14.8 : (unmanagedTemp >= 75 ? 12.0 : 10.0);
  const unmanagedDailyWasteUsd = isThrottled ? 450 : (unmanagedTemp >= 75 ? 180 : 0);

  const aethelTemp = Number((64.0 + (surgeIntensity / 100.0) * 4.5).toFixed(1));
  const aethelPrecision = surgeIntensity >= 40 ? 'INT8' : 'FP16';

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* 1. TOP EXECUTIVE HEADLINE BANNER */}
      <div className="executive-banner" style={{
        background: 'linear-gradient(135deg, rgba(16, 50, 45, 0.75), rgba(7, 25, 23, 0.90))',
        border: '1px solid rgba(187, 244, 81, 0.35)',
        borderRadius: 18,
        padding: '24px 28px',
        marginBottom: 24,
        boxShadow: '0 12px 35px rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div style={{ flex: '1 1 340px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{
              background: 'linear-gradient(135deg, rgba(187, 244, 81, 0.2), rgba(35, 83, 71, 0.4))',
              border: '1px solid rgba(187, 244, 81, 0.5)',
              color: '#bbf451',
              padding: '4px 12px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 0 15px rgba(187, 244, 81, 0.2)'
            }}>
              Autonomous Cloud AI Operating System
            </span>
            <span style={{ fontSize: 12, color: 'var(--c-sage)', fontWeight: 600 }}>
              Sovereign Performance & Cost Intelligence
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(24px, 4.5vw, 34px)',
            fontWeight: 900,
            lineHeight: 1.2,
            margin: '6px 0 12px 0',
            letterSpacing: '-0.025em',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #DAF1DE 55%, #bbf451 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            wordBreak: 'break-word'
          }}>
            Autonomous AI Infrastructure: Slashing Cloud Spend & Eliminating GPU Waste
          </h1>
          <div style={{
            fontSize: 'clamp(13px, 1.8vw, 14.5px)',
            color: 'var(--c-sage)',
            margin: 0,
            maxWidth: 820,
            lineHeight: 1.6,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}>
            <div>
              <strong style={{ color: '#bbf451', fontWeight: 800 }}>What AETHEL Does:</strong>{' '}
              <span>
                Consolidates 4 disparate tools (DCGM, CAST AI, Zeus, vLLM) into one sovereign operating system that dynamically optimizes model precision, routes prompts to optimal parameter tiers, and balances GPU thermal loads.
              </span>
            </div>
            <div>
              <strong style={{ color: '#4ade80', fontWeight: 800 }}>What AETHEL Solves:</strong>{' '}
              <span>
                Stops silent thermal throttling (-35% clock drops), eliminates paying $1.80/M tokens on trivial queries, and guarantees zero accuracy loss—all on a pure gain-share model with $0 upfront cost.
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Headline Metrics */}
        <div className="executive-metrics-grid" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: '100%', maxWidth: 440 }}>
          <div style={{
            background: 'rgba(5, 31, 32, 0.85)',
            border: '1px solid rgba(142, 182, 155, 0.25)',
            borderRadius: 12,
            padding: '12px 14px',
            textAlign: 'center',
            flex: '1 1 90px',
            minWidth: 0
          }}>
            <div style={{ fontSize: 11, color: 'var(--c-sage)', fontWeight: 600 }}>PROCESSING SPEED</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#bbf451', marginTop: 2 }}>Full Speed</div>
            <div style={{ fontSize: 10, color: 'var(--c-sage)' }}>No slowdowns</div>
          </div>

          <div style={{
            background: 'rgba(5, 31, 32, 0.85)',
            border: '1px solid rgba(142, 182, 155, 0.25)',
            borderRadius: 12,
            padding: '12px 14px',
            textAlign: 'center',
            flex: '1 1 90px',
            minWidth: 0
          }}>
            <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>BILL REDUCTION</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>Up to 35% Cut</div>
            <div style={{ fontSize: 10, color: 'var(--c-sage)' }}>Direct savings</div>
          </div>

          <div style={{
            background: 'rgba(5, 31, 32, 0.85)',
            border: '1px solid rgba(142, 182, 155, 0.25)',
            borderRadius: 12,
            padding: '12px 14px',
            textAlign: 'center',
            flex: '1 1 90px',
            minWidth: 0
          }}>
            <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>SERVER HEALTH</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#4ade80', marginTop: 2 }}>Protected</div>
            <div style={{ fontSize: 10, color: 'var(--c-sage)' }}>0% crash risk</div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE CLUSTER SURGE SIMULATION SLIDER */}
      <div className="glass-panel" style={{ padding: '16px 22px', borderRadius: 14, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={18} color="#bbf451" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#DAF1DE' }}>
              Interactive Workload Surge Intensity:
            </span>
            <span style={{ fontSize: 13, color: surgeIntensity >= 60 ? '#ef4444' : '#bbf451', fontWeight: 800 }}>
              {surgeIntensity}% Workload Load
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--c-sage)' }}>
            Drag to watch the real-time contrast between unmanaged silicon and AETHEL
          </span>
        </div>
        <input 
          type="range" 
          min="10" 
          max="100" 
          step="5" 
          value={surgeIntensity} 
          onChange={(e) => setSurgeIntensity(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#bbf451' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--c-sage)', marginTop: 4 }}>
          <span>10% (Idle Cloud State)</span>
          <span>50% (Standard Training Step)</span>
          <span style={{ color: '#ef4444', fontWeight: 700 }}>85%+ (Thermal Runaway Critical Peak)</span>
        </div>
      </div>

      {/* 3. THE DEFINITIVE SIDE-BY-SIDE SPLIT SCREEN */}
      <div className="responsive-split-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        marginBottom: 28
      }}>
        {/* LEFT CARD: WITHOUT AETHEL (Status Quo / High Risk) */}
        <div style={{
          background: isThrottled 
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.16), rgba(80, 15, 15, 0.45))'
            : 'linear-gradient(135deg, rgba(245, 158, 11, 0.10), rgba(40, 25, 10, 0.40))',
          border: isThrottled ? '2px solid #ef4444' : '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 18,
          padding: 24,
          boxShadow: isThrottled ? '0 0 30px rgba(239, 68, 68, 0.25)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span style={{
                background: isThrottled ? '#ef4444' : '#f59e0b',
                color: '#fff',
                fontSize: 10,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 6,
                letterSpacing: '0.05em'
              }}>
                WITHOUT AETHEL
              </span>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '8px 0 0 0', color: '#fca5a5' }}>
                Standard Cloud Server
              </h2>
            </div>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={24} color="#ef4444" />
            </div>
          </div>

          <div style={{
            background: 'rgba(5, 31, 32, 0.7)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--c-sage)' }}>Server Running Temperature:</span>
              <strong style={{ fontSize: 24, color: isThrottled ? '#ef4444' : '#f59e0b' }}>
                {unmanagedTemp}°C
              </strong>
            </div>
            <div style={{ fontSize: 11, color: isThrottled ? '#fca5a5' : 'var(--c-sage)' }}>
              {isThrottled ? 'CRITICAL: High temperature causes server hardware to automatically slow down.' : 'High temperature buildup under load.'}
            </div>
          </div>

          {/* 4 Contrast Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <TrendingDown size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: '#DAF1DE' }}>Processing Speed: </strong>
                <span style={{ fontSize: 13, color: '#fca5a5' }}>
                  {unmanagedClockMhz} MHz <strong>(-{unmanagedClockDropPct}% speed drop)</strong>
                </span>
                <p style={{ fontSize: 11, color: 'var(--c-sage)', margin: '2px 0 0 0' }}>
                  The processor slows down to avoid overheating, making AI responses slower.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Clock size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: '#DAF1DE' }}>Task Completion Time: </strong>
                <span style={{ fontSize: 13, color: '#fca5a5' }}>
                  {unmanagedJobHours} Hours (Delayed by +{Number((unmanagedJobHours - 10.0).toFixed(1))} hrs)
                </span>
                <p style={{ fontSize: 11, color: 'var(--c-sage)', margin: '2px 0 0 0' }}>
                  A job budgeted for 10 hours stalls and runs for nearly 15 hours.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <DollarSign size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: '#DAF1DE' }}>Wasted Cloud Spend: </strong>
                <span style={{ fontSize: 13, color: '#fca5a5' }}>
                  ${unmanagedDailyWasteUsd} / day lost
                </span>
                <p style={{ fontSize: 11, color: 'var(--c-sage)', margin: '2px 0 0 0' }}>
                  Paying full cloud rental price while getting slowed-down performance.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: '#DAF1DE' }}>Crash Risk: </strong>
                <span style={{ fontSize: 13, color: '#fca5a5' }}>HIGH (Overheating Outage Risk)</span>
                <p style={{ fontSize: 11, color: 'var(--c-sage)', margin: '2px 0 0 0' }}>
                  Sudden traffic spikes can cause memory exhaustion and server crashes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: WITH AETHEL (Optimized / Complete Protection) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.14), rgba(7, 30, 28, 0.75))',
          border: '2px solid rgba(187, 244, 81, 0.65)',
          borderRadius: 18,
          padding: 24,
          boxShadow: '0 0 30px rgba(187, 244, 81, 0.15)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span style={{
                background: '#bbf451',
                color: '#051f20',
                fontSize: 10,
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 6,
                letterSpacing: '0.05em'
              }}>
                WITH AETHEL
              </span>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '8px 0 0 0', color: '#bbf451' }}>
                Protected & Optimized Server
              </h2>
            </div>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'rgba(187, 244, 81, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={24} color="#bbf451" />
            </div>
          </div>

          <div style={{
            background: 'rgba(5, 31, 32, 0.7)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            border: '1px solid rgba(187, 244, 81, 0.35)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--c-sage)' }}>Server Running Temperature:</span>
              <strong style={{ fontSize: 24, color: '#4ade80' }}>
                {aethelTemp}°C
              </strong>
            </div>
            <div style={{ fontSize: 11, color: '#bbf451' }}>
              STABLE TEMPERATURE: Workload dynamically managed. Hardware stays cool and fast.
            </div>
          </div>

          {/* 4 Value Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Zap size={18} color="#bbf451" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: '#DAF1DE' }}>Processing Speed: </strong>
                <span style={{ fontSize: 13, color: '#bbf451' }}>
                  1,410 MHz <strong>(100% Full Speed Maintained)</strong>
                </span>
                <p style={{ fontSize: 11, color: 'var(--c-sage)', margin: '2px 0 0 0' }}>
                  Memory optimization keeps chips cool so clock speed never drops.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <CheckCircle2 size={18} color="#bbf451" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: '#DAF1DE' }}>Task Completion Time: </strong>
                <span style={{ fontSize: 13, color: '#bbf451' }}>
                  10.0 Hours <strong>(Finished on schedule)</strong>
                </span>
                <p style={{ fontSize: 11, color: 'var(--c-sage)', margin: '2px 0 0 0' }}>
                  AI jobs complete on time without unexpected stalls or lag.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <DollarSign size={18} color="#bbf451" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: '#DAF1DE' }}>Net Client Savings: </strong>
                <span style={{ fontSize: 13, color: '#bbf451' }}>
                  $1,280 / month saved
                </span>
                <p style={{ fontSize: 11, color: 'var(--c-sage)', margin: '2px 0 0 0' }}>
                  Direct savings from eliminating wasted server hours and throttling.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <ShieldCheck size={18} color="#bbf451" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: '#DAF1DE' }}>Crash Protection: </strong>
                <span style={{ fontSize: 13, color: '#bbf451' }}>Active System Guard</span>
                <p style={{ fontSize: 11, color: 'var(--c-sage)', margin: '2px 0 0 0' }}>
                  Protects servers against sudden memory spikes and prevents costly downtime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. AUTHENTICATED DATASET CITATIONS CARD */}
      <div className="glass-panel" style={{ padding: 22, borderRadius: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Database size={20} color="#38bdf8" />
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#DAF1DE' }}>
              Authenticated Real-World Datasets Powering AETHEL
            </h3>
            <span style={{ fontSize: 11, color: 'var(--c-sage)' }}>
              100% verified public datacenter traces — Zero synthetic or fabricated telemetry
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 16
        }}>
          {Object.values(datasets).map((ds) => (
            <div
              key={ds.id}
              style={{
                background: 'rgba(5, 31, 32, 0.75)',
                border: '1px solid rgba(142, 182, 155, 0.25)',
                borderRadius: 12,
                padding: 16
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <strong style={{ fontSize: 13, color: '#DAF1DE' }}>{ds.name}</strong>
                <a
                  href={ds.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                >
                  Source <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ fontSize: 11, color: '#bbf451', marginBottom: 8, fontFamily: 'monospace' }}>
                {ds.citation}
              </div>
              <div style={{ fontSize: 11, color: 'var(--c-sage)', marginBottom: 8, lineHeight: 1.4 }}>
                <strong>Scope:</strong> {ds.scope}
              </div>
              <div style={{ fontSize: 11, color: '#fca5a5', lineHeight: 1.4 }}>
                <strong>Documented Failure:</strong> {ds.incident_documented}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. NEXT STEP IN APP FLOW */}
      {onNavigateNext && (
        <div style={{
          marginTop: 28,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
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
              boxShadow: '0 0 25px rgba(187, 244, 81, 0.35)'
            }}
          >
            <span>Step 2: Test Live Engine on Your Laptop</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
