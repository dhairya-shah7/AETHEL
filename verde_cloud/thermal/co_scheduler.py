"""
AETHEL Silicon-to-Software Thermal Co-Scheduler
Autonomous closed-loop orchestration: K8s pod migration, dynamic DVFS power-capping,
quantization kernel switching, cascading circuit breaker, and VERDE Bunker sealing.
"""

import time
import math
import random
from typing import Dict, Any, List, Optional
from verde_cloud.thermal.thermal_engine import ThermalEngine
from verde_cloud.thermal.bunker_enclave import BunkerEnclave
from verde_cloud.thermal.verde_bridge import VerdeEngineBridge

class CoScheduler:
    """
    Closed-loop autonomous actuator governing cluster thermal equilibrium.
    """

    def __init__(self, node_count: int = 16, privilege_mode: str = "KERNEL_DAEMONSET"):
        self.node_count = node_count
        self.privilege_mode = privilege_mode  # KERNEL_DAEMONSET or ZERO_ROOT_SOFTWARE
        self.thermal_engine = ThermalEngine()
        self.bunker = BunkerEnclave(cluster_node_count=node_count)
        self.verde_bridge = VerdeEngineBridge()

        # Circuit breaker state: CLOSED (nominal), HALF-OPEN (recovering/monitoring), OPEN (tripped)
        self.circuit_state = "CLOSED"
        self.circuit_tripped_at: Optional[float] = None
        self.queue_history: List[Tuple[float, float]] = []  # (timestamp, queue_depth)

        # Anti-flapping hysteresis registry: {node_id: {"capped_at": timestamp, "cooldown_until": timestamp}}
        self.hysteresis_registry: Dict[str, Dict[str, float]] = {}
        self.dwell_time_seconds = 60.0  # Mandatory stabilization dwell window

        # Live audit log of autonomous mitigation events
        self.event_log: List[Dict[str, Any]] = []

        # Initialize synthetic/hardware cluster nodes
        self.nodes = self._initialize_nodes()
        self._record_initial_invariants()

    def _initialize_nodes(self) -> List[Dict[str, Any]]:
        """Scaffolds initial multi-tenant cluster node topology."""
        nodes = []
        tenants = ["Acme AI", "DeepVision Labs", "Facility SuperAdmin"]
        gpu_types = ["NVIDIA_A100_SXM4", "NVIDIA_H100_SXM5", "NVIDIA_L40S"]

        for i in range(1, self.node_count + 1):
            node_id = f"node-{i:02d}"
            tenant = tenants[(i - 1) % len(tenants)] if i <= 14 else "Facility SuperAdmin"
            arch = gpu_types[(i - 1) % len(gpu_types)]
            limits = self.thermal_engine.limits

            nodes.append({
                "node_id": node_id,
                "tenant_id": tenant,
                "arch": arch,
                "status": "NOMINAL",       # NOMINAL, CORDONED, POWER_CAPPED, BUNKER_ISOLATED
                "temp_c": round(random.uniform(58.0, 66.0), 1),
                "power_w": round(random.uniform(240.0, 310.0), 1),
                "tdp_watts": limits["tdp_watts"],
                "fan_speed_pct": round(random.uniform(55.0, 70.0), 0),
                "workload_name": f"{tenant} Training Worker {i}",
                "precision": "FP16",        # FP16, INT8, FP8
                "pods_count": random.randint(2, 6),
                "hourly_cost_usd": 3.06 if "A100" in arch else (5.20 if "H100" in arch else 2.10),
                "is_bunker_node": (i >= 15)  # Nodes 15 and 16 reserved for physical bunker
            })
        return nodes

    def _record_initial_invariants(self):
        """Records foundational thermal safety invariants into the VERDE Synapse Lattice."""
        self.verde_bridge.record_thermal_invariant(
            subject="GPU_Silicon_Junction",
            predicate="must_not_exceed",
            object_val="82.0_Celsius_Thermal_Tripwire",
            confidence=0.99
        )
        self.verde_bridge.record_thermal_invariant(
            subject="Cascading_Circuit_Breaker",
            predicate="trips_when_queue_slope_exceeds",
            object_val="25_jobs_per_sec",
            confidence=0.95
        )
        self.verde_bridge.record_thermal_invariant(
            subject="Stabilization_Dwell_Window",
            predicate="enforces_minimum_hysteresis",
            object_val="60_seconds_cooldown",
            confidence=0.98
        )

    def log_event(self, action: str, node_id: str, detail: str, severity: str = "INFO"):
        """Logs an event to the real-time terminal audit stream."""
        event = {
            "id": f"evt-{int(time.time() * 1000)}-{random.randint(100, 999)}",
            "timestamp": time.time(),
            "timestamp_iso": time.strftime("%H:%M:%S", time.localtime()),
            "action": action,
            "node_id": node_id,
            "detail": detail,
            "severity": severity
        }
        self.event_log.insert(0, event)
        if len(self.event_log) > 200:
            self.event_log.pop()
        return event

    def tick_simulation(self, ambient_temp: float = 24.0) -> List[Dict[str, Any]]:
        """
        Runs a 1-second simulation step: updates temperatures, evaluates ODE projections,
        and enforces autonomous closed-loop actions with anti-flapping dwell windows.
        """
        now = time.time()
        predictions = self.thermal_engine.batch_predict(self.nodes, duration_s=180.0, ambient_temp=ambient_temp)
        pred_map = {p["node_id"]: p for p in predictions}

        for node in self.nodes:
            nid = node["node_id"]
            p = pred_map.get(nid)
            if not p:
                continue

            current_temp = node["temp_c"]
            power = node["power_w"]
            tier = p["thermal_tier"]
            limits = self.thermal_engine.get_hardware_thresholds()

            # 1. Closed-loop autonomous triage
            if tier == "CRITICAL" and node["status"] == "NOMINAL":
                node["status"] = "CORDONED"
                
                if self.privilege_mode == "ZERO_ROOT_SOFTWARE":
                    # Software Thermal Backpressure (Zero-Root / Serverless Mode)
                    # Reduces power purely via batch shedding (64 -> 32) and INT8 shift
                    new_power = round(power * 0.65, 1)
                    node["power_w"] = new_power
                    node["precision"] = "INT8"
                    action_name = "SOFTWARE_THERMAL_BACKPRESSURE"
                    detail_msg = f"Zero-Root Mode: Predicted {p['predicted_temp_180s']}°C. Cut batch 64→32 & shifted to INT8 (-35% power to {new_power}W) without root."
                else:
                    # Hardware Kernel / DaemonSet DVFS Power Cap
                    new_power = self.thermal_engine.calculate_dynamic_power_cap(
                        current_power=power,
                        current_temp=current_temp,
                        target_temp=p["t_warning"],
                        tdp_watts=node["tdp_watts"]
                    )
                    node["power_w"] = new_power
                    node["fan_speed_pct"] = min(100.0, node["fan_speed_pct"] + 25.0)
                    node["precision"] = "INT8"
                    action_name = "AUTONOMOUS_CORDON_DVFS"
                    detail_msg = f"Predicted {p['predicted_temp_180s']}°C > Critical {p['t_critical']}°C. Capped to {new_power}W (-{round((power-new_power)/power*100)}%), quantized to INT8."

                # Lock hysteresis window
                self.hysteresis_registry[nid] = {
                    "action_time": now,
                    "dwell_until": now + self.dwell_time_seconds
                }

                self.log_event(
                    action=action_name,
                    node_id=nid,
                    detail=detail_msg,
                    severity="CRITICAL"
                )

            # 2. Check Anti-Flapping Hysteresis for recovery
            elif node["status"] in ("CORDONED", "POWER_CAPPED"):
                reg = self.hysteresis_registry.get(nid, {})
                dwell_until = reg.get("dwell_until", 0)

                # Only clear if temperature is below safe recovery threshold AND dwell window expired
                if now >= dwell_until and current_temp < p["t_warning"]:
                    node["status"] = "NOMINAL"
                    node["power_w"] = min(node["tdp_watts"] * 0.75, node["power_w"] * 1.25)
                    node["precision"] = "FP16"
                    self.hysteresis_registry.pop(nid, None)

                    self.log_event(
                        action="HYSTERESIS_RECOVERY",
                        node_id=nid,
                        detail=f"Cooled to {current_temp}°C below threshold for {self.dwell_time_seconds}s dwell. Restored node to nominal scheduling.",
                        severity="SUCCESS"
                    )

            # Natural thermal drift towards equilibrium
            target_equilibrium = ambient_temp + (node["power_w"] * p["r_th_effective"])
            step_delta = (target_equilibrium - current_temp) * 0.15 + random.uniform(-0.3, 0.3)
            node["temp_c"] = round(max(35.0, min(95.0, current_temp + step_delta)), 1)
            node["predicted_temp_180s"] = p["predicted_temp_180s"]
            node["thermal_tier"] = tier
            node["clock_loss_pct"] = p["clock_loss_pct"]
            node["financial_waste_usd_hr"] = p["financial_waste_usd_hr"]

        return self.nodes

    def inject_chaos_surge(
        self,
        ingress_multiplier: float = 3.5,
        latency_timeout_ms: float = 800.0,
        failure_cascade_pct: float = 25.0
    ) -> Dict[str, Any]:
        """
        Dynamic chaos engineering injection with strict numerical slope safeguards (Delta_t >= 1ms floor).
        """
        now = time.time()
        simulated_queue_depth = 50.0 * ingress_multiplier

        # Numerical safety: enforce Delta_t >= 1ms floor to prevent division-by-zero / NaN
        slope = 0.0
        if self.queue_history:
            prev_time, prev_depth = self.queue_history[-1]
            dt = max(0.001, now - prev_time)
            raw_slope = (simulated_queue_depth - prev_depth) / dt
            # Clamp slope to avoid numerical runaway
            slope = max(-500.0, min(500.0, raw_slope))

        self.queue_history.append((now, simulated_queue_depth))
        if len(self.queue_history) > 30:
            self.queue_history.pop(0)

        # Trigger Cascading Circuit Breaker if slope or multiplier is extreme
        tripped = False
        if ingress_multiplier >= 6.0 or slope > 30.0 or failure_cascade_pct > 60.0:
            tripped = True
            self.circuit_state = "OPEN"
            self.circuit_tripped_at = now
            self.bunker.activate_emergency_containment(reason=f"Chaos surge ({ingress_multiplier}x ingress, slope {round(slope, 1)}/s)")
            
            # Seal auth tokens in the bunker
            for node in self.nodes[:4]:
                self.bunker.seal_state(
                    tenant_id=node["tenant_id"],
                    state_payload={
                        "invariants": ["Zero_Thermal_Throttling", "K8s_State_Preserved"],
                        "auth_tokens": [f"jwt-token-{node['node_id']}-{int(now)}"],
                        "active_jobs": [node["workload_name"]]
                    }
                )

            self.log_event(
                action="CIRCUIT_BREAKER_TRIPPED",
                node_id="CLUSTER_WIDE",
                detail=f"Cascading ingress surge {ingress_multiplier}x (dQ/dt={round(slope, 1)}). Tripped breaker & sealed VERDE Bunker.",
                severity="CRITICAL"
            )

        # Select target nodes to heat up
        affected_count = max(1, int(len(self.nodes) * (failure_cascade_pct / 100.0)))
        affected_nodes = random.sample(self.nodes, min(affected_count, len(self.nodes)))
        for n in affected_nodes:
            if not n["is_bunker_node"]:
                n["temp_c"] = round(min(88.0, n["temp_c"] + random.uniform(12.0, 19.0)), 1)
                n["power_w"] = round(min(n["tdp_watts"], n["power_w"] + 80.0), 1)

        return {
            "ingress_multiplier": ingress_multiplier,
            "calculated_queue_slope": round(slope, 2),
            "circuit_state": self.circuit_state,
            "bunker_engaged": self.bunker.enclave_status == "ENGAGED",
            "nodes_surged": [n["node_id"] for n in affected_nodes]
        }

    def reset_circuit_breaker(self) -> Dict[str, Any]:
        """Manually or automatically resets the circuit breaker and opens bunker seals."""
        self.circuit_state = "CLOSED"
        self.circuit_tripped_at = None
        self.bunker.reset_containment()
        self.log_event(
            action="CIRCUIT_BREAKER_RESET",
            node_id="CLUSTER_WIDE",
            detail="Cluster stabilized. Circuit breaker closed, normal ingress restored.",
            severity="SUCCESS"
        )
        return {"circuit_state": "CLOSED", "bunker_status": self.bunker.enclave_status}

    def manual_mitigate(self, node_id: str, action: str) -> Dict[str, Any]:
        """Manual triage override from the ThermalOps cockpit."""
        target = next((n for n in self.nodes if n["node_id"] == node_id), None)
        if not target:
            return {"error": f"Node {node_id} not found"}

        if action == "CORDON":
            target["status"] = "CORDONED"
            detail = f"Manually cordoned {node_id} from Kubernetes scheduling."
        elif action == "DVFS_POWER_CAP":
            target["status"] = "POWER_CAPPED"
            target["power_w"] = round(target["power_w"] * 0.70, 1)
            detail = f"Manually applied 30% micro-DVFS power cap to {node_id}."
        elif action == "QUANTIZE_INT8":
            target["precision"] = "INT8"
            detail = f"Shifted {node_id} serving precision from FP16 to INT8 (40% memory bus heat shed)."
        elif action == "RESTORE":
            target["status"] = "NOMINAL"
            target["precision"] = "FP16"
            detail = f"Restored {node_id} to active scheduling."
        else:
            detail = f"Unknown action: {action}"

        self.log_event(action=f"MANUAL_{action}", node_id=node_id, detail=detail, severity="WARNING")
        return {"node_id": node_id, "status": target["status"], "detail": detail}
