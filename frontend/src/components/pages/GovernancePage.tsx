import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Award, 
  Lock,
  Building,
  CheckCircle2
} from 'lucide-react';
import { generateBrsrReport, BrsrResult } from '../../services/api';

export const GovernancePage: React.FC = () => {
  const [enterpriseName, setEnterpriseName] = useState('Acme Technologies India Ltd');
  const [fiscalYear, setFiscalYear] = useState('FY 2026-27');
  const [kwhConsumed, setKwhConsumed] = useState(850000);
  const [kwhSaved, setKwhSaved] = useState(310000);
  const [turnoverCr, setTurnoverCr] = useState(180.0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [brsr, setBrsr] = useState<BrsrResult | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateBrsrReport({
        enterprise_name: enterpriseName,
        fiscal_year: fiscalYear,
        total_kwh_consumed: kwhConsumed,
        total_kwh_saved: kwhSaved,
        turnover_inr_crores: turnoverCr
      });
      setBrsr(res);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!brsr) return;
    navigator.clipboard.writeText(brsr.markdown_report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    if (!brsr) return;
    const blob = new Blob([brsr.markdown_report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SEBI_BRSR_Principal_6_${enterpriseName.replace(/\s+/g, '_')}_${fiscalYear}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
          PILLAR 3: 1-CLICK COMPLIANCE
        </span>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
          1-Click Government Carbon Audit (SEBI BRSR)
        </h2>
        <p style={{ fontSize: 14, color: 'var(--c-sage)', marginTop: 8 }}>
          Every listed Indian enterprise is legally required by SEBI to report digital energy and carbon. Click one button below to generate a certified audit sheet ready for your CFO, board, and regulators.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24 }}>
        {/* Input Parameters Form */}
        <div className="liquid-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Building size={18} color="#bbf451" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Corporate Audit Inputs</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                Enterprise Legal Entity Name
              </label>
              <input
                type="text"
                value={enterpriseName}
                onChange={(e) => setEnterpriseName(e.target.value)}
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
                  Fiscal Reporting Period
                </label>
                <input
                  type="text"
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(e.target.value)}
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

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                  Turnover (₹ Crores)
                </label>
                <input
                  type="number"
                  value={turnoverCr}
                  onChange={(e) => setTurnoverCr(parseFloat(e.target.value))}
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
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                Total Cloud Electricity Consumed (kWh)
              </label>
              <input
                type="number"
                value={kwhConsumed}
                onChange={(e) => setKwhConsumed(parseFloat(e.target.value))}
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

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-sage)', display: 'block', marginBottom: 6 }}>
                Avoided / Saved Energy via AETHEL (kWh)
              </label>
              <input
                type="number"
                value={kwhSaved}
                onChange={(e) => setKwhSaved(parseFloat(e.target.value))}
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

            <button
              className="neon-pill-btn"
              onClick={handleGenerate}
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: 10
              }}
            >
              {loading ? <RefreshCw size={16} className="spin" /> : <ShieldCheck size={16} />}
              <span>{loading ? 'Synthesizing Disclosure...' : 'Generate Official BRSR Annexure'}</span>
            </button>
          </div>
        </div>

        {/* Audit Output & Certified Disclosure */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Statutory Verification Ribbon */}
          <div className="liquid-card" style={{ padding: 24, border: '1px solid rgba(74, 222, 128, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Award size={24} color="#4ade80" />
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
                    SEBI BRSR Core Assurance Ready
                  </h4>
                  <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>
                    CEA Baseline Grid Factor ~ 0.716 tCO2e/MWh • Water Factor 1.8 kL/MWh
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={copyToClipboard}
                  disabled={!brsr}
                  className="glass-outline-btn"
                  style={{ padding: '8px 14px', fontSize: 11 }}
                >
                  {copied ? <Check size={13} color="#4ade80" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={downloadMarkdown}
                  disabled={!brsr}
                  className="glass-outline-btn"
                  style={{ padding: '8px 14px', fontSize: 11 }}
                >
                  <Download size={13} />
                  <span>Download .md</span>
                </button>
              </div>
            </div>
          </div>

          {/* Report Viewer / Initial State */}
          <div className="liquid-card" style={{ padding: 28 }}>
            {brsr ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(35, 83, 71, 0.5)', paddingBottom: 14 }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--c-sage)' }}>AUDITED ENTITY</span>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{brsr.metadata.enterprise}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, color: 'var(--c-sage)' }}>REPORTING PERIOD</span>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#bbf451' }}>{brsr.metadata.fiscal_year}</div>
                  </div>
                </div>

                {/* Table 1: Energy */}
                <div>
                  <h5 style={{ fontSize: 13, fontWeight: 700, color: '#DAF1DE', marginBottom: 8 }}>
                    Table 1: Digital Infrastructure Energy Consumption
                  </h5>
                  <div style={{ background: 'rgba(2, 13, 14, 0.6)', borderRadius: 12, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: 'rgba(35, 83, 71, 0.3)', color: 'var(--c-sage)', textAlign: 'left' }}>
                          <th style={{ padding: '10px 14px' }}>Parameter</th>
                          <th style={{ padding: '10px 14px' }}>Audited Consumed</th>
                          <th style={{ padding: '10px 14px' }}>Avoided via AETHEL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(35, 83, 71, 0.3)' }}>
                          <td style={{ padding: '10px 14px', color: '#DAF1DE' }}>Electricity Consumed</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{brsr.energy_metrics.total_electricity_consumed_mwh.toLocaleString()} MWh</td>
                          <td style={{ padding: '10px 14px', color: '#bbf451', fontWeight: 700 }}>{brsr.energy_metrics.energy_saved_via_verde_mwh.toLocaleString()} MWh</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(35, 83, 71, 0.3)' }}>
                          <td style={{ padding: '10px 14px', color: '#DAF1DE' }}>Energy in Gigajoules (GJ)</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{brsr.energy_metrics.total_energy_gigajoules.toLocaleString()} GJ</td>
                          <td style={{ padding: '10px 14px', color: '#bbf451', fontWeight: 700 }}>{brsr.energy_metrics.energy_saved_via_verde_gj.toLocaleString()} GJ</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 14px', color: '#DAF1DE' }}>Energy Intensity / ₹ Crore</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{brsr.energy_metrics.energy_intensity_gj_per_crore_inr} GJ / ₹ Cr</td>
                          <td style={{ padding: '10px 14px', color: '#4ade80' }}>Net Baseline Reduction</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 2: Scope 2 Emissions */}
                <div>
                  <h5 style={{ fontSize: 13, fontWeight: 700, color: '#DAF1DE', marginBottom: 8 }}>
                    Table 2: Scope 2 Greenhouse Gas (GHG) Emissions
                  </h5>
                  <div style={{ background: 'rgba(2, 13, 14, 0.6)', borderRadius: 12, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: 'rgba(35, 83, 71, 0.3)', color: 'var(--c-sage)', textAlign: 'left' }}>
                          <th style={{ padding: '10px 14px' }}>Parameter</th>
                          <th style={{ padding: '10px 14px' }}>Gross Emissions</th>
                          <th style={{ padding: '10px 14px' }}>Avoided Footprint</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(35, 83, 71, 0.3)' }}>
                          <td style={{ padding: '10px 14px', color: '#DAF1DE' }}>Scope 2 Emissions</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{brsr.ghg_emissions_scope2.grid_emissions_metric_tonnes_co2e.toLocaleString()} tCO2e</td>
                          <td style={{ padding: '10px 14px', color: '#bbf451', fontWeight: 700 }}>{brsr.ghg_emissions_scope2.avoided_emissions_via_verde_tco2e.toLocaleString()} tCO2e</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '10px 14px', color: '#DAF1DE' }}>Emission Intensity / ₹ Crore</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{brsr.ghg_emissions_scope2.emission_intensity_tco2e_per_crore_inr} tCO2e / ₹ Cr</td>
                          <td style={{ padding: '10px 14px', color: '#4ade80' }}>Verified Assurance Ready</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <FileText size={40} color="var(--c-pine)" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Ready to Synthesize SEBI Disclosure</h4>
                <p style={{ fontSize: 12, color: 'var(--c-sage)', marginTop: 4 }}>
                  Click "Generate Official BRSR Annexure" on the left to compile real-time ESG assurance tables.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
