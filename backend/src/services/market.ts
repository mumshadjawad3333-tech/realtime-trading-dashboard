export const TICKERS = ['AAPL', 'TSLA', 'BTC-USD', 'ETH-USD', 'GOOGL'] as const;

// Default initial prices
export const INITIAL_PRICES: Record<string, number> = {
  AAPL: 150.00,
  TSLA: 700.00,
  "BTC-USD": 45000.00,
  "ETH-USD": 3000.00,
  GOOGL: 2800.00
};

/**
 * Pure function to calculate a price fluctuation.
 * Highly testable because it has no side effects.
 */
export const calculateNextPrice = (currentPrice: number): number => {
  const change = currentPrice * (Math.random() * 0.002 - 0.001); // +/- 0.1%
  return parseFloat((currentPrice + change).toFixed(2));
};

/**
 * Updates the entire market state.
 * @param currentState The current prices of all tickers
 */
export const updateMarketState = (currentState: Record<string, number>) => {
  const nextState: Record<string, number> = {};
  
  TICKERS.forEach((symbol) => {
    const price = currentState[symbol] || INITIAL_PRICES[symbol];
    nextState[symbol] = calculateNextPrice(price);
  });

  return nextState;
};