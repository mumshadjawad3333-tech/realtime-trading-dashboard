import { describe, it, expect } from 'vitest';
import * as MarketService from '../services/market';

describe('MarketService Logic', () => {
  
  describe('calculateNextPrice', () => {
    it('should stay within the 0.1% fluctuation range', () => {
      const startPrice = 1000;
      const nextPrice = MarketService.calculateNextPrice(startPrice);
      
      // Max change is 0.1% of 1000 = 1.0
      // So price should be between 999.0 and 1001.0
      expect(nextPrice).toBeGreaterThanOrEqual(999.0);
      expect(nextPrice).toBeLessThanOrEqual(1001.0);
    });

    it('should return a number with at most 2 decimal places', () => {
      const nextPrice = MarketService.calculateNextPrice(123.456);
      const decimalCount = nextPrice.toString().split('.')[1]?.length || 0;
      expect(decimalCount).toBeLessThanOrEqual(2);
    });
  });

  describe('updateMarketState', () => {
    it('should update all tickers in the market list', () => {
      const newState = MarketService.updateMarketState(MarketService.INITIAL_PRICES);
      
      MarketService.TICKERS.forEach(ticker => {
        expect(newState).toHaveProperty(ticker);
        expect(typeof newState[ticker]).toBe('number');
      });
    });

    it('should not mutate the original state object', () => {
      const original = { ...MarketService.INITIAL_PRICES };
      MarketService.updateMarketState(original);
      
      expect(original).toEqual(MarketService.INITIAL_PRICES);
    });
  });

});