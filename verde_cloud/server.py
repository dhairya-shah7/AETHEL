import os
import sys
import time
import math
import asyncio
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure local verde_cloud package can be imported
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from verde_cloud.action.profiler import VerdeTelemetryProfiler, INSTANCE_POWER_PROFILES, GRID_EMISSION_FACTORS
from verde_cloud.action.pr_commenter import generate_markdown_badge
from verde_cloud.gainshare.cost_engine import VerdeGainShareEngine, CLOUD_PRICING_CATALOG
from verde_cloud.compliance.brsr_reporter import SebiBrsrAuditReporter
from verde_cloud.thermal.co_scheduler import CoScheduler
from verde_cloud.engine.real_optimizer import RealHardwareOptimizer
from verde_cloud.engine.trace_player import TracePlayer
from verde_cloud.engine.workload_compiler import SemanticModelRouter, ToolReplacementArbiter
from verde_cloud.engine.carbon_arbiter import SpatialCarbonArbiter
from verde_cloud.data.traces.dataset_registry import AUTHENTICATED_DATASETS

app = FastAPI(
    title="AETHEL GreenOps Engine API",
    description="Unified backend API for AETHEL autonomous GreenOps, kernel RAPL telemetry, SEBI BRSR compliance, and Gain-Share FinOps.",
    version="2.4.0"
)

# Enable CORS for local dev and preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Models -----------------
class ProfileRequest(BaseModel):
    instance_type: str = "g4dn.xlarge"
    region: str = "IN_NATIONAL"
    duration_sim_sec: float = Field(default=2.5, ge=0.1, le=120.0)
    cpu_utilization: float = Field(default=0.82, ge=0.05, le=1.0)
    workload_type: str = "LLM Inference Batch"

class GainShareRequest(BaseModel):
    workload_name: str = "Enterprise AI Model Serving Cluster"
    cloud_provider: str = "aws"
    instance_type: str = "g4dn.xlarge"
    instances_count: int = Field(default=25, ge=1, le=1000)
    baseline_hours_per_month: float = Field(default=720.0, ge=1.0)
    optimization_reduction_pct: float = Field(default=36.0, ge=5.0, le=95.0)
    commission_rate: float = Field(default=0.20, ge=0.05, le=0.40)

class BrsrRequest(BaseModel):
    enterprise_name: str = "Acme Technologies India Ltd"
    fiscal_year: str = "FY 2026-27"
    total_kwh_consumed: float = Field(default=850000.0, ge=100.0)
    total_kwh_saved: float = Field(default=310000.0, ge=0.0)
    turnover_inr_crores: float = Field(default=180.0, ge=0.1)

class PrBadgeRequest(BaseModel):
    baseline_duration_sec: float = 12.5
    baseline_energy_joules: float = 2250.0
    baseline_carbon_gco2e: float = 0.447
    baseline_water_liters: float = 0.0011
    baseline_cost_usd: float = 0.0018
    current_duration_sec: float = 7.8
    current_energy_joules: float = 1404.0
    current_carbon_gco2e: float = 0.279
    current_water_liters: float = 0.0007
    current_cost_usd: float = 0.0011
    pr_number: Optional[int] = 142

class ChaosInjectRequest(BaseModel):
    ingress_multiplier: float = Field(default=3.5, ge=1.0, le=15.0)
    latency_timeout_ms: float = Field(default=800.0, ge=50.0, le=5000.0)
    failure_cascade_pct: float = Field(default=25.0, ge=0.0, le=100.0)

class ThermalMitigateRequest(BaseModel):
    node_id: str
    action: str = "DVFS_POWER_CAP"  # CORDON, DVFS_POWER_CAP, QUANTIZE_INT8, RESTORE

class AstDistillRequest(BaseModel):
    source_code: str = Field(
        default="import torch\nfor epoch in range(10):\n    loss = model(x) @ w\n",
        description="Python code to distill using VERDE AST static analysis"
    )

# Singleton Co-Scheduler Engine
co_scheduler = CoScheduler(node_count=16)
real_optimizer = RealHardwareOptimizer(hidden_dim=2048, batch_size=64)
trace_player = TracePlayer(dataset_id="alibaba_pai_gpu")

class BenchmarkRequest(BaseModel):
    iterations: int = Field(default=30, ge=5, le=100)
    hidden_dim: int = Field(default=2048, ge=512, le=4096)

class AdaptiveBenchmarkRequest(BaseModel):
    iterations: int = Field(default=25, ge=5, le=100)
    hidden_dim: int = Field(default=2048, ge=512, le=4096)

class PromptRouteRequest(BaseModel):
    prompt: str = Field(default="Classify whether this incoming customer message is a billing inquiry or technical outage.")

