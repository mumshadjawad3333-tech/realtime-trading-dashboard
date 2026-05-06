import React from 'react';

interface TickerCardProps {
  symbol: string;
  price: number;
  prevPrice: number;
  isActive: boolean;
  onClick: () => void;
}

export const TickerCard: React.FC<TickerCardProps> = ({ 
  symbol, 
  price, 
  prevPrice, 
  isActive, 
  onClick 
}) => {
  const isUp = price >= (prevPrice || price);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
        isActive 
        ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/5' 
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className={`font-bold transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}>
          {symbol}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isUp ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
          {isUp ? '▲' : '▼'}
        </span>
      </div>
      <div className={`text-xl font-mono font-bold mt-2 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
        ${price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </button>
  );
};