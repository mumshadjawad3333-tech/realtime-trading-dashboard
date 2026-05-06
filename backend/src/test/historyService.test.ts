import { describe, it, expect, beforeEach } from 'vitest';
import * as HistoryService from '../services/historyService';

describe('HistoryService', () => {
  beforeEach(() => {
    HistoryService.initializeHistory();
  });

  it('should initialize with 20 data points per ticker', () => {
    const history = HistoryService.getHistoryByTicker('BTC-USD');
    expect(history.length).toBe(20);
  });

  it('should not exceed 50 data points', () => {
    for (let i = 0; i < 100; i++) {
      HistoryService.addToHistory('BTC-USD', 50000 + i);
    }
    const history = HistoryService.getHistoryByTicker('BTC-USD');
    expect(history.length).toBe(50);
  });
});