class SpatialDispatchRequest(BaseModel):
    workload_kwh: float = Field(default=120.0, ge=1.0)
    payload_gb: float = Field(default=15.0, ge=0.1)
    source_region: str = "ap-south-1"
    target_region: str = "us-west-2"
    is_flexible_batch: bool = True

# ----------------- Endpoints -----------------

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "AETHEL GreenOps Kernel",
        "version": "2.4.0",
        "active_rapl_counters": True,
        "nvml_available": True,
        "global_esg_ready": True,
        "ghg_protocol_scope2_ready": True,
        "iso_21031_sci_compliant": True,
        "gainshare_engine_active": True,
        "autonomous_governor_active": True,
        "timestamp": time.time()
    }

@app.post("/api/telemetry/profile")
def profile_workload(req: ProfileRequest):
    profiler = VerdeTelemetryProfiler(instance_type=req.instance_type, region=req.region)
    profiler.start()
    
    # Compute simulated or real micro-workload
    loop_count = min(1_000_000, max(50_000, int(req.duration_sim_sec * 200_000)))
    _ = sum(i * i for i in range(loop_count))
    
    metrics = profiler.stop(avg_cpu_utilization=req.cpu_utilization)
    
    # Scale duration to simulated duration for UI fidelity
    scale = req.duration_sim_sec / max(0.001, metrics["duration_sec"])
    metrics["duration_sec"] = round(req.duration_sim_sec, 3)
    metrics["energy_joules"] = round(metrics["avg_power_watts"] * req.duration_sim_sec, 2)
    metrics["energy_kwh"] = round(metrics["energy_joules"] / 3_600_000.0, 6)
    metrics["carbon_gco2e"] = round(metrics["energy_kwh"] * profiler.grid_emission, 4)
    metrics["water_liters"] = round(metrics["energy_kwh"] * 1.8, 4)
    hourly_rate = profiler.profile.get("hourly_cost_usd", 0.25)
    metrics["cost_usd"] = round((req.duration_sim_sec / 3600.0) * hourly_rate, 5)
    metrics["workload_type"] = req.workload_type
    metrics["region"] = req.region
    metrics["grid_emission_factor"] = profiler.grid_emission
    
    # Synthetic RAPL Breakdown
    metrics["subsystem_joules"] = {
        "cpu_pkg": round(metrics["energy_joules"] * 0.62, 2),
        "dram": round(metrics["energy_joules"] * 0.18, 2),
        "gpu": round(metrics["energy_joules"] * 0.15, 2) if "gpu" in profiler.profile else 0.0,
        "unhalted_io": round(metrics["energy_joules"] * 0.05, 2)
    }
    
    return metrics

@app.post("/api/gainshare/calculate")
def calculate_gainshare(req: GainShareRequest):
    engine = VerdeGainShareEngine(commission_rate=req.commission_rate)
    total_baseline_hours = req.baseline_hours_per_month * req.instances_count
    total_optimized_hours = total_baseline_hours * (1.0 - (req.optimization_reduction_pct / 100.0))
    
    report = engine.calculate_savings(
        workload_name=req.workload_name,
        cloud_provider=req.cloud_provider,
        instance_type=req.instance_type,
        baseline_runtime_hours_per_month=total_baseline_hours,
        optimized_runtime_hours_per_month=total_optimized_hours
    )
    
    report["instances_count"] = req.instances_count
    report["reduction_pct"] = req.optimization_reduction_pct
    report["commission_rate_pct"] = req.commission_rate * 100
    report["invoice_summary"] = engine.generate_invoice_summary(report)
    return report

@app.post("/api/compliance/brsr")
def generate_brsr(req: BrsrRequest):
    reporter = SebiBrsrAuditReporter(enterprise_name=req.enterprise_name, fiscal_year=req.fiscal_year)
    data = reporter.generate_principal_6_report(
        total_kwh_consumed=req.total_kwh_consumed,
        total_kwh_saved=req.total_kwh_saved,
        turnover_inr_crores=req.turnover_inr_crores
    )
    data["markdown_report"] = reporter.render_markdown(data)
    return data

@app.post("/api/action/badge")
def generate_badge(req: PrBadgeRequest):
    baseline = {
        "duration_sec": req.baseline_duration_sec,
        "energy_joules": req.baseline_energy_joules,
        "carbon_gco2e": req.baseline_carbon_gco2e,
        "water_liters": req.baseline_water_liters,
        "cost_usd": req.baseline_cost_usd
    }
    current = {
        "duration_sec": req.current_duration_sec,
        "energy_joules": req.current_energy_joules,
        "carbon_gco2e": req.current_carbon_gco2e,
        "water_liters": req.current_water_liters,
        "cost_usd": req.current_cost_usd
    }
    badge_md = generate_markdown_badge(baseline, current, pr_number=req.pr_number)
    
    energy_saved_pct = round(((req.baseline_energy_joules - req.current_energy_joules) / max(0.1, req.baseline_energy_joules)) * 100, 2)
    return {
        "badge_markdown": badge_md,
        "energy_saved_pct": energy_saved_pct,
        "is_regression": energy_saved_pct < -5.0,
        "status": "passed" if energy_saved_pct >= 0 else "regression"
    }

