import type { Request, Response } from 'express';
import * as MarketService from '../services/market';
import * as HistoryService from '../services/historyService';

interface SymbolParams {
  symbol: string;
}

/**
 * Controller: Handles HTTP transport logic.
 * No business logic (price calculation or history slicing) happens here.
 */
export const getTickers = (_req: Request, res: Response): void => {
  // Directly pull from the service
  res.json(MarketService.TICKERS);
};

export const getTickerHistory = (
  req: Request<SymbolParams>,
  res: Response
): void => {
  const { symbol } = req.params;

  // Normalizing input
  const ticker = symbol.toUpperCase();

  // Call the History Service instead of accessing a mockStore directly
  const data = HistoryService.getHistoryByTicker(ticker);

  if (!data || data.length === 0) {
    res.status(404).json({ 
      error: 'Not Found', 
      message: `Ticker history for ${ticker} not found.` 
    });
    return;
  }

  res.json(data);
};