import json

# Cloud Provider Hourly Rates & Carbon Equivalencies
# Standard On-Demand Pricing (USD) across major clouds for AI/Compute workloads
CLOUD_PRICING_CATALOG = {
    "aws": {
        "m5.large": 0.096,
        "c5.xlarge": 0.17,
        "c5.4xlarge": 0.68,
        "g4dn.xlarge": 0.526,
        "p3.2xlarge": 3.06,
        "p4d.24xlarge": 32.77
    },
    "gcp": {
        "n2-standard-4": 0.194,
        "n2-standard-16": 0.776,
        "a2-highgpu-1g": 3.67
    },
    "azure": {
        "Standard_D4s_v5": 0.192,
        "Standard_NC6s_v3": 3.06
    }
}

class VerdeGainShareEngine:
    """
    Pillar 2: Gain-Share Savings & Transparent Billing Engine.
    Calculates enterprise compute savings achieved by VERDE optimizations,
    and applies a non-intrusive 20% gain-share invoice model.
    """
    def __init__(self, commission_rate=0.20):
        self.commission_rate = commission_rate

    def calculate_savings(self, workload_name, cloud_provider, instance_type, 
                          baseline_runtime_hours_per_month, optimized_runtime_hours_per_month,
                          throttling_hours_avoided=0.0, avg_throttling_penalty_pct=0.35):
        hourly_rate = CLOUD_PRICING_CATALOG.get(cloud_provider.lower(), {}).get(instance_type, 0.25)
        
        baseline_monthly_spend = baseline_runtime_hours_per_month * hourly_rate
        optimized_monthly_spend = optimized_runtime_hours_per_month * hourly_rate
        gross_monthly_savings = max(0.0, baseline_monthly_spend - optimized_monthly_spend)
        
        # [UPGRADED] Thermal Throttling Loss Avoided Ledger
        # When GPUs thermal-throttle, compute throughput drops by 30-45% while paying full hourly cloud rate.
        throttling_loss_avoided_usd = throttling_hours_avoided * hourly_rate * avg_throttling_penalty_pct
        total_value_delivered = gross_monthly_savings + throttling_loss_avoided_usd

        verde_fee = total_value_delivered * self.commission_rate
        net_client_savings = total_value_delivered - verde_fee
        roi_percentage = (net_client_savings / max(0.01, verde_fee)) * 100 if verde_fee > 0 else 0.0

        return {
            "workload": workload_name,
            "cloud": cloud_provider.upper(),
            "instance": instance_type,
            "hourly_rate_usd": hourly_rate,
            "baseline_spend_monthly_usd": round(baseline_monthly_spend, 2),
            "optimized_spend_monthly_usd": round(optimized_monthly_spend, 2),
            "gross_savings_monthly_usd": round(gross_monthly_savings, 2),
            "throttling_hours_avoided": round(throttling_hours_avoided, 1),
            "throttling_loss_avoided_usd": round(throttling_loss_avoided_usd, 2),
            "total_value_delivered_usd": round(total_value_delivered, 2),
            "annualized_gross_savings_usd": round(total_value_delivered * 12, 2),
            "verde_gainshare_fee_20pct_usd": round(verde_fee, 2),
            "net_client_savings_monthly_usd": round(net_client_savings, 2),
            "client_roi_pct": round(roi_percentage, 1)
        }

    def generate_invoice_summary(self, savings_report):
        return f"""============================================================
           VERDE-CLOUD GAIN-SHARE BILLING SUMMARY
============================================================
Workload:               {savings_report['workload']} ({savings_report['cloud']} - {savings_report['instance']})
Monthly Baseline Spend: ${savings_report['baseline_spend_monthly_usd']:,}
Monthly Optimized Spend:${savings_report['optimized_spend_monthly_usd']:,}
------------------------------------------------------------
Total Gross Savings:    ${savings_report['gross_savings_monthly_usd']:,} / month
Annualized Run-Rate:    ${savings_report['annualized_gross_savings_usd']:,} / year
VERDE 20% Success Fee:  ${savings_report['verde_gainshare_fee_20pct_usd']:,}
NET CLIENT CASH SAVED:  ${savings_report['net_client_savings_monthly_usd']:,} / month
Client Immediate ROI:   {savings_report['client_roi_pct']}%
============================================================"""

if __name__ == "__main__":
    engine = VerdeGainShareEngine(commission_rate=0.20)
    # Example: 100 GPU nodes training an LLM pipeline 720 hours/month
    report = engine.calculate_savings(
        workload_name="Distributed Transformer Inference & Training Cluster",
        cloud_provider="aws",
        instance_type="g4dn.xlarge",
        baseline_runtime_hours_per_month=720 * 50, # 50 instances running all month
        optimized_runtime_hours_per_month=720 * 32 # reduced to 32 instances through VERDE operator fusion
    )
    print(engine.generate_invoice_summary(report))
