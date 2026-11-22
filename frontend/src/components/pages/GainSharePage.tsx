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

  const [result, setResult] = useState<GainShareResult>({
    workload: 'Enterprise AI Model Serving Cluster',
    cloud: 'AWS',
    instance: 'g4dn.xlarge',
    hourly_rate_usd: 0.526,
    baseline_spend_monthly_usd: 9468.0,
    optimized_spend_monthly_usd: 6059.52,
    gross_savings_monthly_usd: 3408.48,
    annualized_gross_savings_usd: 40901.76,
    verde_gainshare_fee_20pct_usd: 681.7,
    net_client_savings_monthly_usd: 2726.78,
    client_roi_pct: 400.0,
    instances_count: 25,
    reduction_pct: 36,
    commission_rate_pct: 20,
    invoice_summary: `============================================================\n           AETHEL GREENOPS BILLING SUMMARY\n============================================================\nWorkload:               Enterprise AI Model Serving Cluster (AWS - g4dn.xlarge)\nMonthly Baseline Spend: $9,468.00\nMonthly Optimized Spend:$6,059.52\n------------------------------------------------------------\nTotal Gross Savings:    $3,408.48 / month\nAnnualized Run-Rate:    $40,901.76 / year\nAETHEL 20% Success Fee: $681.70\nNET CLIENT CASH SAVED:  $2,726.78 / month\nClient Immediate ROI:   400.0%\n============================================================`
  });

  const handleRecalculate = async () => {
    setLoading(true);
    try {
      const res = await calculateGainShare({
        workload_name: workloadName,
        cloud_provider: cloudProvider,
        instance_type: instanceType,
        instances_count: nodesCount,
        baseline_hours_per_month: baselineHours,
        optimization_reduction_pct: reductionPct,
        commission_rate: commissionRate
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
          STEP 3: BUSINESS ROI & FINOPS
        </span>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
          Zero-Risk Cloud Savings Calculator
        </h2>
        <p style={{ fontSize: 14, color: 'var(--c-sage)', marginTop: 8 }}>
          Pay $0 upfront. Select your cloud provider and number of GPUs or servers to see your exact monthly cash savings. Zero risk: we only take a 20% cut of verified savings. If we don't save you money, you owe us nothing.
        </p>
      </div>

      {/* Main Ledger Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        {/* Parameters Form */}
        <div className="liquid-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Calculator size={18} color="#bbf451" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>FinOps Simulation Engine</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                Workload Identifier
              </label>
              <input
                type="text"
                value={workloadName}
                onChange={(e) => setWorkloadName(e.target.value)}
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
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                  Cloud Provider
                </label>
                <select
                  value={cloudProvider}
                  onChange={(e) => setCloudProvider(e.target.value)}
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
                  <option value="aws">Amazon Web Services</option>
                  <option value="gcp">Google Cloud Platform</option>
                  <option value="azure">Microsoft Azure</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                  Instance Type
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
                <span>Active Clustered Nodes</span>
                <span style={{ color: '#bbf451', fontWeight: 700 }}>{nodesCount} Nodes</span>
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
                <span style={{ color: '#bbf451', fontWeight: 700 }}>{reductionPct}% Cut</span>
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
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { label: 'Standard 20%', val: 0.20 },
                  { label: 'Enterprise 15%', val: 0.15 }
                ].map(tier => (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => setCommissionRate(tier.val)}
                    style={{
                      flex: 1,
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

            <button
              className="neon-pill-btn"
              onClick={handleRecalculate}
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: 8
              }}
            >
              <Zap size={16} />
              <span>{loading ? 'Auditing Financials...' : 'Recalculate FinOps Return'}</span>
            </button>
          </div>
        </div>

        {/* Output Financial Ledger & Invoice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 4 Financial Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div className="liquid-card" style={{ padding: 22 }}>
              <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>Monthly Baseline Cloud Bill</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                ${result.baseline_spend_monthly_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 4 }}>
                {result.instances_count} × {result.instance} @ ${result.hourly_rate_usd}/hr
              </div>
            </div>

            <div className="liquid-card" style={{ padding: 22 }}>
              <div style={{ fontSize: 11, color: '#bbf451' }}>AETHEL Optimized Bill</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#bbf451', marginTop: 4 }}>
                ${result.optimized_spend_monthly_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 11, color: '#4ade80', marginTop: 4 }}>
                ↓ {result.reduction_pct}% Compute Hours Saved
              </div>
            </div>

            <div className="liquid-card" style={{ padding: 22, border: '1px solid rgba(74, 222, 128, 0.4)' }}>
              <div style={{ fontSize: 11, color: '#4ade80' }}>Net Client Cash Kept</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#4ade80', marginTop: 4 }}>
                ${result.net_client_savings_monthly_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 4 }}>
                Annualized: ${(result.net_client_savings_monthly_usd * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })} / yr
              </div>
            </div>

            <div className="liquid-card" style={{ padding: 22 }}>
              <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>Client Immediate ROI</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                {result.client_roi_pct.toFixed(0)}%
              </div>
              <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 4 }}>
                AETHEL {(result.commission_rate_pct).toFixed(0)}% Fee: ${result.verde_gainshare_fee_20pct_usd.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Formatted Formal Statement */}
          <div className="liquid-card" style={{ padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} color="#bbf451" />
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Formal Gain-Share Billing Statement</h4>
              </div>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(187, 244, 81, 0.15)', color: '#bbf451' }}>
                AUDITED INVOICE SPEC
              </span>
            </div>

            <pre style={{
              background: 'rgba(2, 13, 14, 0.9)',
              padding: 18,
              borderRadius: 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              lineHeight: 1.6,
              color: '#DAF1DE',
              border: '1px solid rgba(35, 83, 71, 0.5)',
              overflowX: 'auto',
              whiteSpace: 'pre'
            }}>
              {result.invoice_summary}
            </pre>
          </div>
        </div>
      </div>

      {/* STEP FLOW NAVIGATION */}
      <div style={{
        marginTop: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
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
