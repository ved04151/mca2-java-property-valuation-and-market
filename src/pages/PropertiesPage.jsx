import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  Plus,
  SlidersHorizontal,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Trash2,
  Edit,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { formatINR, formatArea, formatRate } from '../utils/formatters';
import { Button, Input, Badge, Card, Skeleton } from '../components/ui';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'ALL');
  const [propertyType, setPropertyType] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  // Data States
  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await propertyService.getProperties({
        search,
        city,
        propertyType,
        sortBy,
        page,
        pageSize: 6,
      });
      setProperties(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (err) {
      toast.error('Failed to load properties', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [search, city, propertyType, sortBy, page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await propertyService.deleteProperty(deleteId);
      toast.success('Property deleted successfully');
      setDeleteId(null);
      fetchProperties();
    } catch (err) {
      toast.error('Deletion failed', { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-500" /> Delhi NCR Properties
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, inspect, filter and manage premium inventory in Gurugram, Noida, and Ghaziabad.
          </p>
        </div>
        <Button
          onClick={() => navigate('/properties/new')}
          variant="default"
          className="gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add New Property
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0e1626]/90 border border-slate-800/80 shadow-md backdrop-blur-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, sector, or address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#090f1d] text-sm text-slate-200 placeholder:text-slate-500 rounded-lg pl-9 pr-3 py-2 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              <option value="ALL">All NCR Cities</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Noida">Noida</option>
              <option value="Ghaziabad">Ghaziabad</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div>
            <select
              value={propertyType}
              onChange={(e) => {
                setPropertyType(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Independent House / Villa">Independent Villa</option>
              <option value="Commercial Office">Commercial Office</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              <option value="newest">Sort: Newly Listed</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="areaDesc">Area: Largest First</option>
              <option value="rateDesc">Rate: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Found <strong className="text-white">{totalElements}</strong> properties matching parameters</span>
          {(search || city !== 'ALL' || propertyType !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setCity('ALL');
                setPropertyType('ALL');
                setSortBy('newest');
                setPage(1);
              }}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
              <Skeleton className="h-48 w-full rounded-xl mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No properties match your filter</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting different cities or clearing active criteria.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch('');
              setCity('ALL');
              setPropertyType('ALL');
            }}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <Card
              key={prop.id}
              className="group overflow-hidden flex flex-col justify-between hover:border-blue-500/50 hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge variant="default" className="backdrop-blur-md bg-black/60 text-white border-white/20">
                      {prop.propertyType}
                    </Badge>
                    {prop.verified && (
                      <span className="flex items-center gap-1 text-[10px] bg-emerald-500/90 text-white font-medium px-2 py-0.5 rounded-full shadow">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-xs font-mono bg-blue-600/90 text-white font-bold px-2 py-1 rounded-md shadow">
                      {formatRate(prop.pricePerSqFt)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{prop.locality}, {prop.city}</span>
                  </div>

                  <h3
                    onClick={() => navigate(`/properties/${prop.id}`)}
                    className="text-base font-semibold text-white group-hover:text-blue-400 cursor-pointer line-clamp-1 transition"
                  >
                    {prop.title}
                  </h3>

                  <div className="mt-3 text-xl font-extrabold text-white">
                    {formatINR(prop.price)}
                  </div>

                  {/* Property Specs Pill Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4 text-slate-500" />
                      <span>{prop.bhk ? `${prop.bhk} BHK` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-slate-500" />
                      <span>{prop.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-slate-500" />
                      <span className="truncate">{prop.areaSqFt} sq.ft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between gap-2">
                <Button
                  variant="subtle"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => navigate(`/properties/${prop.id}`)}
                >
                  View Details
                </Button>
                {prop.addedBy === user?.id && <button
                  onClick={() => navigate(`/properties/${prop.id}/edit`)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Edit listing"
                >
                  <Edit className="w-4 h-4" />
                </button>}
                {prop.addedBy === user?.id && <button
                  onClick={() => setDeleteId(prop.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  title="Delete property"
                >
                  <Trash2 className="w-4 h-4" />
                </button>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
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

      {/* Confirmation Dialog for Deletion */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Property Listing"
        message="Are you sure you want to permanently delete this NCR property listing? This action cannot be undone."
        confirmText="Delete Listing"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
