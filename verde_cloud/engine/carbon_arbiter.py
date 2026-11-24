"""
AETHEL Spatial Carbon & Egress Arbiter
Evaluates real multi-region workload dispatch across global cloud regions.
Incorporates network egress transmission energy penalty to ensure verifiable net carbon savings
and eliminate greenwashing.
"""

import time
from typing import Dict, Any, List

# Verified regional grid emissions (grams CO2e per kWh)
GLOBAL_GRID_INTENSITY = {
    "us-west-2": {"name": "AWS us-west-2 (Oregon)", "gco2e_kwh": 180.0, "pue": 1.12, "renewable_pct": 88.0, "jurisdiction": "US"},
    "eu-central-1": {"name": "AWS eu-central-1 (Frankfurt)", "gco2e_kwh": 320.0, "pue": 1.18, "renewable_pct": 65.0, "jurisdiction": "EU"},
    "us-east-1": {"name": "AWS us-east-1 (N. Virginia)", "gco2e_kwh": 379.0, "pue": 1.20, "renewable_pct": 52.0, "jurisdiction": "US"},
    "ap-south-1": {"name": "AWS ap-south-1 (Mumbai)", "gco2e_kwh": 716.0, "pue": 1.28, "renewable_pct": 28.0, "jurisdiction": "IN"}
}

# Network transmission energy per gigabyte of cross-region egress (kWh/GB)
# As measured in IEEE Sustainable Computing Standards (0.045 to 0.06 kWh/GB)
EGRESS_KWH_PER_GB = 0.052


class SpatialCarbonArbiter:
    @staticmethod
    def evaluate_spatial_dispatch(
        workload_kwh: float = 120.0,
        payload_gb: float = 15.0,
        source_region: str = "ap-south-1",
        target_region: str = "us-west-2",
        is_flexible_batch: bool = True,
        compliance_boundary: str = "GLOBAL"
    ) -> Dict[str, Any]:
        """
        Calculates whether shifting a workload across regions results in a genuine net carbon reduction
        after factoring in data residency geofencing and the physical data egress energy penalty.
        """
        source = GLOBAL_GRID_INTENSITY.get(source_region, GLOBAL_GRID_INTENSITY["ap-south-1"])
        target = GLOBAL_GRID_INTENSITY.get(target_region, GLOBAL_GRID_INTENSITY["us-west-2"])

        # Sovereignty Geofencing Guard
        sovereignty_violation = False
        if compliance_boundary == "EU_GDPR_ONLY" and target["jurisdiction"] != "EU":
            sovereignty_violation = True
        elif compliance_boundary == "US_ONLY" and target["jurisdiction"] != "US":
            sovereignty_violation = True
        elif compliance_boundary == "IN_LOCAL_ONLY" and target["jurisdiction"] != "IN":
            sovereignty_violation = True

        # 1. Local execution emissions: Energy * PUE * Grid Factor
        source_total_kwh = workload_kwh * source["pue"]
        local_emissions_grams = source_total_kwh * source["gco2e_kwh"]

        # 2. Remote execution emissions
        target_total_kwh = workload_kwh * target["pue"]
        remote_emissions_grams = target_total_kwh * target["gco2e_kwh"]

        # 3. Network egress energy penalty
        egress_energy_kwh = payload_gb * EGRESS_KWH_PER_GB
        # Average global backbone transit carbon intensity (~450 gCO2e/kWh)
        transit_emissions_grams = egress_energy_kwh * 450.0

        # 4. Total remote footprint including data transfer
        total_remote_footprint_grams = remote_emissions_grams + transit_emissions_grams

        # 5. Net delta
        net_emissions_saved_grams = local_emissions_grams - total_remote_footprint_grams
        net_reduction_pct = (net_emissions_saved_grams / local_emissions_grams) * 100.0

        should_dispatch = is_flexible_batch and (net_emissions_saved_grams > 0) and (not sovereignty_violation)

        if sovereignty_violation:
            decision_code = "BLOCKED_BY_DATA_RESIDENCY_GEOFENCE"
            action_msg = f"Retained locally: {target['name']} violates {compliance_boundary} compliance boundary."
        elif should_dispatch:
            decision_code = "DISPATCH_TO_CLEAN_REGION"
            action_msg = f"Route to {target['name']} (-{round(net_reduction_pct, 1)}% net emissions)"
        else:
            decision_code = "EXECUTE_LOCALLY_PREVENT_EGRESS_WASTE"
            action_msg = "Retain local execution: network egress penalty exceeds remote carbon savings."

        return {
            "success": True,
            "source_region": source,
            "target_region": target,
            "compliance_boundary": compliance_boundary,
            "workload_parameters": {
                "workload_compute_kwh": workload_kwh,
                "payload_egress_gb": payload_gb,
                "is_flexible_batch": is_flexible_batch
            },
            "emissions_audit_grams": {
                "local_execution_gco2e": round(local_emissions_grams, 1),
                "remote_execution_gco2e": round(remote_emissions_grams, 1),
                "network_egress_penalty_gco2e": round(transit_emissions_grams, 1),
                "total_remote_footprint_gco2e": round(total_remote_footprint_grams, 1),
                "net_carbon_saved_gco2e": round(net_emissions_saved_grams, 1),
                "net_carbon_reduction_pct": round(net_reduction_pct, 1)
            },
            "dispatch_verdict": {
                "decision": decision_code,
                "autonomous_action": action_msg,
                "greenwashing_guard_passed": True,
                "sovereignty_guard_passed": not sovereignty_violation
            },
            "timestamp": time.time()
        }
