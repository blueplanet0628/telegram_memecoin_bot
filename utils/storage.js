// utils/storage.js
import fs from 'fs/promises';
const FILE_PATH = './notifiedTokens.json';

export async function getNotifiedTokens() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf8');
    return JSON.parse(data).notified || [];
  } catch {
    return [];
  }
}

export async function saveNotifiedTokens(data) {
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
}
