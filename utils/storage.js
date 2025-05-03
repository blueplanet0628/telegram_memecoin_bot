import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data/notifiedTokens.json');

export function getNotifiedTokens() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]');  // Create file if not exists
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);

    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading notifiedTokens.json:', err.message);
    return [];  // Return empty array on error
  }
}

export function saveNotifiedTokens(address) {
  const tokens = getNotifiedTokens();
  if (!tokens.includes(address)) {
    tokens.push(address);
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));
  }
}
