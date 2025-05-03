import axios from 'axios';
import { memeKeywords } from '../data/keywords.js';
import { getNotifiedTokens, saveNotifiedTokens } from '../utils/storage.js';
import { sendTelegramMessage } from './telegramService.js';

export async function fetchSolanaMemecoins() {
  try {
    const response = await axios.get('https://api.dexscreener.com/latest/dex/search?q=SOL/USDC');
    const allTokens = response.data?.pairs || [];

    const solanaMemecoins = allTokens.filter(token => {
      const chain = token.chainId?.toLowerCase();
      const name = token.baseToken?.name?.toLowerCase() || '';
      const symbol = token.baseToken?.symbol?.toLowerCase() || '';
      return chain === 'solana' && memeKeywords.some(keyword =>
        name.includes(keyword) || symbol.includes(keyword)
      );
    });

    const notified = await getNotifiedTokens(); // Ensure this is async
    const newNotified = [];

    if (solanaMemecoins.length === 0) {
      const noResultMessage = "🚫 No new Solana meme coins matched the criteria.";
      console.log(noResultMessage);
      await sendTelegramMessage(noResultMessage);
      return;
    }

    for (const [index, token] of solanaMemecoins.entries()) {
      const address = token.baseToken?.address?.toLowerCase();
      if (notified.includes(address)) continue;

      const coin = {
        name: token.baseToken?.name || 'Unknown',
        symbol: token.baseToken?.symbol || '???',
        address,
        url: `https://dexscreener.com/solana/${token.pairAddress}`,
        icon: token.info?.imageUrl || '',
        description: 'No description available',
        fdv: token.fdv,
        marketCap: token.marketCap,
        volume: token.volume?.h24 || 0,
        exchange: token.dexId || 'Unknown DEX',
        tradeUrl: token.url || `https://dexscreener.com/solana/${token.pairAddress}`,
      };

      const message = `
🚀 *New Solana Meme Coin Detected!*

#${index + 1} - [View Token](${coin.url})
*Name:* ${coin.name} (${coin.symbol})
*Market Cap:* $${(coin.fdv || coin.marketCap || 0).toLocaleString()}
*Volume (24h):* $${Number(coin.volume).toLocaleString()}
*Exchange:* ${coin.exchange}
🔗 [Trade Now](${coin.tradeUrl})
📜 *Contract:* \`${coin.address}\`
${coin.icon ? `🖼 *Icon:* ${coin.icon}` : ''}
📣 *X (Twitter):* N/A
      `.trim();

      await sendTelegramMessage(message);
      newNotified.push(address);
    }

    if (newNotified.length > 0) {
      await saveNotifiedTokens({ notified: [...notified, ...newNotified] });
    }

  } catch (err) {
    console.error('Error in fetchSolanaMemecoins:', err.message);
  }
}
