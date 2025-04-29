import axios from 'axios';
import { memeKeywords } from '../data/keywords.js';
import { sendTelegramMessage } from './telegramService.js';

export const fetchLatestSolanaMemeCoins = async () => {
    try {
        const response = await axios.get('https://api.dexscreener.com/token-profiles/latest/v1');
        const tokens = response.data || [];

        const solanaMemeCoins = tokens.filter(token => {
            const isSolana = token.chainId === 'solana';
            const description = token.description?.toLowerCase() || '';
            const url = token.url?.toLowerCase() || '';
            const address = token.tokenAddress?.toLowerCase() || '';

            const isMeme = memeKeywords.some(keyword =>
                description.includes(keyword) || url.includes(keyword) || address.includes(keyword)
            );

            const isListedInLastHour = Date.now() - new Date(token.listingTimestamp).getTime() < 3600 * 1000;
            const hasMinFollowers = token.socials?.twitter?.followers >= 100;

            return isSolana && isMeme && isListedInLastHour && hasMinFollowers;
        }).sort((a, b) => b.volume.h24 - a.volume.h24);

        if (solanaMemeCoins.length === 0) {
            const noResultsMessage = "🚫 No new Solana meme coins found in the last 5 minutes that match the criteria.";
            console.log(noResultsMessage);
            await sendTelegramMessage(noResultsMessage);
            return;
        }

        for (const [index, coin] of solanaMemeCoins.entries()) {
            const message = `
🚀 *New Solana Meme Coin Detected!*
#${index + 1} - ${coin.url}
*Name:* ${coin.name}
*Description:* ${coin.description || 'No description available'}
*24h Volume:* $${coin.volume.h24.toLocaleString()}
*Followers:* ${coin.socials?.twitter?.followers || 'N/A'}
*Icon:* ${coin.icon || 'No icon available'}
--------------------------------------------
      `;
            await sendTelegramMessage(message);
        }

    } catch (error) {
        console.error('Error fetching Solana meme coins:', error.message);
    }
};
