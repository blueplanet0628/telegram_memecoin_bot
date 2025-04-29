import axios from 'axios';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../config/telegram.js';

export const sendTelegramMessage = async (message) => {
  try {
    await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      params: {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      }
    });
  } catch (error) {
    console.error('Error sending Telegram message:', error.message);
  }
};
