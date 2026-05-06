import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { TrendingUp, Sun, Moon, Activity, LogOut, BellRing, Loader2 } from 'lucide-react';

// Components
import { PriceChart } from './components/PriceChart';
import { TickerCard } from './components/TickerCard';
import { Login } from './components/Login';

// Helpers & Network
import { BASE_URL, ENDPOINTS } from './helper/connectionStrings';
import { apiRequest } from './network/apiClient';
import { setupFCM } from './helper/fcmHelper';

const socket = io(BASE_URL);

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [prices, setPrices] = useState<Record<string, number>>({});
  const [prevPrices, setPrevPrices] = useState<Record<string, number>>({});
  const [selectedTicker, setSelectedTicker] = useState('BTC-USD');
  const [history, setHistory] = useState<{ time: string; price: number }[]>([]);

  const [isDark, setIsDark] = useState(true);
  const [activeAlert, setActiveAlert] = useState<{ message: string; symbol: string } | null>(null);

  // Theme Management
  useEffect(() => {
    const root = window.document.documentElement;
    isDark ? root.classList.add('dark') : root.classList.remove('dark');
  }, [isDark]);

  // Trigger FCM setup once when user is logged in
  useEffect(() => {
    if (token) {
      setupFCM((payload) => {
        // Callback function to handle the Emerald Alert UI
        setActiveAlert({
          message: payload.notification?.body || "Target price reached!",
          symbol: payload.notification?.title?.split(' ')[0] || "Alert"
        });
        setTimeout(() => setActiveAlert(null), 8000);
      });
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await apiRequest(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: { username, password }
      });
      localStorage.setItem('token', data.accessToken);
      setToken(data.accessToken);
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    socket.disconnect();
  };

  // Socket & Price History Logic
  useEffect(() => {
    if (!token) return;

    if (!socket.connected) socket.connect();

    const fetchInitialHistory = async () => {
      try {
        const data = await apiRequest(ENDPOINTS.TICKER_HISTORY(selectedTicker));
        setHistory(data);
      } catch (err: any) {
        if (err.message.includes('Unauthorized')) handleLogout();
      }
    };

    fetchInitialHistory();

    socket.on('priceUpdate', (data: Record<string, number>) => {
      setPrices(current => {
        setPrevPrices(current);
        return data;
      });

      if (data[selectedTicker]) {
        setHistory(prev => [...prev, {
          time: new Date().toLocaleTimeString(),
          price: data[selectedTicker]
        }].slice(-50));
      }
    });

    socket.on('priceAlert', (data) => {
      setActiveAlert(data);
      setTimeout(() => setActiveAlert(null), 6000);
    });

    return () => {
      socket.off('priceUpdate');
      socket.off('priceAlert');
    };
  }, [selectedTicker, token]);

  if (!token) {
    return (
      <Login
        onLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        error={loginError}
      />
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 md:p-8">

      {/* Emerald Alert Overlay */}
      {activeAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-white/20">
            <div className="bg-white/20 p-2 rounded-lg animate-pulse">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase opacity-80">Market Alert: {activeAlert.symbol}</p>
              <p className="font-bold text-sm">{activeAlert.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic text-slate-800 dark:text-white">
              Trading<span className="text-emerald-500">Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-red-500 transition-all shadow-sm active:scale-95"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-90"
            >
              {isDark ? <Sun className="text-yellow-400 w-5 h-5" /> : <Moon className="text-slate-600 w-5 h-5" />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-col h-[600px]">
            <div className="flex items-center gap-2 mb-4 px-1">
              <Activity className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Live Markets</h2>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {Object.keys(prices).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <p className="text-xs font-medium">Loading Markets...</p>
                </div>
              ) : (
                Object.entries(prices).map(([symbol, price]) => (
                  <TickerCard
                    key={symbol}
                    symbol={symbol}
                    price={price}
                    prevPrice={prevPrices[symbol]}
                    isActive={selectedTicker === symbol}
                    onClick={() => { setSelectedTicker(symbol); setHistory([]); }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Chart Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-xl h-[600px] flex flex-col transition-all">
              {!prices[selectedTicker] ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                    <div className="absolute inset-0 blur-xl bg-emerald-500/20 animate-pulse"></div>
                  </div>
                  <p className="text-slate-400 font-medium animate-pulse">Connecting to exchange...</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white">{selectedTicker}</h3>
                        <span className="animate-pulse text-[10px] bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-600 font-bold uppercase tracking-widest">Live</span>
                      </div>
                      <p className="text-sm text-slate-400 font-medium mt-1">Real-time market execution</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                      <div className="text-xs text-slate-400 font-bold uppercase mb-1">Price USD</div>
                      <div className="text-3xl font-mono font-bold text-emerald-500">
                        ${prices[selectedTicker]?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 w-full overflow-hidden">
                    <PriceChart data={history} symbol={selectedTicker} isDark={isDark} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b98133; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
}

export default App;