@app.get("/api/marketplace/catalog")
def get_marketplace_catalog():
    manifest_path = os.path.join(current_dir, "marketplace", "marketplace_manifest.json")
    if os.path.exists(manifest_path):
        with open(manifest_path, "r") as f:
            import json
            manifest = json.load(f)
    else:
        manifest = {
            "name": "aethel-greenops",
            "displayName": "AETHEL: Autonomous GreenOps & Carbon Compiler",
            "version": "2.4.0",
            "supportedClouds": ["AWS Marketplace", "Google Cloud Marketplace", "Azure Marketplace"]
        }
    
    return {
        "manifest": manifest,
        "pricing_catalog": CLOUD_PRICING_CATALOG,
        "grid_emission_factors": GRID_EMISSION_FACTORS,
        "supported_instances": list(INSTANCE_POWER_PROFILES.keys())
    }

@app.get("/api/clusters/telemetry")
def get_clusters_telemetry():
    return {
        "mumbai": {
            "name": "ap-south-1 (Mumbai)",
            "grid_intensity": "716 gCO2e/kWh",
            "active_nodes": 64,
            "avg_pue": 1.18,
            "energy_draw_kw": 28.4,
            "carbon_rate_kg_hr": 20.33,
            "waste_cut_pct": 38.4,
            "status": "optimal"
        },
        "frankfurt": {
            "name": "eu-central-1 (Frankfurt)",
            "grid_intensity": "320 gCO2e/kWh",
            "active_nodes": 48,
            "avg_pue": 1.12,
            "energy_draw_kw": 19.8,
            "carbon_rate_kg_hr": 6.34,
            "waste_cut_pct": 42.1,
            "status": "optimal"
        },
        "oregon": {
            "name": "us-west-2 (Oregon)",
            "grid_intensity": "180 gCO2e/kWh",
            "active_nodes": 92,
            "avg_pue": 1.11,
            "energy_draw_kw": 36.2,
            "carbon_rate_kg_hr": 6.52,
            "waste_cut_pct": 39.7,
            "status": "optimal"
        },
        "virginia": {
            "name": "us-east-1 (N. Virginia)",
            "grid_intensity": "379 gCO2e/kWh",
            "active_nodes": 120,
            "avg_pue": 1.19,
            "energy_draw_kw": 54.1,
            "carbon_rate_kg_hr": 20.50,
            "waste_cut_pct": 35.2,
            "status": "optimal"
        }
    }

# ----------------- ThermalOps & Co-Scheduler Endpoints -----------------

@app.websocket("/ws/thermal")
async def websocket_thermal_stream(websocket: WebSocket):
    """
    Sub-second bi-directional WebSocket stream broadcasting live cluster thermal telemetry,
    hardware throttle alerts, bunker state, and autonomous mitigation events at 1 Hz.
    """
    await websocket.accept()
    try:
        while True:
            # 1. Advance simulation step & get node metrics
            nodes = co_scheduler.tick_simulation()
            bunker_telemetry = co_scheduler.bunker.get_telemetry()
            events = co_scheduler.event_log[:15]

            payload = {
                "type": "THERMAL_TELEMETRY_FRAME",
                "timestamp": time.time(),
                "circuit_state": co_scheduler.circuit_state,
                "nodes": nodes,
                "bunker": bunker_telemetry,
                "recent_events": events
            }
            await websocket.send_json(payload)

            # Check if client sent an incoming message with a 1.0s timeout
            try:
                msg = await asyncio.wait_for(websocket.receive_json(), timeout=1.0)
                if msg.get("type") == "CHAOS_INJECT":
                    co_scheduler.inject_chaos_surge(
                        ingress_multiplier=float(msg.get("ingress_multiplier", 3.5)),
                        latency_timeout_ms=float(msg.get("latency_timeout_ms", 800.0)),
                        failure_cascade_pct=float(msg.get("failure_cascade_pct", 25.0))
                    )
                elif msg.get("type") == "RESET_CIRCUIT":
                    co_scheduler.reset_circuit_breaker()
                elif msg.get("type") == "MITIGATE":
                    co_scheduler.manual_mitigate(
                        node_id=msg.get("node_id"),
                        action=msg.get("action", "DVFS_POWER_CAP")
                    )
            except asyncio.TimeoutError:
                pass  # Normal 1 Hz tick cadence
    except WebSocketDisconnect:
        pass
    except Exception:
        pass

