import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Award,
  AlertTriangle,
  BarChart3,
  Wallet,
} from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { cn } from "../lib/utils";
import type { TradeStats } from "../types/trade";

interface TradingChartsProps {
  stats: TradeStats;
}

const COLORS = {
  win: "var(--color-win, #34d399)",
  loss: "var(--color-loss, #f87171)",
  primary: "#3b82f6",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md bg-opacity-80">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
          Lệnh #{label}
        </p>
        <p className="text-sm font-bold text-white">
          Số dư:{" "}
          <span className="text-emerald-400">
            ${payload[0].value.toFixed(2)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function TradingCharts({ stats }: TradingChartsProps) {
  const [futuresBalance] = useLocalStorage<number>("futures_balance", 0);

  // Current Assets = Initial Calculator Balance + All PnL recorded in journal
  const currentAssets = futuresBalance + stats.totalPnl;

  // Prepare pie chart data
  const winLossData = [
    { name: "Thắng", value: stats.wins || 0, color: COLORS.win },
    { name: "Thua", value: stats.losses || 0, color: COLORS.loss },
  ];

  // Prepare balance curve data
  const balanceData = (stats.balanceHistory || [])
    .map((item, index) => ({
      index: index + 1,
      balance: Number(item.balance || 0),
      date: item.timestamp
        ? new Date(item.timestamp).toLocaleDateString("vi-VN")
        : `Trade ${index + 1}`,
    }))
    .filter((item) => !isNaN(item.balance));

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          icon={<Wallet className="w-3 h-3" />}
          label="Tài Sản Hiện Tại"
          value={`$${currentAssets.toFixed(2)}`}
          subValue={`Gốc: $${futuresBalance.toFixed(2)}`}
          color={
            currentAssets >= futuresBalance
              ? "text-emerald-400"
              : "text-amber-400"
          }
          delay={0}
        />
        <StatCard
          icon={<Award className="w-3 h-3" />}
          label="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          subValue={`${stats.wins}W / ${stats.losses}L`}
          color={stats.winRate >= 50 ? "text-emerald-400" : "text-red-400"}
          delay={0.1}
        />
        <StatCard
          icon={<TrendingUp className="w-3 h-3" />}
          label="Tổng PnL"
          value={`${stats.totalPnl >= 0 ? "+" : ""}$${stats.totalPnl.toFixed(2)}`}
          color={stats.totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}
          delay={0.2}
        />
        <StatCard
          icon={<AlertTriangle className="w-3 h-3" />}
          label="Max Drawdown"
          value={`-$${stats.maxDrawdown.toFixed(2)}`}
          color="text-orange-400"
          delay={0.3}
        />
        <StatCard
          icon={<BarChart3 className="w-3 h-3" />}
          label="Tổng Lệnh"
          value={stats.totalTrades.toString()}
          subValue={`${stats.openTrades} đang mở`}
          subColor="text-yellow-400 font-medium"
          delay={0.4}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Win Rate Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 flex flex-col items-center justify-center lg:col-span-1"
        >
          <h4 className="w-full text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
            Tỷ Lệ Thắng/Thua
          </h4>
          <div className="relative w-full aspect-square max-h-[220px]">
            {stats.wins + stats.losses > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ strokeOpacity: 0.2 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                Chưa có dữ liệu
              </div>
            )}
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">
                {stats.winRate.toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                Win Rate
              </span>
            </div>
          </div>
          <div className="w-full mt-4 flex justify-between gap-2 px-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-400">
                Thắng ({stats.wins})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs text-slate-400">
                Thua ({stats.losses})
              </span>
            </div>
          </div>
        </motion.div>

        {/* Balance Curve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 lg:col-span-2"
        >
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
            Đường Cong Lợi Nhuận
          </h4>
          <div className="w-full h-[240px]">
            {balanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceData}>
                  <defs>
                    <linearGradient
                      id="colorBalance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="index"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={{ stroke: "#334155", strokeWidth: 1 }}
                    tickLine={false}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={{ stroke: "#334155", strokeWidth: 1 }}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                Hệ thống chưa ghi nhận lợi nhuận
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  color,
  subColor,
  delay,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-900/80 backdrop-blur-xs rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-colors group"
    >
      <div className="flex items-center gap-2 mb-2 text-slate-500 group-hover:text-slate-400 transition-colors">
        {icon}
        <p className="text-[10px] uppercase tracking-wider font-semibold">
          {label}
        </p>
      </div>
      <p className={cn("text-2xl font-bold tracking-tight", color)}>{value}</p>
      {subValue && (
        <p className={cn("text-[10px] mt-1 text-slate-500", subColor)}>
          {subValue}
        </p>
      )}
    </motion.div>
  );
}
