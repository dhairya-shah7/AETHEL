//! Lock-Free Atomic Telemetry Ingestion Ring Buffer using Crossbeam

use crossbeam::queue::ArrayQueue;
use std::sync::Arc;

#[derive(Clone, Copy, Debug)]
pub struct NodeTelemetryFrame {
    pub node_id: u32,
    pub temp_c: f32,
    pub power_w: f32,
    pub throttle_mask: u64,
    pub timestamp_ns: u64,
}

pub struct TelemetryRingBuffer {
    queue: Arc<ArrayQueue<NodeTelemetryFrame>>,
}

impl TelemetryRingBuffer {
    pub fn new(capacity: usize) -> Self {
        Self {
            queue: Arc::new(ArrayQueue::new(capacity)),
        }
    }

    /// Pushes telemetry frame with zero memory allocation. Overwrites oldest if full.
    #[inline(always)]
    pub fn push_sample(&self, frame: NodeTelemetryFrame) {
        let _ = self.queue.force_push(frame);
    }

    /// Pops sample from the front of the queue
    pub fn pop_sample(&self) -> Option<NodeTelemetryFrame> {
        self.queue.pop()
    }

    pub fn len(&self) -> usize {
        self.queue.len()
    }

    pub fn is_empty(&self) -> bool {
        self.queue.is_empty()
    }
}
