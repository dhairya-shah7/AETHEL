import React, { useState } from 'react';
import { 
  Store, 
  Cloud, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const helmSnippet = `helm repo add aethel https://charts.aethel.io
helm install aethel-greenops aethel/kernel-daemon \\
  --namespace greenops --create-namespace \\
  --set rapl.enabled=true \\
  --set nvml.enabled=true \\
  --set cluster.region="ap-south-1"`;

  const terraformSnippet = `module "aethel_greenops" {
  source  = "aethel/greenops/aws"
  version = "~> 2.4.0"

  cluster_name     = "production-eks-mumbai"
  gainshare_tier   = "enterprise_15"
  enable_sebi_brsr = true
}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#bbf451' }}>
          PILLAR 4: ENTERPRISE DISTRIBUTION & MARKETPLACE
        </span>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
          Cloud Marketplace & Deployment Hub
        </h2>
        <p style={{ fontSize: 14, color: 'var(--c-sage)', marginTop: 8 }}>
          Procure and deploy AETHEL through existing AWS, Google Cloud, and Azure commitments with unified billing drawdown and automated metering.
        </p>
      </div>

      {/* Cloud Marketplace Offerings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {/* AWS */}
        <div className="liquid-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#bbf451' }}>AWS MARKETPLACE</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}>
              EDP Eligible
            </span>
          </div>
          <h4 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
            AETHEL for Amazon EKS & EC2
          </h4>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--c-sage)', marginBottom: 24 }}>
            Direct drawdown against AWS Enterprise Discount Program (EDP). Ingests CUR and CloudWatch metrics with zero custom agent daemon installation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>Gain-Share (15-20%)</span>
            <button className="glass-outline-btn" style={{ padding: '8px 16px', fontSize: 12 }}>
              Subscribe on AWS <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {/* GCP */}
        <div className="liquid-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#bbf451' }}>GOOGLE CLOUD</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}>
              Committed Use
            </span>
          </div>
          <h4 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
            AETHEL for GKE & Vertex AI
          </h4>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--c-sage)', marginBottom: 24 }}>
            100% drawdown against Google Cloud Committed Use Discounts. Built-in BigQuery export integration for carbon accounting.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>Gain-Share (15-20%)</span>
            <button className="glass-outline-btn" style={{ padding: '8px 16px', fontSize: 12 }}>
              Subscribe on GCP <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {/* Azure */}
        <div className="liquid-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#bbf451' }}>AZURE MARKETPLACE</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}>
              MACC Eligible
            </span>
          </div>
          <h4 style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
            AETHEL for AKS & Azure OpenAI
          </h4>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--c-sage)', marginBottom: 24 }}>
            Count 100% of your AETHEL spend toward your Microsoft Azure Consumption Commitment (MACC). Native Azure Emissions API integration.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>Gain-Share (15-20%)</span>
            <button className="glass-outline-btn" style={{ padding: '8px 16px', fontSize: 12 }}>
              Subscribe on Azure <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Deployment Snippets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Helm */}
        <div className="liquid-card" style={{ padding: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal size={16} color="#bbf451" />
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Kubernetes Helm DaemonSet</h4>
            </div>
            <button
              onClick={() => copy(helmSnippet, 'helm')}
              className="glass-outline-btn"
              style={{ padding: '6px 12px', fontSize: 11 }}
            >
              {copiedSnippet === 'helm' ? <Check size={12} color="#4ade80" /> : <Copy size={12} />}
              <span>{copiedSnippet === 'helm' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre style={{
            background: 'rgba(2, 13, 14, 0.9)',
            padding: 16,
            borderRadius: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            lineHeight: 1.5,
            color: '#DAF1DE',
            border: '1px solid rgba(35, 83, 71, 0.5)',
            overflowX: 'auto'
          }}>
            {helmSnippet}
          </pre>
        </div>

        {/* Terraform */}
        <div className="liquid-card" style={{ padding: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={16} color="#bbf451" />
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Terraform Infrastructure as Code</h4>
            </div>
            <button
              onClick={() => copy(terraformSnippet, 'tf')}
              className="glass-outline-btn"
              style={{ padding: '6px 12px', fontSize: 11 }}
            >
              {copiedSnippet === 'tf' ? <Check size={12} color="#4ade80" /> : <Copy size={12} />}
              <span>{copiedSnippet === 'tf' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre style={{
            background: 'rgba(2, 13, 14, 0.9)',
            padding: 16,
            borderRadius: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            lineHeight: 1.5,
            color: '#DAF1DE',
            border: '1px solid rgba(35, 83, 71, 0.5)',
            overflowX: 'auto'
          }}>
            {terraformSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
