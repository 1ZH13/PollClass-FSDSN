export const API_BASE = 'http://localhost:3001/api';

export function uniqueSuffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}
