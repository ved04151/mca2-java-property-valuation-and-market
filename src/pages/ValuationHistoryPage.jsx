import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Calendar,
  User,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Download,
  FileCheck2,
} from 'lucide-react';
import { valuationService } from '../services/valuationService';
import { formatINR, formatRate, formatArea } from '../utils/formatters';
import { Button, Input, Badge, Card, Skeleton } from '../components/ui';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function ValuationHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [valuations, setValuations] = useState([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchValuations = async () => {
    setLoading(true);
    try {
      const res = await valuationService.getValuations({
        search,
        city,
        page,
        pageSize: 8,
      });
      setValuations(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (err) {
      toast.error('Failed to load history', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValuations();
  }, [search, city, page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await valuationService.deleteValuation(deleteId);
      toast.success('Valuation record deleted');
      setDeleteId(null);
      fetchValuations();
    } catch (err) {
      toast.error('Deletion failed', { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-blue-500" /> Valuation History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Archived appraisal certificates, valuation calculations, and underwriting logs across NCR.
          </p>
        </div>
        <Button
          onClick={() => navigate('/valuation')}
          variant="default"
          className="gap-2 shadow-lg shadow-blue-600/20"
        >
          <Calculator className="w-4 h-4" /> Conduct New Valuation
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0e1626]/90 border border-slate-800/80 shadow-md backdrop-blur-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by property, client, or locality..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#090f1d] text-sm text-slate-200 placeholder:text-slate-500 rounded-lg pl-9 pr-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All NCR Cities</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Noida">Noida</option>
              <option value="Ghaziabad">Ghaziabad</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Total Records: <strong className="text-white">{totalElements}</strong> valuations</span>
          {(search || city !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setCity('ALL');
                setPage(1);
              }}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Records Table Card */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/40">
                <th className="py-3.5 px-4">Valuation ID & Date</th>
                <th className="py-3.5 px-4">Property / Location</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Area & Specs</th>
                <th className="py-3.5 px-4">Assessed Value</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading records...
                  </td>
                </tr>
              ) : valuations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No valuation records found matching search criteria.
                  </td>
                </tr>
              ) : (
                valuations.map((val) => (
                  <tr
                    key={val.id}
                    className="hover:bg-slate-800/40 transition group"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-blue-400 font-semibold block">{val.id}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(val.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block max-w-xs truncate">
                        {val.propertyTitle || 'Direct Land Valuation'}
                      </span>
                      <span className="text-xs text-slate-400">{val.locality}, {val.city}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 text-xs block font-medium">
                        {val.clientName || 'Standard Appraisal'}
                      </span>
                      <span className="text-[11px] text-slate-500">By {val.assessorName}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-mono text-xs block">
                        {formatArea(val.areaSqFt)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {val.bhk ? `${val.bhk} BHK • ` : ''}{val.propertyType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white text-base block">
                        {formatINR(val.estimatedPrice)}
                      </span>
                      <span className="text-xs text-emerald-400 font-mono">
                        {formatRate(val.adjustedRateSqFt)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="success" className="text-xs">
                        {val.confidenceScore}% Score
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate('/reports')}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          title="Generate Formal Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {val.assessorId === user?.id && <button
                          onClick={() => setDeleteId(val.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="Delete valuation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Valuation Record"
        message="Are you sure you want to delete this historical appraisal certificate from the system?"
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
