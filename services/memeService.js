import axios from 'axios';
import { memeKeywords } from '../data/keywords.js';
import { sendTelegramMessage } from '../services/telegramService.js';
import { loadNotifiedTokens, saveNotifiedTokens } from '../utils/storage.js';

export const fetchLatestSolanaMemeCoins = async () => {
  try {
    const response = await axios.get('https://api.dexscreener.com/token-profiles/latest/v1');
    const tokens = response.data || [];

    const { notified } = loadNotifiedTokens();
    const newNotified = [...notified];

    const solanaMemeCoins = tokens.filter(token => {
      const isSolana = token.chainId === 'solana';
      const isListedInLastHour = Date.now() - new Date(token.listingTimestamp).getTime() < 3600 * 1000;
      const hasMinFollowers = token.socials?.twitter?.followers >= 100;

      const name = token.name?.toLowerCase() || '';
      const desc = token.description?.toLowerCase() || '';
      const url = token.url?.toLowerCase() || '';
      const address = token.tokenAddress?.toLowerCase() || '';

      const isMeme = memeKeywords.some(keyword =>
        name.includes(keyword) || desc.includes(keyword) || url.includes(keyword) || address.includes(keyword)
      );

      const isAlreadyNotified = notified.includes(address);

      return isSolana && isListedInLastHour && hasMinFollowers && isMeme && !isAlreadyNotified;
    });

    if (solanaMemeCoins.length > 0) {
      for (const [index, coin] of solanaMemeCoins.entries()) {
        const message = `
                    🚀 *New Solana Meme Coin Detected!*
                    #${index + 1} - [View Token](${coin.url})
                    *Name:* ${coin.name}
                    *Description:* ${coin.description || 'No description available'}
                    *24h Volume:* $${(coin.volume?.h24 || 0).toLocaleString()}
                    *Market Cap:* $${(coin.fdv || coin.marketCap || 0).toLocaleString()}
                    *Followers:* ${coin.socials?.twitter?.followers || 'N/A'}
                    ${coin.icon ? `🖼 Icon: ${coin.icon}` : ''}
                    --------------------------------------------`.trim();

        await sendTelegramMessage(message);
        newNotified.push(coin.tokenAddress.toLowerCase());
      }

      saveNotifiedTokens({ notified: newNotified });
    } else {
      const noResultMessage = "🚫 No new Solana meme coins matched the criteria in the last 30 seconds.";
      console.log(noResultMessage);
      await sendTelegramMessage(noResultMessage);
    }

  } catch (error) {
    console.error('❌ Error fetching Solana meme coins:', error.message);
    await sendTelegramMessage(`❌ Error occurred while fetching data: ${error.message}`);
  }
};
