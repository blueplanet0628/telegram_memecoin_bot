import { fetchLatestSolanaMemeCoins } from '../services/memeService.js';

console.log("⏳ Solana Meme Coin Watcher started...");

fetchLatestSolanaMemeCoins(); // Run immediately
setInterval(fetchLatestSolanaMemeCoins, 5 * 60 * 1000); // Then every 5 minutes