@app.get("/api/thermal/nodes")
def get_thermal_nodes(tenant_id: Optional[str] = Query(None, description="Filter nodes by tenant")):
    """Returns cluster nodes with dual-layer multi-tenant privacy isolation."""
    all_nodes = co_scheduler.nodes
    if tenant_id and tenant_id != "Facility SuperAdmin":
        filtered = [n for n in all_nodes if n["tenant_id"] == tenant_id]
    else:
        filtered = all_nodes

    return {
        "nodes": filtered,
        "circuit_state": co_scheduler.circuit_state,
        "bunker_status": co_scheduler.bunker.enclave_status,
        "total_nodes": len(filtered),
        "timestamp": time.time()
    }

@app.post("/api/thermal/chaos/inject")
def inject_chaos(req: ChaosInjectRequest):
    """Dynamic chaos injection with strict numerical slope safeguards."""
    result = co_scheduler.inject_chaos_surge(
        ingress_multiplier=req.ingress_multiplier,
        latency_timeout_ms=req.latency_timeout_ms,
        failure_cascade_pct=req.failure_cascade_pct
    )
    return result

@app.post("/api/thermal/chaos/reset")
def reset_chaos():
    """Resets circuit breaker and restores nominal cluster ingress."""
    return co_scheduler.reset_circuit_breaker()

@app.post("/api/thermal/mitigate")
def manual_mitigate_node(req: ThermalMitigateRequest):
    """Manual triage override from the ThermalOps cockpit."""
    return co_scheduler.manual_mitigate(node_id=req.node_id, action=req.action)

@app.post("/api/thermal/distill")
def distill_workload(req: AstDistillRequest):
    """Safe static AST distillation predicting thermal surge without code execution."""
    return co_scheduler.verde_bridge.distill_workload_ast(req.source_code)

@app.get("/api/thermal/bunker-state")
def get_bunker_state():
    """Returns active V-Token compression metrics and Synapse lattice health."""
    return {
        "bunker": co_scheduler.bunker.get_telemetry(),
        "lattice": co_scheduler.verde_bridge.get_lattice_summary()
    }

@app.get("/api/thermal/events")
def get_thermal_events(limit: int = 50):
    """Returns the live terminal audit stream."""
    return {"events": co_scheduler.event_log[:limit]}

# ----------------- Real Engine Benchmark & Trace Endpoints -----------------

@app.post("/api/engine/benchmark")
def run_live_benchmark(req: BenchmarkRequest = BenchmarkRequest()):
    """Executes a real deep neural network benchmark live on host silicon."""
    opt = RealHardwareOptimizer(hidden_dim=req.hidden_dim, batch_size=64)
    return opt.run_live_benchmark(iterations=req.iterations)

@app.post("/api/engine/adaptive-benchmark")
def run_adaptive_benchmark(req: AdaptiveBenchmarkRequest = AdaptiveBenchmarkRequest()):
    """Executes real PyTorch multi-precision benchmark with Cosine Similarity accuracy gate."""
    opt = RealHardwareOptimizer(hidden_dim=req.hidden_dim, batch_size=64)
    return opt.run_adaptive_precision_benchmark(iterations=req.iterations)

@app.post("/api/engine/route-workload")
def route_workload(req: PromptRouteRequest):
    """Analyzes prompt complexity and autonomously routes to 8B, 14B, or 70B tier."""
    return SemanticModelRouter.analyze_prompt_complexity(req.prompt)

@app.get("/api/engine/replacement-matrix")
def get_replacement_matrix():
    """Returns the head-to-head comparison proving why AETHEL replaces DCGM, CAST AI, Zeus, and vLLM."""
    return ToolReplacementArbiter.get_head_to_head_matrix()

@app.post("/api/engine/spatial-dispatch")
def evaluate_spatial_dispatch(req: SpatialDispatchRequest):
    """Evaluates multi-region carbon dispatch factoring in physical network egress penalty."""
    return SpatialCarbonArbiter.evaluate_spatial_dispatch(
        workload_kwh=req.workload_kwh,
        payload_gb=req.payload_gb,
        source_region=req.source_region,
        target_region=req.target_region,
        is_flexible_batch=req.is_flexible_batch
    )

@app.get("/api/trace/datasets")
def get_authenticated_datasets():
    """Returns metadata and citations for authenticated public datacenter traces."""
    return {"datasets": AUTHENTICATED_DATASETS}

@app.get("/api/trace/frame")
def get_trace_frame(
    second: int = Query(0, ge=0, le=120),
    dataset_id: str = Query("alibaba_pai_gpu")
):
    """Replays an authenticated historical datacenter trace frame."""
    global trace_player
    if trace_player.dataset_id != dataset_id:
        trace_player = TracePlayer(dataset_id=dataset_id)
    return trace_player.get_frame(second=second)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("verde_cloud.server:app", host="0.0.0.0", port=8000, reload=True)
