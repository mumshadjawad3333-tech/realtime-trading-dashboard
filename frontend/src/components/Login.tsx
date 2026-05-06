import React from 'react';
import { TrendingUp, User, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (e: React.FormEvent) => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  error: string;
}

export const Login: React.FC<LoginProps> = ({ 
  onLogin, username, setUsername, password, setPassword, error 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500 p-4 rounded-2xl mb-4 shadow-lg shadow-emerald-500/30">
            <TrendingUp className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
            Trading<span className="text-emerald-500">Dashboard</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2">Enter credentials to access live feed</p>
        </div>

        <form onSubmit={onLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
          <button type="submit" className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};