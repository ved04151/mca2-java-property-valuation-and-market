import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calculator,
  IndianRupee,
  Layers,
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  Save,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { valuationService } from '../services/valuationService';
import { useAuth } from '../context/AuthContext';
import { formatINR, formatRate, formatArea } from '../utils/formatters';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../components/ui';
import { toast } from 'sonner';

export default function ValuationCalculatorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form State initialized with either query params or intelligent defaults
  const [formData, setFormData] = useState({
    propertyTitle: searchParams.get('title') || 'Sector 78 Highrise Apartment',
    propertyId: searchParams.get('propId') || null,
    clientName: 'Aditya Birla Housing Finance',
    city: searchParams.get('city') || 'Noida',
    locality: searchParams.get('locality') || 'Sector 78',
    propertyType: searchParams.get('type') || 'Apartment',
    areaSqFt: Number(searchParams.get('area')) || 1850,
    bhk: Number(searchParams.get('bhk')) || 3,
    ageYears: 3,
    condition: 'Good',
    amenitiesCount: 6,
    floorLevel: 8,
    notes: 'Primary residential valuation appraisal for loan underwriting.',
  });

  const [calculation, setCalculation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-run calculation on mount
  useEffect(() => {
    handleRunCalculation();
  }, []);

  const handleRunCalculation = async (e) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    try {
      const result = await valuationService.calculateValuation(formData);
      setCalculation(result);
    } catch (err) {
      toast.error('Calculation failed', { description: err.message });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!calculation) return;
    setIsSaving(true);
    try {
      const saved = await valuationService.saveValuation(
        {
          ...calculation,
          propertyTitle: formData.propertyTitle,
          propertyId: formData.propertyId,
          clientName: formData.clientName,
          notes: formData.notes,
        },
        user
      );
      toast.success('Valuation report saved', {
        description: 'Successfully archived to Valuation History.',
      });
      navigate('/history');
    } catch (err) {
      toast.error('Failed to save valuation', { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" /> Algorithmic NCR Real Estate Valuation Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Calculator className="w-7 h-7 text-blue-500" /> Valuation Calculator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Simulate fair market values, micro-market premiums, structural depreciation, and confidence brackets across NCR.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Parameters Input Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appraisal Parameters</CardTitle>
              <CardDescription>Configure physical and spatial inputs</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRunCalculation} className="space-y-4">
                <div>
                  <Label required>Property Reference Title</Label>
                  <Input
                    value={formData.propertyTitle}
                    onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                    placeholder="e.g. ATS Knightsbridge Sky Villa"
                  />
                </div>

                <div>
                  <Label required>Client / Financial Institution</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. HDFC Home Loans / Private Buyer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label required>NCR City</Label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Gurugram">Gurugram</option>
                      <option value="Noida">Noida</option>
                      <option value="Ghaziabad">Ghaziabad</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                    </select>
                  </div>
                  <div>
                    <Label required>Locality / Sector</Label>
                    <select
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Golf Course Road">Golf Course Road (Gurugram)</option>
                      <option value="Sector 65">Sector 65 (Gurugram)</option>
                      <option value="Sector 124">Sector 124 (Noida)</option>
                      <option value="Sector 78">Sector 78 (Noida)</option>
                      <option value="Sector 143">Sector 143 (Noida)</option>
                      <option value="Indirapuram">Indirapuram (Ghaziabad)</option>
                      <option value="Raj Nagar Extension">Raj Nagar Ext (Ghaziabad)</option>
                      <option value="Vasant Vihar">Vasant Vihar (Delhi NCR)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label required>Property Type</Label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Penthouse">Penthouse (+25%)</option>
                      <option value="Independent House / Villa">Independent Villa (+35%)</option>
                      <option value="Commercial Office">Commercial (+40%)</option>
                    </select>
                  </div>
                  <div>
                    <Label required>Area (Super sq.ft)</Label>
                    <Input
                      type="number"
                      value={formData.areaSqFt}
                      onChange={(e) => setFormData({ ...formData, areaSqFt: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>BHK</Label>
                    <Input
                      type="number"
                      value={formData.bhk}
                      onChange={(e) => setFormData({ ...formData, bhk: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Age (Years)</Label>
                    <Input
                      type="number"
                      value={formData.ageYears}
                      onChange={(e) => setFormData({ ...formData, ageYears: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Floor Level</Label>
                    <Input
                      type="number"
                      value={formData.floorLevel}
                      onChange={(e) => setFormData({ ...formData, floorLevel: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Condition</Label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Excellent">Excellent (+12%)</option>
                      <option value="Good">Good (+6%)</option>
                      <option value="Average">Average (0%)</option>
                      <option value="Poor">Poor (-10%)</option>
                    </select>
                  </div>
                  <div>
                    <Label>Amenities Tier</Label>
                    <select
                      value={formData.amenitiesCount}
                      onChange={(e) => setFormData({ ...formData, amenitiesCount: Number(e.target.value) })}
                      className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={8}>Ultra Luxury (8+ club amenities)</option>
                      <option value={5}>Standard Highrise (5-7 amenities)</option>
                      <option value={2}>Basic Society (1-3 amenities)</option>
                      <option value={0}>Standalone (No amenities)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Surveyor Appraisal Notes</Label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg p-2.5 border border-slate-700/80 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  isLoading={isCalculating}
                  className="w-full h-11 text-sm gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Calculator className="w-4 h-4" /> Recalculate Fair Valuation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Calculation Results & Mathematical Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {calculation && (
            <>
              {/* Highlight Output Banner */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-900/60 via-[#0e1626] to-indigo-950/70 border border-blue-500/30 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="default" className="text-xs bg-blue-500/20 text-blue-300">
                        {calculation.locality}, {calculation.city}
                      </Badge>
                      <Badge variant="success" className="text-xs">
                        {calculation.confidenceScore}% Confidence Index
                      </Badge>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 block">
                      Estimated Fair Market Value
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                      {formatINR(calculation.estimatedPrice)}
                    </h2>
                    <p className="text-xs text-blue-400 font-mono mt-1 font-semibold">
                      Effective Rate: {formatRate(calculation.adjustedRateSqFt)}
                    </p>
                  </div>

                  <div className="sm:text-right bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Indicative Range Bracket</span>
                    <div className="text-sm font-bold text-slate-200">
                      {formatINR(calculation.priceRangeLow, { compact: true })} - {formatINR(calculation.priceRangeHigh, { compact: true })}
                    </div>
                    <span className="text-[10px] text-slate-500">±5% volatility window</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Based on circle rates, current transaction yields, and verified NCR comps.</span>
                  </div>
                  <Button
                    onClick={handleSaveToHistory}
                    isLoading={isSaving}
                    variant="default"
                    size="sm"
                    className="gap-2 shadow-md shadow-blue-600/30"
                  >
                    <Save className="w-4 h-4" /> Save Valuation Record
                  </Button>
                </div>
              </div>

              {/* Step-by-Step Breakdown Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Valuation Formula Breakdown</CardTitle>
                  <CardDescription>Itemized financial adjustments calculated on base sq.ft rate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-white font-medium block">Benchmark Base Land & Structure Value</span>
                      <span className="text-xs text-slate-400">
                        {formatRate(calculation.breakdown.baseRatePerSqFt)} × {formatArea(calculation.areaSqFt)}
                      </span>
                    </div>
                    <span className="font-semibold text-white">
                      {formatINR(calculation.breakdown.baseValue)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-white font-medium block">Building Condition Premium</span>
                      <span className="text-xs text-slate-400">Specification: {formData.condition}</span>
                    </div>
                    <span className={`font-semibold ${calculation.breakdown.conditionAdjustment >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {calculation.breakdown.conditionAdjustment >= 0 ? '+' : ''}
                      {formatINR(calculation.breakdown.conditionAdjustment)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-white font-medium block">Amenities & Club Infrastructure</span>
                      <span className="text-xs text-slate-400">{formData.amenitiesCount} society amenities integrated</span>
                    </div>
                    <span className="font-semibold text-emerald-400">
                      +{formatINR(calculation.breakdown.amenitiesAdjustment)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-white font-medium block">Age & Structural Depreciation</span>
                      <span className="text-xs text-slate-400">{formData.ageYears} years aging factor</span>
                    </div>
                    <span className="font-semibold text-rose-400">
                      {formatINR(calculation.breakdown.depreciationDeduction)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-sm">
                    <div>
                      <span className="text-white font-medium block">Highrise / Elevation Premium</span>
                      <span className="text-xs text-slate-400">Floor level: {formData.floorLevel}</span>
                    </div>
                    <span className="font-semibold text-blue-400">
                      +{formatINR(calculation.breakdown.floorAdjustment)}
                    </span>
                  </div>

                  {/* Total Line */}
                  <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between mt-2">
                    <span className="font-bold text-white text-base">Net Assessed Market Price</span>
                    <span className="font-extrabold text-blue-400 text-lg">
                      {formatINR(calculation.estimatedPrice)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Locality Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Locality Intelligence & Demand</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-400 space-y-2">
                  <p>
                    <strong className="text-slate-200">Sector Benchmark: </strong>
                    {calculation.benchmark?.topDriver || 'High connectivity corridor with strong capital appreciation.'}
                  </p>
                  <div className="flex items-center gap-4 pt-1 font-mono">
                    <span>Average Rate: <strong className="text-white">{formatRate(calculation.benchmark?.averageRateSqFt || 25000)}</strong></span>
                    <span>YoY Appreciation: <strong className="text-emerald-400">+{calculation.benchmark?.yoyGrowthPct || 14}%</strong></span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
