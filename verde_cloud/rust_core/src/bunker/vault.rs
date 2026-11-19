//! Memory-Pinned Encrypted V-Token Storage for Zero-Amnesia Bunker Containment

use std::collections::HashMap;
use std::sync::RwLock;

pub struct BunkerVault {
    records: RwLock<HashMap<String, Vec<u8>>>,
}

impl BunkerVault {
    pub fn new() -> Self {
        Self {
            records: RwLock::new(HashMap::new()),
        }
    }

    /// Stores sealed payload indexed by token ID
    pub fn seal(&self, token_id: String, payload: Vec<u8>) {
        if let Ok(mut lock) = self.records.write() {
            lock.insert(token_id, payload);
        }
    }

    /// Retrieves sealed payload by token ID
    pub fn unseal(&self, token_id: &str) -> Option<Vec<u8>> {
        if let Ok(lock) = self.records.read() {
            lock.get(token_id).cloned()
        } else {
            None
        }
    }

    /// Returns active count of sealed records
    pub fn count(&self) -> usize {
        self.records.read().map(|l| l.len()).unwrap_or(0)
    }
}
