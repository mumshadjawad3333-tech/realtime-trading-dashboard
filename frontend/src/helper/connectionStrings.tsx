export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

export const ENDPOINTS = {
  LOGIN: '/api/login',
  SUBSCRIBE: '/api/subscribe',
  TICKER_HISTORY: (ticker: string) => `/api/tickers/${ticker}/history`,
};