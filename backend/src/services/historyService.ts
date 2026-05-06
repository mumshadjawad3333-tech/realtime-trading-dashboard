import { TICKERS, INITIAL_PRICES } from './market';

// In-memory store (Simulating a database/cache)
export const historicalData: Record<string, { time: string; price: number }[]> = {};

/**
 * Initializes history for all tickers.
 * This can be called when the server starts.
 */
export const initializeHistory = () => {
  TICKERS.forEach(symbol => {
    const currentPrice = INITIAL_PRICES[symbol] || 100;
    
    historicalData[symbol] = Array.from({ length: 20 }).map((_, i) => ({
      time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString(),
      price: parseFloat((currentPrice + (Math.random() * 5 - 2.5)).toFixed(2))
    }));
  });
};

/**
 * Retrieves history for a specific ticker.
 * Demonstrates "Service Logic" that could easily be swapped for a DB query.
 */
export const getHistoryByTicker = (symbol: string) => {
  return historicalData[symbol] || [];
};

/**
 * Adds a new price point to the history.
 * Logic for "sliding window" (keeping only 50 entries) is encapsulated here.
 */
export const addToHistory = (symbol: string, price: number) => {
  if (!historicalData[symbol]) {
    historicalData[symbol] = [];
  }
  
  const newEntry = { 
    time: new Date().toLocaleTimeString(), 
    price: parseFloat(price.toFixed(2)) 
  };
  
  historicalData[symbol].push(newEntry);
  
  // Maintain a fixed window size for performance
  if (historicalData[symbol].length > 50) {
    historicalData[symbol].shift();
  }
};

// Auto-initialize on module load
initializeHistory();