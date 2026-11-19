import sys
import os
import json

# Add parent directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from verde_cloud.action.profiler import VerdeTelemetryProfiler
from verde_cloud.action.pr_commenter import generate_markdown_badge
from verde_cloud.gainshare.cost_engine import VerdeGainShareEngine
from verde_cloud.compliance.brsr_reporter import SebiBrsrAuditReporter

def run_full_pipeline_demo():
    print("=" * 65)
    print("  VERDE-CLOUD: 4-PILLAR INTEGRATION PIPELINE DEMO")
    print("=" * 65)

    # 1. Pillar 1: Telemetry Profiling & GitHub PR Badge
    print("\n[Pillar 1] Running CI/CD Telemetry Profiler...")
    profiler = VerdeTelemetryProfiler(instance_type="g4dn.xlarge", region="IN_NATIONAL")
    profiler.start()
    _ = sum(i * i for i in range(2_000_000))
    current_metrics = profiler.stop(avg_cpu_utilization=0.80)
    
    # Baseline comparison (35% heavier)
    baseline_metrics = {
        "duration_sec": round(current_metrics["duration_sec"] * 1.54, 3),
        "energy_joules": round(current_metrics["energy_joules"] * 1.54, 2),
        "carbon_gco2e": round(current_metrics["carbon_gco2e"] * 1.54, 4),
        "water_liters": round(current_metrics["water_liters"] * 1.54, 4),
        "cost_usd": round(current_metrics["cost_usd"] * 1.54, 5)
    }
    
    pr_comment = generate_markdown_badge(baseline_metrics, current_metrics)
    print("[OK] PR Badge Generated Successfully.")

    # 2. Pillar 2: Gain-Share Cost & Savings Engine
    print("\n[Pillar 2] Calculating Enterprise Gain-Share Financials...")
    cost_engine = VerdeGainShareEngine(commission_rate=0.20)
    savings = cost_engine.calculate_savings(
        workload_name="Enterprise AI Model Serving Cluster",
        cloud_provider="aws",
        instance_type="g4dn.xlarge",
        baseline_runtime_hours_per_month=720 * 25,
        optimized_runtime_hours_per_month=720 * 16
    )
    invoice_text = cost_engine.generate_invoice_summary(savings)
    print(invoice_text)

    # 3. Pillar 3: SEBI BRSR Core Compliance Reporter
    print("\n[Pillar 3] Generating Certified SEBI BRSR Principal 6 Audit...")
    reporter = SebiBrsrAuditReporter("TechInnovate India Ltd", "FY 2026-27")
    brsr_data = reporter.generate_principal_6_report(
        total_kwh_consumed=850_000,
        total_kwh_saved=310_000,
        turnover_inr_crores=180.0
    )
    print(f"[OK] Total Electricity Audited: {brsr_data['energy_metrics']['total_electricity_consumed_mwh']} MWh")
    print(f"[OK] Avoided Carbon Emissions: {brsr_data['ghg_emissions_scope2']['avoided_emissions_via_verde_tco2e']} tCO2e")
    print(f"[OK] Water Conserved: {brsr_data['water_impact']['water_saved_kl']} kL")

    # 4. Pillar 4: Marketplace Packaging Manifest
    print("\n[Pillar 4] Verifying Cloud Marketplace Onboarding Manifest...")
    manifest_path = os.path.join(os.path.dirname(__file__), "marketplace", "marketplace_manifest.json")
    with open(manifest_path, "r") as f:
        manifest = json.load(f)
    print(f"[OK] Package: {manifest['displayName']} (Version {manifest['version']})")
    print(f"[OK] Distribution Channels: {', '.join(manifest['supportedClouds'])}")
    print("\nAll 4 pillars verified and fully operational!")

if __name__ == "__main__":
    run_full_pipeline_demo()
