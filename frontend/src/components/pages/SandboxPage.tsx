import React, { useState } from 'react';
import { 
  Terminal, 
  GitPullRequest, 
  Code2, 
  Copy, 
  Check, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const SandboxPage: React.FC = () => {
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [codeSample, setCodeSample] = useState(
`import torch

# Unoptimized Matrix Pipeline
def batch_inference(tensors):
    results = []
    for t in tensors:
        # Redundant GPU to CPU transfer inside hot loop
        cpu_t = t.cpu().numpy()
        processed = cpu_t ** 2 + 3.14
        results.append(torch.tensor(processed).cuda())
    return results`
  );

  const [analyzed, setAnalyzed] = useState(false);
  const [simulatedSavings, setSimulatedSavings] = useState(48.2);

  const githubActionYaml = 
`name: AETHEL GreenOps Energy & Carbon Profiler
on: [pull_request]

jobs:
  energy-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          
      - name: Run AETHEL Telemetry Profiler
        uses: aethel-greenops/energy-action@v2
        with:
          cloud-instance: 'g4dn.xlarge'
          grid-region: 'IN_NATIONAL'
          fail-on-regression: true
          regression-threshold-pct: 5.0
          github-token: \${{ secrets.GITHUB_TOKEN }}`;

  const copyYaml = () => {
    navigator.clipboard.writeText(githubActionYaml);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  const handleAnalyzeCode = () => {
    setAnalyzed(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
          DEVELOPER TOOLKIT & CI/CD GITHUB ACTION
        </span>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
          CI/CD GitHub Action & Code Linter
        </h2>
        <p style={{ fontSize: 14, color: 'var(--c-sage)', marginTop: 8 }}>
          Integrate continuous carbon and energy auditing directly into your GitHub pull request workflows. Catch performance regressions before production.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        {/* GitHub Action Simulator */}
        <div className="liquid-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <GitPullRequest size={18} color="#bbf451" />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>GitHub Action YAML Spec</h3>
            </div>
            <button
              onClick={copyYaml}
              className="glass-outline-btn"
              style={{ padding: '6px 14px', fontSize: 11 }}
            >
              {copiedYaml ? <Check size={13} color="#4ade80" /> : <Copy size={13} />}
              <span>{copiedYaml ? 'Copied' : 'Copy YAML'}</span>
            </button>
          </div>

          <pre style={{
            background: 'rgba(2, 13, 14, 0.9)',
            padding: 18,
            borderRadius: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            lineHeight: 1.5,
            color: '#DAF1DE',
            border: '1px solid rgba(35, 83, 71, 0.5)',
            overflowX: 'auto'
          }}>
            {githubActionYaml}
          </pre>

          {/* PR Comment Simulation Preview */}
          <div style={{ marginTop: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-sage)', display: 'block', marginBottom: 10 }}>
              LIVE GITHUB PR COMMENT BADGE PREVIEW
            </span>

            <div style={{
              background: 'rgba(11, 43, 38, 0.5)',
              borderRadius: 16,
              padding: 20,
              border: '1px solid rgba(74, 222, 128, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>🟢</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>AETHEL GreenOps Energy & Carbon Audit</span>
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 11, background: '#16a34a', color: '#FFF', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
                  AETHEL Energy: 35.4% Saved
                </span>
                <span style={{ fontSize: 11, background: '#0284c7', color: '#FFF', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
                  Carbon Footprint: -0.17g CO2e
                </span>
              </div>

              <p style={{ fontSize: 12, color: 'var(--c-mint-light)', marginBottom: 12 }}>
                <strong>Great job!</strong> This pull request reduces overall compute energy consumption by <strong>35.4%</strong>.
              </p>

              <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse', color: 'var(--c-sage)' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(35, 83, 71, 0.5)' }}>
                    <th style={{ padding: '6px 8px' }}>Metric</th>
                    <th style={{ padding: '6px 8px' }}>Baseline</th>
                    <th style={{ padding: '6px 8px' }}>Current PR</th>
                    <th style={{ padding: '6px 8px' }}>Delta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(35, 83, 71, 0.3)' }}>
                    <td style={{ padding: '6px 8px', color: '#FFF' }}>Execution Time</td>
                    <td style={{ padding: '6px 8px' }}>12.5s</td>
                    <td style={{ padding: '6px 8px' }}>7.8s</td>
                    <td style={{ padding: '6px 8px', color: '#4ade80' }}>-4.7s (-37.6%)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 8px', color: '#FFF' }}>Kernel Energy</td>
                    <td style={{ padding: '6px 8px' }}>2,250 J</td>
                    <td style={{ padding: '6px 8px' }}>1,404 J</td>
                    <td style={{ padding: '6px 8px', color: '#4ade80' }}>-846.0 J (-37.6%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Code Energy Linter */}
        <div className="liquid-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Code2 size={18} color="#bbf451" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Code Energy Linter</h3>
          </div>

          <p style={{ fontSize: 12, color: 'var(--c-sage)', marginBottom: 14 }}>
            Detect PCIe memory thrashing, unvectorized Python loops, and GPU stall states.
          </p>

          <textarea
            value={codeSample}
            onChange={(e) => setCodeSample(e.target.value)}
            rows={10}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 14,
              background: 'rgba(2, 13, 14, 0.85)',
              border: '1px solid rgba(35, 83, 71, 0.6)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#DAF1DE',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical'
            }}
          />

          <button
            className="neon-pill-btn"
            onClick={handleAnalyzeCode}
            style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
          >
            <Sparkles size={16} />
            <span>Analyze & Optimize Energy AST</span>
          </button>

          {analyzed && (
            <div style={{
              marginTop: 20,
              padding: 18,
              borderRadius: 14,
              background: 'rgba(35, 83, 71, 0.4)',
              border: '1px solid rgba(187, 244, 81, 0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckCircle2 size={16} color="#bbf451" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                  Optimization Detected: {simulatedSavings}% Energy Reduction
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--c-sage)', lineHeight: 1.5 }}>
                • Eliminated redundant <code>t.cpu().numpy()</code> tensor device transfer.<br />
                • Fused element-wise addition and square into a single GPU Triton kernel.<br />
                • Estimated energy savings: <strong>~1,120 Joules / 10k iterations</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
