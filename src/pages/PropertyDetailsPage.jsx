import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  MapPin,
  Calendar,
  Layers,
  Compass,
  Car,
  ShieldCheck,
  Calculator,
  Edit,
  Trash2,
  Share2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { formatINR, formatArea, formatRate } from '../utils/formatters';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        toast.error('Listing Not Found', { description: err.message });
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await propertyService.deleteProperty(id);
      toast.success('Property deleted successfully');
      navigate('/properties');
    } catch (err) {
      toast.error('Deletion failed', { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400">Loading full property profile...</p>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5"
          >
            <Share2 className="w-4 h-4" /> Share
          </Button>
          {property.addedBy === user?.id && <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/properties/${id}/edit`)}
              className="gap-1.5"
            >
              <Edit className="w-4 h-4" /> Edit Listing
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </>}
        </div>
      </div>

      {/* Main Property Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="default">{property.propertyType}</Badge>
            <Badge variant="secondary">{property.status}</Badge>
            {property.verified && (
              <span className="flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified NCR Asset
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {property.title}
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{property.address}, {property.locality}, {property.city} - {property.pincode}</span>
          </p>
        </div>

        <div className="md:text-right">
          <div className="text-3xl font-black text-white">
            {formatINR(property.price)}
          </div>
          <p className="text-sm font-semibold text-blue-400 font-mono mt-0.5">
            {formatRate(property.pricePerSqFt)}
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-3">
        <div className="h-80 sm:h-[460px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl relative">
          <img
            src={property.images[activeImageIdx] || property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white">
            Photo {activeImageIdx + 1} of {property.images.length}
          </div>
        </div>

        {property.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  activeImageIdx === idx ? 'border-blue-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Facts / Specifications Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Property Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Super Built-up Area</span>
                  <strong className="text-white text-base">{formatArea(property.areaSqFt)}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Bedrooms / Baths</span>
                  <strong className="text-white text-base">{property.bhk ? `${property.bhk} BHK` : 'Commercial'} • {property.bathrooms} Bath</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Floor Level</span>
                  <strong className="text-white text-base">{property.floor || 'N/A'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Furnishing Status</span>
                  <strong className="text-white text-base">{property.furnishing}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Property Age</span>
                  <strong className="text-white text-base">{property.ageOfPropertyYears} Years</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Facing / Aspect</span>
                  <strong className="text-white text-base">{property.facing || 'East'}</strong>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Amenities List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Infrastructure & Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(property.amenities || []).map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Valuation CTA & Locality snapshot */}
        <div className="space-y-6">
          {/* Quick Valuation CTA Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-900/50 via-slate-900 to-indigo-950/40 border border-blue-500/30 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-400 mb-3 border border-blue-500/30">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Appraise This Property</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Run our NCR predictive valuation model for this property's sector and specifications to determine exact fair market worth.
              </p>
              <Button
                variant="default"
                className="w-full mt-4 gap-2 shadow-lg shadow-blue-600/30"
                onClick={() =>
                  navigate(
                    `/valuation?city=${encodeURIComponent(property.city)}&locality=${encodeURIComponent(
                      property.locality
                    )}&area=${property.areaSqFt}&bhk=${property.bhk}&type=${encodeURIComponent(
                      property.propertyType
                    )}&title=${encodeURIComponent(property.title)}&propId=${property.id}`
                  )
                }
              >
                <Calculator className="w-4 h-4" /> Launch Valuation Model
              </Button>
            </div>
          </div>

          {/* Micro Locality Benchmark snapshot */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sector Market Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Locality</span>
                <span className="font-semibold text-white">{property.locality}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">City Jurisdiction</span>
                <span className="font-semibold text-white">{property.city}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Current Listing Price</span>
                <span className="font-semibold text-blue-400">{formatINR(property.price, { compact: true })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Listing Rate</span>
                <span className="font-mono text-emerald-400 font-semibold">{formatRate(property.pricePerSqFt)}</span>
              </div>

              <div className="pt-2">
                <Link
                  to={`/market-analysis`}
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 text-xs"
                >
                  View complete NCR Market Trends <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete Property"
        message="Are you sure you want to remove this property listing from the platform? This cannot be undone."
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
