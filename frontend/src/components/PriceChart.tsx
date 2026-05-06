import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface ChartProps {
  data: { time: string; price: number }[];
  symbol: string;
  isDark: boolean;
}

export const PriceChart = ({ data, symbol, isDark }: ChartProps) => {
  /**
   * SAFETY GUARD: Recharts will attempt to call .slice() on the data prop.
   * If the data is undefined or not an array, the application will crash.
   */
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-900/20">
        <div className="animate-pulse mb-2">📊</div>
        <p className="text-sm italic">Waiting for {symbol} market data...</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDark ? "#334155" : "#e2e8f0"}
          />

          <XAxis
            dataKey="time"
            hide={true}
          />

          <YAxis
            domain={['auto', 'auto']}
            orientation="right"
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            // Uses Internationalization API for compact numbers (e.g., $45K instead of $45000)
            tickFormatter={(val) =>
              `$${new Intl.NumberFormat('en-US', {
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(val)}`
            }
          />

          <Tooltip
            labelClassName="text-slate-400 text-xs mb-1"
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              color: isDark ? '#f8fafc' : '#1e293b'
            }}
            itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
            // Use 'any' for the value to bypass the internal Recharts ValueType union
            formatter={(value: any) => {
              if (value === undefined || value === null) return ["N/A", "Price"];

              // Ensure we are working with a number (handles string or number)
              const numericValue = typeof value === 'string' ? parseFloat(value) : value;

              // Check if numericValue is a valid number before formatting
              const displayValue = !isNaN(numericValue)
                ? `$${numericValue.toLocaleString()}`
                : "N/A";

              return [displayValue, "Price"] as [string, string];
            }}
          />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
            // Optimization: Disable animation for streaming data to prevent UI lag
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};