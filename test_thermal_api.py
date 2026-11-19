"""
End-to-End Test Suite for AETHEL ThermalOps & Silicon Co-Scheduler API
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from verde_cloud.server import app

def run_e2e_tests():
    client = TestClient(app)

    print("1. Testing /api/health...")
    res = client.get("/api/health")
    assert res.status_code == 200
    print("   Health:", res.json()["status"])

    print("2. Testing /api/thermal/nodes (All Tenants)...")
    res = client.get("/api/thermal/nodes")
    assert res.status_code == 200
    data = res.json()
    assert len(data["nodes"]) == 16
    print("   Nodes count:", len(data["nodes"]), "Circuit state:", data["circuit_state"])

    print("3. Testing /api/thermal/nodes with Tenant Isolation (Acme AI)...")
    res = client.get("/api/thermal/nodes?tenant_id=Acme%20AI")
    assert res.status_code == 200
    tenant_nodes = res.json()["nodes"]
    assert all(n["tenant_id"] == "Acme AI" for n in tenant_nodes)
    print("   Acme AI isolated nodes count:", len(tenant_nodes))

    print("4. Testing Dynamic Chaos Surge Injection...")
    res = client.post("/api/thermal/chaos/inject", json={
        "ingress_multiplier": 7.5,
        "latency_timeout_ms": 1200.0,
        "failure_cascade_pct": 35.0
    })
    assert res.status_code == 200
    chaos_data = res.json()
    print("   Chaos Response -> Queue Slope:", chaos_data["calculated_queue_slope"], "Breaker State:", chaos_data["circuit_state"])

    print("5. Testing Circuit Breaker Reset...")
    res = client.post("/api/thermal/chaos/reset")
    assert res.status_code == 200
    print("   Breaker Reset:", res.json()["circuit_state"])

    print("6. Testing Manual Node Triage Mitigation...")
    res = client.post("/api/thermal/mitigate", json={
        "node_id": "node-03",
        "action": "CORDON"
    })
    assert res.status_code == 200
    print("   Mitigate Response:", res.json()["detail"])

    print("7. Testing VERDE AST Code Distillation...")
    sample_code = """
import torch
def forward_pass(x, weights):
    for layer in range(12):
        x = torch.matmul(x, weights[layer])
    return x
"""
    res = client.post("/api/thermal/distill", json={"source_code": sample_code})
    assert res.status_code == 200
    distill_data = res.json()
    print("   AST Distill -> Loops:", distill_data["loops_detected"], "Surge:", distill_data["predicted_thermal_surge_c"], "°C")

    print("8. Testing /api/thermal/bunker-state...")
    res = client.get("/api/thermal/bunker-state")
    assert res.status_code == 200
    bunker_data = res.json()
    print("   Bunker V-Token Compression:", bunker_data["bunker"]["compression_ratio_pct"], "%")
    print("   Synapse Invariants on disk:", bunker_data["lattice"]["synapse_invariants_count"])

    print("9. Testing /api/thermal/events...")
    res = client.get("/api/thermal/events")
    assert res.status_code == 200
    events = res.json()["events"]
    assert len(events) > 0
    print("   Live terminal event count:", len(events))

    print("\n>>> ALL 9 END-TO-END TESTS COMPLETED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    run_e2e_tests()
