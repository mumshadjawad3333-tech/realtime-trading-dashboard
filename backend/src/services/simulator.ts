import { Server } from 'socket.io';
import { updateMarketState, INITIAL_PRICES } from './market';
import { addToHistory } from './historyService';
import { sendPushNotification } from './firebaseAdmin';

let currentMarketState = { ...INITIAL_PRICES };

const priceAlerts = [
  { symbol: 'BTC-USD', threshold: 45000, triggered: false },
  { symbol: 'TSLA', threshold: 703, triggered: false },
  { symbol: 'AAPL', threshold: 152, triggered: false }
];

export const startMarketSimulation = (io: Server) => {
  setInterval(async () => {
    currentMarketState = updateMarketState(currentMarketState);
    
    for (const [symbol, price] of Object.entries(currentMarketState)) {
      addToHistory(symbol, price);

      const alert = priceAlerts.find(a => a.symbol === symbol && !a.triggered);
      
      if (alert && (price as number) >= alert.threshold) {
        const alertPayload = {
          id: Date.now(),
          symbol,
          price,
          threshold: alert.threshold,
          message: `Target Hit: ${symbol} is now $${price}!`,
          type: 'success'
        };

        // 1. Socket.io (Immediate)
        io.emit('priceAlert', alertPayload);
        
        // 2. FCM (Background) - Guarded to prevent "void 0" crashes
        if (typeof sendPushNotification === 'function') {
          sendPushNotification(symbol, price as number).catch(err => 
            console.error(`[FCM ERROR] for ${symbol}:`, err)
          );
        } else {
          console.warn(`[SIMULATOR] sendPushNotification is not loaded. Skipping FCM.`);
        }
        
        alert.triggered = true; 
      }
    }
    
    io.emit('priceUpdate', currentMarketState);
  }, 1000);
};

export const getCurrentState = () => currentMarketState;