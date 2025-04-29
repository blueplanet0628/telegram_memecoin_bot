import fs from 'fs';
const filePath = '../data/notifiedTokens.json';

export const loadNotifiedTokens = () => {
  try {
    if (!fs.existsSync(filePath)) return { notified: [] };
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading notifiedTokens.json:', err.message);
    return { notified: [] };
  }
};

export const saveNotifiedTokens = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing notifiedTokens.json:', err.message);
  }
};
