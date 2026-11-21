import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  MapPin,
  ArrowUpRight,
  ShieldAlert,
  Layers,
  Sparkles,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { valuationService } from '../services/valuationService';
import { HISTORICAL_PRICE_TRENDS } from '../data/mockData';
import { formatRate } from '../utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '../components/ui';

export default function MarketAnalysisPage() {
  const [benchmarks, setBenchmarks] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [activeCityTab, setActiveCityTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await valuationService.getLocalityBenchmarks();
        setBenchmarks(data);
        if (data.length > 0) setSelectedLocality(data[0]);
      } catch (err) {
        console.error('Failed to load benchmarks', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBenchmarks = activeCityTab === 'ALL'
    ? benchmarks
    : benchmarks.filter((b) => b.city.toLowerCase() === activeCityTab.toLowerCase());

  // Comparison chart data formatted for Recharts
  const comparisonData = benchmarks.map((b) => ({
    name: b.locality.replace('Sector ', 'Sec '),
    city: b.city,
    rate: b.averageRateSqFt,
    growth: b.yoyGrowthPct,
    yield: b.rentalYieldPct,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" /> Comprehensive NCR Micro-Market Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-500" /> Market Analysis & Locality Trends
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Capital appreciation rates, rental yields, inventory supply, and comparative capital values across NCR.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {['ALL', 'Gurugram', 'Noida', 'Ghaziabad', 'Delhi NCR'].map((city) => (
            <button
              key={city}
              onClick={() => setActiveCityTab(city)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeCityTab === city
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Comparative Bar Chart: Rate per Sq.Ft across NCR Corridors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Locality Price Benchmark Comparison (₹ / sq.ft)</CardTitle>
            <CardDescription>Capital price index across NCR sub-markets</CardDescription>
          </div>
          <Badge variant="default" className="text-xs">Live Q3 2026 Indices</Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(val, name) => [
                    name === 'rate' ? `₹${val.toLocaleString('en-IN')}/sq.ft` : `${val}%`,
                    name === 'rate' ? 'Average Capital Rate' : 'YoY Growth',
                  ]}
                />
                <Bar dataKey="rate" fill="#3b82f6" radius={[6, 6, 0, 0]} name="rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout: Locality Benchmarks Grid & Detailed Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Benchmarks Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Micro-Market Benchmark Directory
          </h3>

          <div className="space-y-2.5">
            {filteredBenchmarks.map((b) => {
              const isSelected = selectedLocality?.locality === b.locality;
              return (
                <div
                  key={b.locality}
                  onClick={() => setSelectedLocality(b)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-[#0e1626]/80 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-base">{b.locality}</span>
                        <Badge variant="secondary" className="text-[10px] py-0">{b.city}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{b.topDriver}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-white block">
                        {formatRate(b.averageRateSqFt)}
                      </span>
                      <span className="text-xs text-emerald-400 font-medium inline-flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> +{b.yoyGrowthPct}% YoY
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Locality Deep Dive (5 Cols) */}
        <div className="lg:col-span-5">
          {selectedLocality ? (
            <Card className="sticky top-20 border-blue-500/30">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="default" className="text-xs mb-1.5">{selectedLocality.city}</Badge>
                    <CardTitle className="text-xl">{selectedLocality.locality}</CardTitle>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Demand Index</span>
                    <span className="text-xl font-black text-blue-400 font-mono">
                      {selectedLocality.demandIndex}/100
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Average Rate</span>
                    <strong className="text-white text-base">{formatRate(selectedLocality.averageRateSqFt)}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">YoY Price Surge</span>
                    <strong className="text-emerald-400 text-base">+{selectedLocality.yoyGrowthPct}%</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Gross Rental Yield</span>
                    <strong className="text-blue-400 text-base">{selectedLocality.rentalYieldPct}% p.a.</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Inventory Absorption</span>
                    <strong className="text-white text-base">{selectedLocality.inventoryMonths} Months</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1">Growth Drivers & Catalysts:</strong>
                  {selectedLocality.topDriver}
                </div>

                {/* Macro Trend Timeline */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 block mb-2">Quarterly Appreciation Curve</span>
                  <div className="h-36 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={HISTORICAL_PRICE_TRENDS.slice(-6)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="yearQuarter" stroke="#64748b" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} hide />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                        />
                        <Line
                          type="monotone"
                          dataKey={selectedLocality.city === 'Gurugram' ? 'Gurugram' : selectedLocality.city === 'Noida' ? 'Noida' : 'Ghaziabad'}
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          dot={{ r: 3, fill: '#3b82f6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-500">
              Select a micro-market on the left to inspect detailed telemetry.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
