import { fetchSolanaMemecoins } from '../services/memeService.js';

const INTERVAL_MINUTES = 1;

function startMemeCoinTracker() {
  console.log('⏳ Starting Solana Memecoin Tracker...');
  
  // Run immediately once
  fetchSolanaMemecoins();

  // Run every INTERVAL_MINUTES
  setInterval(() => {
    console.log(`🔁 Fetching memecoins at ${new Date().toISOString()}...`);
    fetchSolanaMemecoins();
  }, INTERVAL_MINUTES * 60 * 1000);
}

startMemeCoinTracker();