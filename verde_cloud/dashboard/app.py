import streamlit as st
import pandas as pd
import numpy as np
import json
import os
import sys

# Add parent directory to path to import verde_cloud modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from verde_cloud.action.profiler import VerdeTelemetryProfiler
from verde_cloud.gainshare.cost_engine import VerdeGainShareEngine, CLOUD_PRICING_CATALOG
from verde_cloud.compliance.brsr_reporter import SebiBrsrAuditReporter

# Page configuration
st.set_page_config(
    page_title="VERDE-Cloud | GreenOps & Carbon Admin Portal",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E4D2B;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #4A5568;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
        border: 1px solid #BBF7D0;
        border-radius: 12px;
        padding: 1.2rem;
        text-align: center;
    }
    .badge-pill {
        background-color: #22C55E;
        color: white;
        padding: 4px 12px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.image("https://img.shields.io/badge/VERDE--Cloud-v1.0.0-1E4D2B?style=for-the-badge&logo=leaf", use_container_width=True)
    st.markdown("### Navigation")
    menu = st.radio(
        "Go to Section",
        ["📊 Executive Overview", "⚡ CI/CD Telemetry (Pillar 1)", "💰 Gain-Share Financials (Pillar 2)", "📜 SEBI BRSR Compliance (Pillar 3)", "🚀 Marketplace Onboarding (Pillar 4)"]
    )
    st.divider()
    st.markdown("#### Cloud Grid Selection")
    grid_region = st.selectbox("Grid Carbon Intensity Region", ["IN_NATIONAL (716 gCO2e/kWh)", "IN_WESTERN (740 gCO2e/kWh)", "IN_SOUTHERN (680 gCO2e/kWh)", "US_EAST (379 gCO2e/kWh)"])
    st.markdown("#### Active Enterprise")
    st.caption("Acme Technologies India Ltd\nListing: NSE / BSE Top 1,000")

# 1. Executive Overview
if menu == "📊 Executive Overview":
    st.markdown('<div class="main-header">🌱 VERDE-Cloud GreenOps Executive Portal</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Real-time compute energy auditing, cloud cost savings, and ESG regulatory assurance</div>', unsafe_allow_html=True)

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Cloud Dollars Saved", "$40,901 / yr", "+36% Efficiency")
    with col2:
        st.metric("Clean Energy Conserved", "310 MWh", "1.116 GJ")
    with col3:
        st.metric("Avoided Carbon Footprint", "221.9 tCO2e", "-36% Scope 2")
    with col4:
        st.metric("Datacenter Water Saved", "558,000 Liters", "WUE 1.8 L/kWh")

    st.divider()
    
    st.subheader("Monthly Savings & Emission Trajectory")
    months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov (Current)"]
    chart_data = pd.DataFrame({
        "Month": months,
        "Baseline Spend ($)": [14200, 15100, 16800, 17200, 18500, 19000],
        "VERDE-Optimized Spend ($)": [9900, 10200, 11100, 11400, 12100, 12400],
        "Carbon Emitted (tCO2e)": [32.4, 34.1, 38.2, 39.1, 41.5, 27.2]
    }).set_index("Month")
    
    col_chart1, col_chart2 = st.columns(2)
    with col_chart1:
        st.line_chart(chart_data[["Baseline Spend ($)", "VERDE-Optimized Spend ($)"]])
    with col_chart2:
        st.bar_chart(chart_data[["Carbon Emitted (tCO2e)"]])

# 2. Pillar 1: CI/CD Telemetry & PR Audit Badges
elif menu == "⚡ CI/CD Telemetry (Pillar 1)":
    st.subheader("⚡ Pillar 1: CI/CD Telemetry & Pull Request Impact")
    st.markdown("Inspect code-level energy, Joules, and carbon footprints automatically verified in GitHub Actions.")

    col_pr1, col_pr2 = st.columns([1, 1])
    with col_pr1:
        st.markdown("#### Test a Live Workload Profiling")
        selected_instance = st.selectbox("Instance Type", ["c5.xlarge", "c5.4xlarge", "g4dn.xlarge", "p3.2xlarge", "p4d.24xlarge"])
        cpu_load = st.slider("Simulated Workload CPU/GPU Utilization (%)", 10, 100, 80)
        
        if st.button("▶ Run VERDE Telemetry Profiler"):
            profiler = VerdeTelemetryProfiler(instance_type=selected_instance, region="IN_NATIONAL")
            profiler.start()
            _ = sum(i * i for i in range(1_500_000))
            metrics = profiler.stop(avg_cpu_utilization=cpu_load / 100.0)
            st.session_state["recent_metrics"] = metrics
            st.success("Workload profiled successfully!")

    with col_pr2:
        st.markdown("#### Simulated PR Comment Output")
        m = st.session_state.get("recent_metrics", {
            "instance_type": selected_instance,
            "duration_sec": 7.82,
            "energy_joules": 1404.0,
            "carbon_gco2e": 0.279,
            "water_liters": 0.0007,
            "cost_usd": 0.0011
        })
        st.markdown(f"""
        > ### 🟢 VERDE-Cloud Energy & Carbon Audit
        > **PR Status:** Reduces energy consumption by **35.2%**
        > 
        > | Metric | Baseline | Current PR | Savings |
        > | :--- | :--- | :--- | :--- |
        > | **Duration** | `12.1s` | `{m['duration_sec']}s` | `-35.2%` |
        > | **Energy (J)** | `2,160 J` | `{m['energy_joules']} J` | `-756 J` |
        > | **Carbon** | `0.430g` | `{m['carbon_gco2e']}g` | `-0.151g CO2e` |
        > | **CI Cost** | `$0.0017` | `${m['cost_usd']}` | `-$0.0006` |
        """)

# 3. Pillar 2: Gain-Share Financials
elif menu == "💰 Gain-Share Financials (Pillar 2)":
    st.subheader("💰 Pillar 2: Gain-Share Financial Modeling & Invoicing")
    st.markdown("Transparent financial calculator: Zero upfront fee, 20% commission on verified cloud savings.")

    col_fin1, col_fin2 = st.columns(2)
    with col_fin1:
        st.markdown("#### Interactive Enterprise Savings Calculator")
        cloud = st.selectbox("Cloud Provider", ["AWS", "GCP", "Azure"])
        instances = list(CLOUD_PRICING_CATALOG[cloud.lower()].keys())
        instance = st.selectbox("Compute / GPU Instance", instances)
        baseline_instances = st.number_input("Baseline Instances Running Concurrently", min_value=1, max_value=500, value=25)
        optimized_instances = st.number_input("Optimized Instances after VERDE Tuning", min_value=1, max_value=500, value=16)
        hours_per_month = st.slider("Monthly Runtime Hours per Instance", 100, 720, 720)

    engine = VerdeGainShareEngine(commission_rate=0.20)
    rep = engine.calculate_savings(
        workload_name=f"{cloud} Production AI Cluster",
        cloud_provider=cloud,
        instance_type=instance,
        baseline_runtime_hours_per_month=hours_per_month * baseline_instances,
        optimized_runtime_hours_per_month=hours_per_month * optimized_instances
    )

    with col_fin2:
        st.markdown("#### Real-time Billing Breakdown")
        st.metric("Gross Monthly Savings", f"${rep['gross_savings_monthly_usd']:,}", f"Annualized: ${rep['annualized_gross_savings_usd']:,}")
        st.metric("VERDE 20% Success Fee", f"${rep['verde_gainshare_fee_20pct_usd']:,}", "Only on verified savings")
        st.metric("Net Cash Saved by Client", f"${rep['net_client_savings_monthly_usd']:,}", f"Client ROI: {rep['client_roi_pct']}%")

    st.code(engine.generate_invoice_summary(rep), language="text")

# 4. Pillar 3: SEBI BRSR Compliance
elif menu == "📜 SEBI BRSR Compliance (Pillar 3)":
    st.subheader("📜 Pillar 3: SEBI BRSR Core & ESG Compliance Engine")
    st.markdown("Certified disclosures for Principal 6 (Environment) mandated by SEBI for the Top 1,000 listed entities.")

    reporter = SebiBrsrAuditReporter("Acme Technologies India Ltd", "FY 2026-27")
    brsr_data = reporter.generate_principal_6_report(total_kwh_consumed=1_250_000, total_kwh_saved=420_000, turnover_inr_crores=250.0)

    st.markdown(reporter.render_markdown(brsr_data))
    
    st.download_button(
        label="📥 Download Official SEBI BRSR Principal 6 Audit (Markdown)",
        data=reporter.render_markdown(brsr_data),
        file_name="SEBI_BRSR_Principal_6_Audit.md",
        mime="text/markdown"
    )

# 5. Pillar 4: Marketplace Onboarding
elif menu == "🚀 Marketplace Onboarding (Pillar 4)":
    st.subheader("🚀 Pillar 4: Cloud Marketplace & Zero-Procurement Delivery")
    st.markdown("Enterprises purchase VERDE-Cloud directly with existing AWS/Azure/GCP commit credits.")

    col_m1, col_m2 = st.columns(2)
    with col_m1:
        st.markdown("#### Cloud Distribution Channels")
        st.success("✅ AWS Marketplace — Ready to Deploy (1-Click SaaS / Helm)")
        st.success("✅ Google Cloud Marketplace — Listing Manifest Active")
        st.success("✅ Microsoft Azure Marketplace — Enterprise Agreement Eligible")
        
        st.markdown("#### Quickstart Kubernetes Helm Deployment")
        st.code("""helm repo add verde-cloud https://charts.verde-cloud.io
helm install verde-operator verde-cloud/verde-operator \\
  --set clusterName=prod-k8s-cluster \\
  --set region=IN_WESTERN \\
  --set gainShareCommission=0.20""", language="bash")

    with col_m2:
        st.markdown("#### Package Manifest (`marketplace_manifest.json`)")
        manifest_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "marketplace", "marketplace_manifest.json")
        if os.path.exists(manifest_path):
            with open(manifest_path, "r") as f:
                st.json(json.load(f))
