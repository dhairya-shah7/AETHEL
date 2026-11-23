import React, { useState } from 'react';
import { 
  Zap, 
  DollarSign, 
  Calculator, 
  FileText, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Percent,
  Sliders
} from 'lucide-react';
import { calculateGainShare, GainShareResult } from '../../services/api';

interface GainSharePageProps {
  onNavigatePrev?: () => void;
  onRestart?: () => void;
}

const CLOUD_HOURLY_RATES: Record<string, number> = {
  'g4dn.xlarge': 0.526,
  'p4d.24xlarge': 32.77,
  'c5.4xlarge': 0.680,
  'a2-highgpu-1g': 3.67,
  'Standard_D4s_v5': 0.192,
};

export const GainSharePage: React.FC<GainSharePageProps> = ({
  onNavigatePrev,
  onRestart
}) => {
  const [workloadName, setWorkloadName] = useState('Enterprise AI Model Serving Cluster');
  const [cloudProvider, setCloudProvider] = useState('aws');
  const [instanceType, setInstanceType] = useState('g4dn.xlarge');
  const [nodesCount, setNodesCount] = useState(25);
  const [baselineHours, setBaselineHours] = useState(720);
  const [reductionPct, setReductionPct] = useState(36);
  const [commissionRate, setCommissionRate] = useState(0.20);
  const [loading, setLoading] = useState(false);

  // Dynamic live calculations that react instantly to sliders
  const hourlyRate = CLOUD_HOURLY_RATES[instanceType] || 0.526;
  const totalHours = baselineHours * nodesCount;
  const baselineSpendMonthly = Number((totalHours * hourlyRate).toFixed(2));
  const grossSavingsMonthly = Number((baselineSpendMonthly * (reductionPct / 100.0)).toFixed(2));
  const optimizedSpendMonthly = Number((baselineSpendMonthly - grossSavingsMonthly).toFixed(2));
  const annualizedGrossSavings = Number((grossSavingsMonthly * 12).toFixed(2));
  const aethelFeeMonthly = Number((grossSavingsMonthly * commissionRate).toFixed(2));
  const netClientSavingsMonthly = Number((grossSavingsMonthly - aethelFeeMonthly).toFixed(2));
  const netProfitMultiplier = aethelFeeMonthly > 0 ? Number((netClientSavingsMonthly / aethelFeeMonthly).toFixed(1)) : 4.0;

  const invoiceSummary = `==============================================
       AETHEL GREENOPS BILLING SUMMARY
==============================================
Workload:   ${workloadName}
Cluster:    ${cloudProvider.toUpperCase()} (${instanceType})
Nodes:      ${nodesCount} Dedicated Nodes (720 hrs/mo)
----------------------------------------------
Baseline:   $${baselineSpendMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })} / month
Optimized:  $${optimizedSpendMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })} / month
----------------------------------------------
Gross Cut:  $${grossSavingsMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })} / month (${reductionPct}% Cut)
Annualized: $${annualizedGrossSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })} / year
AETHEL Fee: $${aethelFeeMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${(commissionRate * 100).toFixed(0)}% Gain-Share)
NET SAVED:  $${netClientSavingsMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })} / month
Client ROI: ${netProfitMultiplier}x Cash Kept ($${netProfitMultiplier} kept per $1 fee)
==============================================`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1280, margin: '0 auto', width: '100%', minWidth: 0, overflowX: 'hidden' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
          STEP 3: SAVINGS CALCULATOR
        </span>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
          Cloud Bill Savings Calculator
        </h2>
        <p style={{ fontSize: 14, color: 'var(--c-sage)', marginTop: 8 }}>
          Calculate your exact monthly savings on AWS, Google Cloud, or Azure based on how many servers you run. Zero upfront cost: we only succeed when you save money.
        </p>
      </div>

      {/* Main Ledger Split */}
      <div className="grid-split">
        {/* Parameters Form */}
        <div className="liquid-card" style={{ padding: 22, minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Calculator size={18} color="#bbf451" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Cloud Setup & Sliders</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                Workload Name
              </label>
              <input
                type="text"
                value={workloadName}
                onChange={(e) => setWorkloadName(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(2, 13, 14, 0.7)',
                  border: '1px solid rgba(35, 83, 71, 0.6)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  outline: 'none'
                }}
              />
            </div>

            <div className="input-grid-2col">
              <div style={{ minWidth: 0 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                  Cloud Provider
                </label>
                <select
                  value={cloudProvider}
                  onChange={(e) => setCloudProvider(e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(2, 13, 14, 0.7)',
                    border: '1px solid rgba(35, 83, 71, 0.6)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    outline: 'none'
                  }}
                >
                  <option value="aws">Amazon Web Services</option>
                  <option value="gcp">Google Cloud Platform</option>
                  <option value="azure">Microsoft Azure</option>
                </select>
              </div>

              <div style={{ minWidth: 0 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                  Server Type (GPU / CPU)
                </label>
                <select
                  value={instanceType}
                  onChange={(e) => setInstanceType(e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'rgba(2, 13, 14, 0.7)',
                    border: '1px solid rgba(35, 83, 71, 0.6)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    outline: 'none'
                  }}
                >
                  <option value="g4dn.xlarge">g4dn.xlarge (T4 GPU - $0.526/hr)</option>
                  <option value="p4d.24xlarge">p4d.24xlarge (8x A100 - $32.77/hr)</option>
                  <option value="c5.4xlarge">c5.4xlarge (16 vCPU - $0.680/hr)</option>
                  <option value="a2-highgpu-1g">a2-highgpu-1g (GCP A100 - $3.67/hr)</option>
                  <option value="Standard_D4s_v5">Standard_D4s_v5 (Azure - $0.192/hr)</option>
                </select>
              </div>
            </div>

            {/* Nodes Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-sage)', marginBottom: 6 }}>
                <span>Number of Cloud Servers</span>
                <span style={{ color: '#bbf451', fontWeight: 800 }}>{nodesCount} Servers</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                step="1"
                value={nodesCount}
                onChange={(e) => setNodesCount(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#bbf451' }}
              />
            </div>

            {/* Reduction % Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-sage)', marginBottom: 6 }}>
                <span>AETHEL Verified Optimization %</span>
                <span style={{ color: '#bbf451', fontWeight: 800 }}>{reductionPct}% Cut</span>
              </div>
              <input
                type="range"
                min="10"
                max="75"
                step="1"
                value={reductionPct}
                onChange={(e) => setReductionPct(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#bbf451' }}
              />
            </div>

            {/* Commission Rate Toggle */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 8 }}>
                Contracted Performance Fee Tier
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: 'Standard 20%', val: 0.20 },
                  { label: 'Enterprise 15%', val: 0.15 }
                ].map(tier => (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => setCommissionRate(tier.val)}
                    style={{
                      flex: '1 1 120px',
                      minWidth: 0,
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: commissionRate === tier.val ? '1px solid #bbf451' : '1px solid rgba(35, 83, 71, 0.5)',
                      background: commissionRate === tier.val ? 'rgba(187, 244, 81, 0.15)' : 'rgba(2, 13, 14, 0.6)',
                      color: commissionRate === tier.val ? '#bbf451' : 'var(--c-sage)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Financial Ledger & Invoice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* 4 Financial Metric Cards */}
          <div className="grid-2col">
            <div className="liquid-card" style={{ padding: 18, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>Monthly Baseline Cloud Bill</div>
              <div style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                ${baselineSpendMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 4, wordBreak: 'break-word' }}>
                {nodesCount} servers × {cloudProvider.toUpperCase()} ({instanceType})
              </div>
            </div>

            <div className="liquid-card" style={{ padding: 18, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: 11, color: '#bbf451' }}>AETHEL Optimized Bill</div>
              <div style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 800, color: '#bbf451', marginTop: 4 }}>
                ${optimizedSpendMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 11, color: '#4ade80', marginTop: 4 }}>
                ↓ {reductionPct}% Cut (Saved ${grossSavingsMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })})
              </div>
            </div>

            <div className="liquid-card" style={{ padding: 18, border: '1px solid rgba(74, 222, 128, 0.4)', minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: 11, color: '#4ade80' }}>Net Client Cash Kept</div>
              <div style={{ fontSize: 'clamp(22px, 4.5vw, 26px)', fontWeight: 800, color: '#4ade80', marginTop: 4 }}>
                ${netClientSavingsMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 4 }}>
                Annualized: ${(netClientSavingsMonthly * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })} / yr
              </div>
            </div>

            <div className="liquid-card" style={{ padding: 18, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: 11, color: '#bbf451', fontWeight: 700 }}>Client Net Profit Multiplier</div>
              <div style={{ fontSize: 'clamp(22px, 4.5vw, 26px)', fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                {netProfitMultiplier}x Net Return
              </div>
              <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 4 }}>
                Keep ${netProfitMultiplier.toFixed(1)} for every $1 fee
              </div>
            </div>
          </div>

          {/* Formatted Formal Statement */}
          <div className="liquid-card" style={{ padding: 18, minWidth: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} color="#bbf451" />
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>Formal Gain-Share Statement</h4>
              </div>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(187, 244, 81, 0.15)', color: '#bbf451' }}>
                AUDITED INVOICE SPEC
              </span>
            </div>

            <pre style={{
              background: 'rgba(2, 13, 14, 0.9)',
              padding: '14px 16px',
              borderRadius: 12,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(9.5px, 2.4vw, 11px)',
              lineHeight: 1.6,
              color: '#DAF1DE',
              border: '1px solid rgba(35, 83, 71, 0.5)',
              overflowX: 'auto',
              maxWidth: '100%',
              boxSizing: 'border-box',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere'
            }}>
              {invoiceSummary}
            </pre>
          </div>
        </div>
      </div>

      {/* STEP FLOW NAVIGATION */}
      <div style={{
        marginTop: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        {onNavigatePrev && (
          <button
            onClick={onNavigatePrev}
            style={{
              padding: '12px 22px',
              fontSize: 13,
              fontWeight: 700,
              background: 'rgba(5, 31, 32, 0.85)',
              border: '1px solid rgba(142, 182, 155, 0.3)',
              borderRadius: 999,
              color: '#DAF1DE',
              cursor: 'pointer'
            }}
          >
            ← Step 2: Back to Live Engine
          </button>
        )}

        {onRestart && (
          <button
            onClick={onRestart}
            className="neon-pill-btn"
            style={{
              padding: '14px 28px',
              fontSize: 14,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 0 25px rgba(187, 244, 81, 0.35)',
              marginLeft: 'auto'
            }}
          >
            <span>Restart Tour (Back to Step 1)</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
