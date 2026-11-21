import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Calculator,
  TrendingUp,
  FileCheck2,
  ArrowUpRight,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Search,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { propertyService } from '../services/propertyService';
import { valuationService } from '../services/valuationService';
import { HISTORICAL_PRICE_TRENDS } from '../data/mockData';
import { formatINR, formatArea, formatRate } from '../utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '../components/ui';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [valuations, setValuations] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [propData, valData, benchData] = await Promise.all([
          propertyService.getProperties({ pageSize: 5 }),
          valuationService.getValuations({ pageSize: 5 }),
          valuationService.getLocalityBenchmarks(),
        ]);
        setProperties(propData.content);
        setValuations(valData.content);
        setBenchmarks(benchData);
      } catch (err) {
        console.error('Dashboard load failed', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Compute stat highlights
  const totalValuationVolume = valuations.reduce((acc, v) => acc + (v.estimatedPrice || 0), 0);
  const avgSqFtPrice = Math.round(
    benchmarks.reduce((acc, b) => acc + b.averageRateSqFt, 0) / (benchmarks.length || 1)
  );

  const cityDistribution = [
    { name: 'Gurugram', value: 4, color: '#3b82f6' },
    { name: 'Noida', value: 4, color: '#6366f1' },
    { name: 'Ghaziabad', value: 3, color: '#10b981' },
    { name: 'Delhi NCR', value: 2, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-slate-900/60 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Real Estate Valuation Intelligence • Delhi NCR
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Market Dashboard & Valuation Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Live analytics across Gurugram, Noida Expressway, Delhi NCR, and Ghaziabad corridors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/properties')}
            className="gap-2"
          >
            <Building2 className="w-4 h-4" /> Browse Properties
          </Button>
          <Button
            variant="default"
            onClick={() => navigate('/valuation')}
            className="gap-2 shadow-blue-500/25 shadow-lg"
          >
            <Calculator className="w-4 h-4" /> Quick Valuation
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-blue-500/40 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Total Tracked Properties</span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-white">10+</span>
              <span className="text-xs text-emerald-400 ml-2 font-medium">Verified NCR</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Prime residential & commercial inventory</p>
          </CardContent>
        </Card>

        <Card className="hover:border-indigo-500/40 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Valuations Performed</span>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Calculator className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-white">320+</span>
              <span className="text-xs text-emerald-400 ml-2 font-medium">96% Accuracy</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Automated algorithmic appraisal</p>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-500/40 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Total Portfolio Value</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {formatINR(totalValuationVolume || 580000000, { compact: true })}
              </span>
              <span className="text-xs text-emerald-400 ml-2 font-medium">+16.4% YoY</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Assessed real estate valuation</p>
          </CardContent>
        </Card>

        <Card className="hover:border-amber-500/40 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">NCR Avg Rate / Sq.Ft</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {formatRate(avgSqFtPrice || 21500)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Weighted composite price benchmark</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NCR Price Trend Chart (2 columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">NCR Historical Price Trajectory (₹ / sq.ft)</CardTitle>
              <CardDescription>Multi-year quarterly growth across Gurugram, Noida & Ghaziabad</CardDescription>
            </div>
            <Badge variant="default" className="font-mono text-xs">2023 - 2026</Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HISTORICAL_PRICE_TRENDS}>
                  <defs>
                    <linearGradient id="colorGurugram" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNoida" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="yearQuarter" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}/sq.ft`, '']}
                  />
                  <Area type="monotone" dataKey="Gurugram" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGurugram)" name="Gurugram" />
                  <Area type="monotone" dataKey="Noida" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorNoida)" name="Noida" />
                  <Area type="monotone" dataKey="Ghaziabad" stroke="#10b981" strokeWidth={2} fill="transparent" name="Ghaziabad" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500" /> Gurugram (+18.4% YoY)</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500" /> Noida (+16.5% YoY)</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Ghaziabad (+8.2% YoY)</span>
            </div>
          </CardContent>
        </Card>

        {/* Regional Distribution / Demand */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Corridor Demand Distribution</CardTitle>
            <CardDescription>Active property inquiry share in NCR</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cityDistribution}
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {cityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full mt-2 text-xs">
              {cityDistribution.map((d) => (
                <div key={d.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300 truncate">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Section: Recent Properties & Recent Valuations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties Added */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Featured Properties</CardTitle>
              <CardDescription>Recently updated listings in database</CardDescription>
            </div>
            <Link to="/properties" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {properties.slice(0, 4).map((prop) => (
              <div
                key={prop.id}
                onClick={() => navigate(`/properties/${prop.id}`)}
                className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/60 hover:border-blue-500/30 cursor-pointer transition"
              >
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] py-0">{prop.propertyType}</Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {prop.locality}, {prop.city}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate mt-1">{prop.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="font-semibold text-blue-400">{formatINR(prop.price, { compact: true })}</span>
                    <span>•</span>
                    <span>{formatArea(prop.areaSqFt)}</span>
                    <span>•</span>
                    <span>{prop.bhk ? `${prop.bhk} BHK` : 'Commercial'}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Valuation History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Appraisals</CardTitle>
              <CardDescription>Latest automated valuation records</CardDescription>
            </div>
            <Link to="/history" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
              Full History <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {valuations.slice(0, 4).map((val) => (
              <div
                key={val.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/50 transition"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">
                      {val.propertyTitle || `${val.locality}, ${val.city}`}
                    </span>
                    <Badge variant="success" className="text-[10px] py-0">{val.confidenceScore}% Conf.</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>Client: <strong className="text-slate-300">{val.clientName || 'General Appraisal'}</strong></span>
                    <span>•</span>
                    <span>{new Date(val.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-emerald-400 block">
                    {formatINR(val.estimatedPrice, { compact: true })}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {formatRate(val.adjustedRateSqFt)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
