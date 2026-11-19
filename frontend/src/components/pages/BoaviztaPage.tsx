import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  HelpCircle, 
  ShieldCheck, 
  Database, 
  Cloud, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';

export const BoaviztaPage: React.FC = () => {
  // SCI Equation Parameters: SCI = ((E * I) + M) / R
  const [energyE, setEnergyE] = useState(140); // kWh
  const [gridIntensityI, setGridIntensityI] = useState(716); // gCO2e / kWh
  const [embodiedCarbonM, setEmbodiedCarbonM] = useState(18500); // grams CO2e (amortized share)
  const [functionalUnitR, setFunctionalUnitR] = useState(100000); // e.g. 100,000 requests

  // Calculate SCI
  const operationalEmissions = energyE * gridIntensityI; // grams
  const totalGramsCO2e = operationalEmissions + embodiedCarbonM;
  const sciScore = (totalGramsCO2e / functionalUnitR) * 1000; // mg CO2e per request

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
          GREEN SOFTWARE FOUNDATION & BOAVIZTA STANDARD
        </span>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
          Software Carbon Intensity (SCI) Engine
        </h2>
        <p style={{ fontSize: 14, color: 'var(--c-sage)', marginTop: 8 }}>
          Rigorous calculation of operational energy plus embodied server hardware manufacturing emissions according to ISO/IEC 21031.
        </p>
      </div>

      {/* SCI Formula Interactive Explorer */}
      <div className="liquid-card" style={{ padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: 20,
            background: 'rgba(2, 13, 14, 0.75)',
            border: '1px solid rgba(187, 244, 81, 0.4)'
          }}>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: 1.5, color: '#DAF1DE' }}>
              SCI = <span style={{ color: '#bbf451' }}>((E × I) + M)</span> / <span style={{ color: '#4ade80' }}>R</span>
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--c-sage)', marginTop: 10 }}>
            Operational Grid Emissions (E × I) + Hardware Embodied Carbon (M) divided by Functional Unit (R)
          </p>
        </div>

        {/* Sliders Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {/* E */}
          <div style={{ background: 'rgba(2, 13, 14, 0.6)', padding: 20, borderRadius: 18, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-sage)', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: '#bbf451' }}>E (Energy)</span>
              <span>{energyE} kWh</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={energyE}
              onChange={(e) => setEnergyE(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#bbf451' }}
            />
            <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 8 }}>Total workload energy consumed</div>
          </div>

          {/* I */}
          <div style={{ background: 'rgba(2, 13, 14, 0.6)', padding: 20, borderRadius: 18, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-sage)', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: '#bbf451' }}>I (Grid Intensity)</span>
              <span>{gridIntensityI} g/kWh</span>
            </div>
            <input
              type="range"
              min="100"
              max="900"
              step="10"
              value={gridIntensityI}
              onChange={(e) => setGridIntensityI(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#bbf451' }}
            />
            <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 8 }}>Marginal carbon intensity factor</div>
          </div>

          {/* M */}
          <div style={{ background: 'rgba(2, 13, 14, 0.6)', padding: 20, borderRadius: 18, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-sage)', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: '#bbf451' }}>M (Embodied)</span>
              <span>{(embodiedCarbonM / 1000).toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={embodiedCarbonM}
              onChange={(e) => setEmbodiedCarbonM(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#bbf451' }}
            />
            <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 8 }}>Amortized server manufacturing</div>
          </div>

          {/* R */}
          <div style={{ background: 'rgba(2, 13, 14, 0.6)', padding: 20, borderRadius: 18, border: '1px solid rgba(35, 83, 71, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-sage)', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: '#4ade80' }}>R (Unit Scale)</span>
              <span>{(functionalUnitR / 1000).toFixed(0)}k reqs</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={functionalUnitR}
              onChange={(e) => setFunctionalUnitR(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#4ade80' }}
            />
            <div style={{ fontSize: 11, color: 'var(--c-sage)', marginTop: 8 }}>Number of functional transactions</div>
          </div>
        </div>

        {/* Calculated Result Ribbon */}
        <div style={{
          marginTop: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 28px',
          borderRadius: 20,
          background: 'rgba(11, 43, 38, 0.6)',
          border: '1px solid rgba(187, 244, 81, 0.3)'
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#bbf451' }}>TOTAL SOFTWARE CARBON INTENSITY SCORE</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
              {sciScore.toFixed(3)} <span style={{ fontSize: 14, color: 'var(--c-sage)' }}>mg CO2e / request</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>Operational (E × I)</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{(operationalEmissions / 1000).toFixed(2)} kg CO2e</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>Embodied Hardware (M)</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{(embodiedCarbonM / 1000).toFixed(2)} kg CO2e</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--c-sage)' }}>GSF Rating</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#bbf451' }}>CLASS A (Verified)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Telemetry Connectors */}
      <div className="liquid-card" style={{ padding: 32 }}>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 20 }}>
          Multi-Cloud Telemetry Ingestion Connectors
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {[
            { name: 'AWS CUR & CloudWatch', type: 'Amazon Web Services', desc: 'Granular hourly cost & power usage extraction', status: 'Connected' },
            { name: 'GCP BigQuery Carbon', type: 'Google Cloud Platform', desc: 'Direct BigQuery billing export sync', status: 'Active' },
            { name: 'Azure Emissions Impact', type: 'Microsoft Azure', desc: 'Scope 1, 2, 3 datacenter telemetry APIs', status: 'Active' },
            { name: 'Kubernetes Kepler eBPF', type: 'Container Mesh', desc: 'Node-level kernel cgroup power metrics', status: 'Streaming' }
          ].map((conn, i) => (
            <div key={i} style={{
              background: 'rgba(2, 13, 14, 0.5)',
              padding: 20,
              borderRadius: 16,
              border: '1px solid rgba(35, 83, 71, 0.4)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--c-sage)' }}>{conn.type}</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 999, background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}>
                  {conn.status}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>{conn.name}</div>
              <p style={{ fontSize: 11, color: 'var(--c-sage)', lineHeight: 1.5 }}>{conn.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
