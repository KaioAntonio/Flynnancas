import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Percent, PiggyBank, Target, Sparkles, Wallet } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Flynnancas() {
  const [initialAmount, setInitialAmount] = useState(0);
  const [monthlyDeposit, setMonthlyDeposit] = useState(1000);
  const [interestRate, setInterestRate] = useState(1);
  const [timeValue, setTimeValue] = useState(12);
  const [timeUnit, setTimeUnit] = useState('months');

  const totalMonths = timeUnit === 'years' ? timeValue * 12 : timeValue;

  const calculations = useMemo(() => {
    const monthlyRate = interestRate / 100;
    let data = [];
    let balance = initialAmount;
    let totalDeposited = initialAmount;

    if (initialAmount > 0) {
      data.push({
        month: 0,
        label: 'Início',
        balance: Math.round(initialAmount),
        deposited: initialAmount,
        earnings: 0
      });
    }

    for (let month = 1; month <= totalMonths; month++) {
      totalDeposited += monthlyDeposit;
      balance = (balance + monthlyDeposit) * (1 + monthlyRate);
      
      if (totalMonths <= 24 || month % Math.ceil(totalMonths / 24) === 0 || month === totalMonths) {
        data.push({
          month,
          label: month === 1 ? '1 mês' : `${month} meses`,
          balance: Math.round(balance),
          deposited: totalDeposited,
          earnings: Math.round(balance - totalDeposited)
        });
      }
    }

    return {
      finalBalance: balance,
      totalDeposited,
      totalEarnings: balance - totalDeposited,
      data
    };
  }, [initialAmount, monthlyDeposit, interestRate, totalMonths]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Formato compacto para mobile
  const formatCurrencyCompact = (value) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 100000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return formatCurrency(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl">
          <p className="text-slate-400 text-sm mb-2">{data.label}</p>
          <p className="text-emerald-400 font-semibold">Saldo: {formatCurrency(data.balance)}</p>
          <p className="text-blue-400 text-sm">Depositado: {formatCurrency(data.deposited)}</p>
          <p className="text-purple-400 text-sm">Rendimento: {formatCurrency(data.earnings)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Flynnanças
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Simule seus investimentos e veja seu dinheiro crescer
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Initial Amount */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-500/20 p-2 rounded-xl">
                  <Wallet className="w-5 h-5 text-amber-400" />
                </div>
                <label className="text-slate-300 font-medium">Valor Inicial (quanto já tem)</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">R$</span>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-2xl font-semibold text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  placeholder="0"
                />
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="500"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                className="w-full mt-4 accent-amber-500"
              />
            </div>

            {/* Monthly Deposit */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-500/20 p-2 rounded-xl">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <label className="text-slate-300 font-medium">Aporte Mensal</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">R$</span>
                <input
                  type="number"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-2xl font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
              <input
                type="range"
                min="100"
                max="50000"
                step="100"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-full mt-4 accent-emerald-500"
              />
            </div>

            {/* Interest Rate */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-500/20 p-2 rounded-xl">
                  <Percent className="w-5 h-5 text-purple-400" />
                </div>
                <label className="text-slate-300 font-medium">Rendimento Mensal</label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-4 pr-12 text-2xl font-semibold text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full mt-4 accent-purple-500"
              />
            </div>

            {/* Time Period */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-cyan-500/20 p-2 rounded-xl">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                </div>
                <label className="text-slate-300 font-medium">Período</label>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={timeValue}
                    onChange={(e) => setTimeValue(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-4 text-2xl font-semibold text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
                <div className="flex bg-slate-900/50 rounded-2xl p-1 border border-slate-700">
                  <button
                    onClick={() => setTimeUnit('months')}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      timeUnit === 'months'
                        ? 'bg-cyan-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Meses
                  </button>
                  <button
                    onClick={() => setTimeUnit('years')}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      timeUnit === 'years'
                        ? 'bg-cyan-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Anos
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Main Result Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 border border-emerald-500/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Saldo Final</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={calculations.finalBalance}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 break-all"
                  >
                    {formatCurrency(calculations.finalBalance)}
                  </motion.div>
                </AnimatePresence>
                
                {/* Cards responsivos - CORRIGIDO */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {/* Valor Inicial */}
                  <div className="bg-slate-900/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 text-amber-400 mb-1">
                      <Wallet className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs uppercase tracking-wider truncate">Inicial</span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white truncate">
                      <span className="hidden sm:inline">{formatCurrency(initialAmount)}</span>
                      <span className="sm:hidden">{formatCurrencyCompact(initialAmount)}</span>
                    </p>
                  </div>
                  
                  {/* Total Investido */}
                  <div className="bg-slate-900/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 text-blue-400 mb-1">
                      <PiggyBank className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs uppercase tracking-wider truncate">Investido</span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white truncate">
                      <span className="hidden sm:inline">{formatCurrency(calculations.totalDeposited)}</span>
                      <span className="sm:hidden">{formatCurrencyCompact(calculations.totalDeposited)}</span>
                    </p>
                  </div>
                  
                  {/* Rendimento */}
                  <div className="bg-slate-900/50 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 text-purple-400 mb-1">
                      <Target className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs uppercase tracking-wider truncate">Rendimento</span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-emerald-400 truncate">
                      <span className="hidden sm:inline">+{formatCurrency(calculations.totalEarnings)}</span>
                      <span className="sm:hidden">+{formatCurrencyCompact(calculations.totalEarnings)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-700/50">
              <h3 className="text-slate-300 font-medium mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Evolução do Patrimônio
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calculations.data}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDeposited" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      width={40}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="deposited"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorDeposited)"
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBalance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 sm:gap-6 mt-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs sm:text-sm text-slate-400">Saldo Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs sm:text-sm text-slate-400">Total Investido</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 text-slate-500 text-sm"
        >
          <p>Feito por Kaio Flynn</p>
        </motion.div>
      </div>
    </div>
  );
}