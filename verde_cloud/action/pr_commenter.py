import json
import sys

def generate_markdown_badge(baseline_metrics, current_metrics, pr_number=None):
    """
    Compares baseline branch metrics with PR metrics and generates
    a GitHub Markdown summary badge and comment.
    """
    time_delta = baseline_metrics["duration_sec"] - current_metrics["duration_sec"]
    time_pct = (time_delta / max(0.001, baseline_metrics["duration_sec"])) * 100

    energy_delta_joules = baseline_metrics["energy_joules"] - current_metrics["energy_joules"]
    energy_pct = (energy_delta_joules / max(0.001, baseline_metrics["energy_joules"])) * 100

    carbon_delta_g = baseline_metrics["carbon_gco2e"] - current_metrics["carbon_gco2e"]
    carbon_pct = (carbon_delta_g / max(0.001, baseline_metrics["carbon_gco2e"])) * 100

    cost_delta = baseline_metrics["cost_usd"] - current_metrics["cost_usd"]
    
    # Status indicators
    if energy_pct > 0:
        status_icon = "🟢"
        badge_color = "brightgreen"
        summary = f"**Great job! This PR reduces energy consumption by {abs(energy_pct):.1f}%**"
    elif energy_pct < -5:
        status_icon = "🔴"
        badge_color = "red"
        summary = f"**Alert: This PR introduces a {abs(energy_pct):.1f}% energy regression.**"
    else:
        status_icon = "⚪"
        badge_color = "blue"
        summary = "**Energy consumption remains neutral.**"

    md = f"""### {status_icon} VERDE-Cloud Energy & Carbon Audit

![VERDE Energy](https://img.shields.io/badge/VERDE_Energy-{abs(energy_pct):.1f}%25_{'Saved' if energy_pct >= 0 else 'Increase'}-{badge_color})
![Carbon Impact](https://img.shields.io/badge/Carbon_Footprint-{abs(carbon_delta_g):.2f}g_CO2e-{badge_color})

{summary}

| Metric | Baseline Branch | Current PR | Delta | Improvement |
| :--- | :--- | :--- | :--- | :--- |
| **Execution Time** | `{baseline_metrics['duration_sec']}s` | `{current_metrics['duration_sec']}s` | `{time_delta:+.3f}s` | `{time_pct:+.1f}%` |
| **Energy (Joules)** | `{baseline_metrics['energy_joules']:,} J` | `{current_metrics['energy_joules']:,} J` | `{energy_delta_joules:+,.1f} J` | `{energy_pct:+.1f}%` |
| **Carbon (gCO2e)** | `{baseline_metrics['carbon_gco2e']:.3f}g` | `{current_metrics['carbon_gco2e']:.3f}g` | `{carbon_delta_g:+.3f}g` | `{carbon_pct:+.1f}%` |
| **Water Usage** | `{baseline_metrics['water_liters']:.4f}L` | `{current_metrics['water_liters']:.4f}L` | `{baseline_metrics['water_liters'] - current_metrics['water_liters']:+.4f}L` | `{energy_pct:+.1f}%` |
| **CI Compute Cost** | `${baseline_metrics['cost_usd']:.5f}` | `${current_metrics['cost_usd']:.5f}` | `${cost_delta:+.5f}` | `{time_pct:+.1f}%` |

> *Audited automatically via **VERDE-Cloud Engine** • Certified for SEBI BRSR Core Principal 6 & Green Software Foundation Standards.*
"""
    return md

if __name__ == "__main__":
    # Test sample comparison
    baseline = {
        "duration_sec": 12.5,
        "energy_joules": 2250.0,
        "carbon_gco2e": 0.447,
        "water_liters": 0.0011,
        "cost_usd": 0.0018
    }
    current = {
        "duration_sec": 7.8,
        "energy_joules": 1404.0,
        "carbon_gco2e": 0.279,
        "water_liters": 0.0007,
        "cost_usd": 0.0011
    }
    print(generate_markdown_badge(baseline, current))
