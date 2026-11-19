import time
import os
import sys
import json
import math
from typing import Dict, Any, Optional

# Regional Grid Emission Factors (gCO2e per kWh)
# Central Electricity Authority (CEA) India CO2 Baseline Database ~ 716 gCO2e/kWh
# US Average ~ 380 gCO2e/kWh, EU Average ~ 250 gCO2e/kWh
GRID_EMISSION_FACTORS = {
    "IN_NATIONAL": 716.0,
    "IN_NORTHERN": 725.0,
    "IN_WESTERN": 740.0,
    "IN_SOUTHERN": 680.0,
    "US_EAST": 379.0,
    "EU_WEST": 230.0
}

# Standard Server Power Constants (Watts)
# Based on Green Software Foundation (GSF) Software Carbon Intensity (SCI) Specs
INSTANCE_POWER_PROFILES = {
    "c5.xlarge": {"idle_w": 25.0, "max_w": 110.0, "vcpus": 4, "hourly_cost_usd": 0.17},
    "c5.4xlarge": {"idle_w": 60.0, "max_w": 320.0, "vcpus": 16, "hourly_cost_usd": 0.68},
    "g4dn.xlarge": {"idle_w": 45.0, "max_w": 220.0, "vcpus": 4, "gpu": "T4", "hourly_cost_usd": 0.526},
    "p3.2xlarge": {"idle_w": 90.0, "max_w": 450.0, "vcpus": 8, "gpu": "V100", "hourly_cost_usd": 3.06},
    "p4d.24xlarge": {"idle_w": 350.0, "max_w": 2800.0, "vcpus": 96, "gpu": "A100x8", "hourly_cost_usd": 32.77},
    "default": {"idle_w": 30.0, "max_w": 150.0, "vcpus": 4, "hourly_cost_usd": 0.20}
}

class VerdeTelemetryProfiler:
    """
    Lightweight telemetry profiler that measures execution time,
    estimates Joules, kWh, carbon footprint (gCO2e), and cloud costs.
    """
    def __init__(self, instance_type="c5.xlarge", region="IN_NATIONAL"):
        self.instance_type = instance_type
        self.profile = INSTANCE_POWER_PROFILES.get(instance_type, INSTANCE_POWER_PROFILES["default"])
        self.grid_emission = GRID_EMISSION_FACTORS.get(region, GRID_EMISSION_FACTORS["IN_NATIONAL"])
        self.start_time = None
        self.end_time = None

    def start(self):
        self.start_time = time.perf_counter()
        return self

    def read_hardware_registers(self) -> Dict[str, Any]:
        """
        [UPGRADED] Direct kernel hardware counter sampling.
        Queries NVIDIA NVML for GPU junction temperature, power draw (mW),
        and thermal throttling bitmasks; falls back cleanly if running in VM/container.
        """
        hw_data = {
            "gpu_junction_temp_c": None,
            "gpu_power_watts": None,
            "thermal_throttling_bitmask": 0,
            "hardware_registers_active": False,
            "telemetry_source": "synthetic_tdp_deprecated"
        }
        try:
            import pynvml
            pynvml.nvmlInit()
            handle = pynvml.nvmlDeviceGetHandleByIndex(0)
            temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
            power_mw = pynvml.nvmlDeviceGetPowerUsage(handle)
            clocks_throttle = pynvml.nvmlDeviceGetCurrentClocksThrottleReasons(handle)
            hw_data["gpu_junction_temp_c"] = float(temp)
            hw_data["gpu_power_watts"] = float(power_mw / 1000.0)
            hw_data["thermal_throttling_bitmask"] = int(clocks_throttle)
            hw_data["hardware_registers_active"] = True
            hw_data["telemetry_source"] = "nvml_hardware_register"
        except Exception:
            # Clean fallback without breaking execution
            pass
        return hw_data

    def stop(self, avg_cpu_utilization=0.75):
        """
        Calculates energy and emissions.
        Prioritizes direct hardware registers; marks software estimation as deprecated fallback.
        """
        self.end_time = time.perf_counter()
        duration_sec = max(0.001, self.end_time - self.start_time)
        
        hw = self.read_hardware_registers()

        # If real hardware power is available, use it directly
        if hw["hardware_registers_active"] and hw["gpu_power_watts"]:
            power_watts = hw["gpu_power_watts"]
        else:
            # Deprecated synthetic power model: P(u) = P_idle + (P_max - P_idle) * u
            power_watts = self.profile["idle_w"] + (self.profile["max_w"] - self.profile["idle_w"]) * avg_cpu_utilization
        
        # Energy in Joules (Watt-seconds) and kWh
        energy_joules = power_watts * duration_sec
        energy_kwh = energy_joules / 3_600_000.0
        
        # Carbon emissions in grams of CO2 equivalent
        carbon_gco2e = energy_kwh * self.grid_emission
        
        # Water usage: Datacenter average Water Usage Effectiveness (WUE) ~ 1.8 Liters per kWh
        water_liters = energy_kwh * 1.8
        
        # Cloud Cost in USD
        cost_usd = (duration_sec / 3600.0) * self.profile["hourly_cost_usd"]

        result = {
            "instance_type": self.instance_type,
            "duration_sec": round(duration_sec, 3),
            "avg_power_watts": round(power_watts, 2),
            "energy_joules": round(energy_joules, 2),
            "energy_kwh": round(energy_kwh, 6),
            "carbon_gco2e": round(carbon_gco2e, 4),
            "water_liters": round(water_liters, 4),
            "cost_usd": round(cost_usd, 5),
            "hardware_telemetry": hw
        }
        return result

if __name__ == "__main__":
    profiler = VerdeTelemetryProfiler(instance_type="g4dn.xlarge", region="IN_NATIONAL")
    profiler.start()
    # Simulate workload
    total = sum(i * i for i in range(5_000_000))
    metrics = profiler.stop(avg_cpu_utilization=0.85)
    print(json.dumps(metrics, indent=2))
