//! PyO3 Extension Module exposing SIMD RC differential solver and Bunker vault

pub mod physics;
pub mod bunker;

use pyo3::prelude::*;
use physics::rc_model::ThermalPredictor;

#[pyfunction]
fn predict_future_temp(
    current: f32,
    power: f32,
    ambient: f32,
    r_th: f32,
    c_th: f32,
    dt: f32
) -> PyResult<f32> {
    Ok(ThermalPredictor::predict_single(current, power, ambient, r_th, c_th, dt))
}

#[pymodule]
fn verde_thermal_core(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(predict_future_temp, m)?)?;
    Ok(())
}
