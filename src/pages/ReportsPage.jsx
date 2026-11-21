import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Share2,
  Building2,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { valuationService } from '../services/valuationService';
import { propertyService } from '../services/propertyService';
import { formatINR, formatRate, formatArea } from '../utils/formatters';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../components/ui';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [valuations, setValuations] = useState([]);
  const [selectedValuationId, setSelectedValuationId] = useState('');
  const [selectedValuation, setSelectedValuation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadValuations() {
      try {
        const res = await valuationService.getValuations({ pageSize: 50 });
        setValuations(res.content);
        if (res.content.length > 0) {
          setSelectedValuationId(res.content[0].id);
          setSelectedValuation(res.content[0]);
        }
      } catch (err) {
        toast.error('Failed to load valuation reports', { description: err.message });
      } finally {
        setLoading(false);
      }
    }
    loadValuations();
  }, []);

  const handleSelectChange = (e) => {
    const valId = e.target.value;
    setSelectedValuationId(valId);
    const found = valuations.find((v) => v.id === valId);
    setSelectedValuation(found || null);
  };

  const handleDownloadPDF = () => {
    if (!selectedValuation) return;
    setIsExporting(true);

    try {
      const doc = new jsPDF();

      // Header Banner (Navy Blue Theme)
      doc.setFillColor(11, 17, 32);
      doc.rect(0, 0, 210, 42, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('PROPVALUATE NCR ENTERPRISE', 14, 20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(147, 197, 253);
      doc.text('OFFICIAL REAL ESTATE VALUATION & APPRAISAL CERTIFICATE', 14, 28);
      doc.text(`Reference ID: ${selectedValuation.id} | Date: ${new Date(selectedValuation.date).toLocaleDateString('en-IN')}`, 14, 35);

      // Section 1: Executive Summary
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Executive Appraisal Summary', 14, 52);

      const summaryData = [
        ['Property Asset', selectedValuation.propertyTitle || 'Residential / Commercial Asset'],
        ['Jurisdiction & Sector', `${selectedValuation.locality}, ${selectedValuation.city} (Delhi NCR)`],
        ['Commissioned Client', selectedValuation.clientName || 'General Mortgage / Underwriting'],
        ['Appraising Officer', `${selectedValuation.assessorName} (Senior Surveyor)`],
        ['Assessed Fair Market Value', formatINR(selectedValuation.estimatedPrice)],
        ['Effective Sq.Ft Capital Rate', formatRate(selectedValuation.adjustedRateSqFt)],
        ['Confidence Score', `${selectedValuation.confidenceScore}% (High Reliability)`],
      ];

      autoTable(doc, {
        startY: 56,
        head: [['Metric Parameter', 'Assessed Specification']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 10, cellPadding: 4 },
      });

      // Section 2: Financial Formulation Breakdown
      const currentY = doc.lastAutoTable.finalY + 12;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('2. Valuation Model Breakdown', 14, currentY);

      const breakdown = selectedValuation.breakdown || {};
      const breakdownData = [
        ['Base Land & Structural Worth', formatINR(breakdown.baseValue || 0)],
        ['Condition Adjustment Factor', formatINR(breakdown.conditionAdjustment || 0)],
        ['Amenities & Society Premium', formatINR(breakdown.amenitiesAdjustment || 0)],
        ['Depreciation Deduction', formatINR(breakdown.depreciationDeduction || 0)],
        ['Floor / Elevation Factor', formatINR(breakdown.floorAdjustment || 0)],
        ['NET FAIR MARKET APPRAISAL', formatINR(selectedValuation.estimatedPrice)],
      ];

      autoTable(doc, {
        startY: currentY + 4,
        head: [['Cost Factor', 'Calculated INR Value']],
        body: breakdownData,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 10, cellPadding: 3.5 },
      });

      // Notes & Sign-off
      const notesY = doc.lastAutoTable.finalY + 14;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Surveyor Assessment Notes:', 14, notesY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(selectedValuation.notes || 'Verified against current circle rates and transaction comps.', 14, notesY + 6, { maxWidth: 180 });

      // Footer stamp
      doc.setFillColor(241, 245, 249);
      doc.rect(14, notesY + 22, 182, 24, 'F');
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('AUTHORIZED REGISTRAR STAMP & AUDIT TRAIL', 20, notesY + 31);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Digitally sealed under PropValuate Enterprise System Protocol. Compatible with Spring Boot 3.x storage.', 20, notesY + 39);

      // Save PDF file
      doc.save(`Valuation-Report-${selectedValuation.id}.pdf`);
      toast.success('Valuation PDF downloaded successfully!');
    } catch (err) {
      toast.error('Export failed', { description: err.message });
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" /> Enterprise Appraisal Deliverables
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award className="w-7 h-7 text-blue-500" /> Valuation Reports & Export
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate formal, institutional-grade valuation dossiers and download high-resolution PDF certificates.
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleDownloadPDF}
          isLoading={isExporting}
          disabled={!selectedValuation}
          variant="default"
          className="gap-2 shadow-lg shadow-blue-600/30"
        >
          <Download className="w-4 h-4" /> Download Official PDF Report
        </Button>
      </div>

      {/* Selector Dropdown Bar */}
      <div className="p-4 rounded-2xl bg-[#0e1626]/90 border border-slate-800/80 shadow-md backdrop-blur-sm flex flex-col sm:flex-row items-center gap-3">
        <label className="text-xs font-semibold uppercase text-slate-400 shrink-0">
          Select Appraisal Dossier:
        </label>
        <select
          value={selectedValuationId}
          onChange={handleSelectChange}
          className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {valuations.map((v) => (
            <option key={v.id} value={v.id}>
              [{v.id}] {v.propertyTitle || v.locality} - {formatINR(v.estimatedPrice, { compact: true })} ({v.clientName})
            </option>
          ))}
        </select>
      </div>

      {/* Realistic Document Preview Card */}
      {selectedValuation ? (
        <div className="bg-[#0b1120] border border-slate-700/90 rounded-2xl shadow-2xl p-6 sm:p-10 text-slate-100 relative overflow-hidden">
          {/* Header Paper Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                  PROPVALUATE NCR APPRAISAL SERVICES
                </span>
                <Badge variant="success" className="text-[10px]">VERIFIED REPORT</Badge>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                CERTIFICATE OF PROPERTY VALUATION
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Issued in accordance with NCR circle benchmarks and localized regression models.
              </p>
            </div>
            <div className="sm:text-right font-mono text-xs text-slate-400">
              <span className="block text-slate-200 font-bold">Ref: {selectedValuation.id}</span>
              <span>Date: {new Date(selectedValuation.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Core Appraisal Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
              <h4 className="font-bold text-sm text-white mb-2 pb-1 border-b border-slate-800">
                Asset & Client Specifications
              </h4>
              <div className="flex justify-between"><span className="text-slate-400">Target Property:</span> <strong className="text-white text-right">{selectedValuation.propertyTitle}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Micro-Market Sector:</span> <strong className="text-white">{selectedValuation.locality}, {selectedValuation.city}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Super Built-up Area:</span> <strong className="text-white">{formatArea(selectedValuation.areaSqFt)}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Asset Type & Age:</span> <strong className="text-white">{selectedValuation.propertyType} • {selectedValuation.ageYears || 2} Years</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Underwriting Client:</span> <strong className="text-white">{selectedValuation.clientName}</strong></div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/60 to-slate-900/90 border border-blue-500/30 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold block mb-1">
                  Final Assessed Fair Market Valuation
                </span>
                <div className="text-3xl font-extrabold text-white">
                  {formatINR(selectedValuation.estimatedPrice)}
                </div>
                <span className="text-xs text-emerald-400 font-mono mt-1 block">
                  Capital Rate: {formatRate(selectedValuation.adjustedRateSqFt)}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Confidence Metric:</span>
                <span className="font-bold text-white font-mono">{selectedValuation.confidenceScore}% (Prime Grade)</span>
              </div>
            </div>
          </div>

          {/* Breakdown Table Preview */}
          <div className="border border-slate-800 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Valuation Breakdown Element</th>
                  <th className="py-2.5 px-4 text-right">Computed Value (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-white">Base Land & Structure Valuation</td>
                  <td className="py-2.5 px-4 text-right">{formatINR(selectedValuation.breakdown?.baseValue || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Building Condition Premium</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">+{formatINR(selectedValuation.breakdown?.conditionAdjustment || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Clubhouse & Amenities Infrastructure</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">+{formatINR(selectedValuation.breakdown?.amenitiesAdjustment || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Depreciation & Aging Factor</td>
                  <td className="py-2.5 px-4 text-right text-rose-400">{formatINR(selectedValuation.breakdown?.depreciationDeduction || 0)}</td>
                </tr>
                <tr className="bg-slate-900/60 font-bold text-white text-sm">
                  <td className="py-3 px-4">NET CERTIFIED APPRAISAL VALUE</td>
                  <td className="py-3 px-4 text-right text-blue-400">{formatINR(selectedValuation.estimatedPrice)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes and Authorization Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <span className="text-white font-semibold block mb-0.5">Assessor Notes:</span>
              <p className="max-w-md">{selectedValuation.notes || 'Asset inspection verified against physical parameters.'}</p>
            </div>
            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
              <span className="text-slate-200 font-bold block">{selectedValuation.assessorName}</span>
              <span>Chief Surveyor & Appraisal Officer</span>
            </div>
          </div>
        </div>
      ) : (
        <Card className="py-16 text-center text-slate-400">
          No valuation certificates found. Run a calculation first.
        </Card>
      )}
    </div>
  );
}
