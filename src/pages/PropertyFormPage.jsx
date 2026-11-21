import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Building2,
  ArrowLeft,
  Save,
  CheckCircle,
  HelpCircle,
  Sparkles,
  MapPin,
  IndianRupee,
} from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import { ImageUpload } from '../components/ImageUpload';
import { toast } from 'sonner';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  city: z.string().min(2, 'Please select or enter a city'),
  locality: z.string().min(2, 'Locality/Sector is required'),
  address: z.string().min(5, 'Address is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a valid 6-digit Indian PIN code'),
  propertyType: z.string().min(2, 'Property type is required'),
  bhk: z.coerce.number().min(0, 'BHK must be 0 or higher'),
  bathrooms: z.coerce.number().min(1, 'At least 1 bathroom is required'),
  areaSqFt: z.coerce.number().min(100, 'Area must be at least 100 sq.ft'),
  price: z.coerce.number().min(100000, 'Price must be at least ₹1,00,000'),
  status: z.string().min(1, 'Status is required'),
  furnishing: z.string().min(1, 'Furnishing is required'),
  floor: z.string().optional(),
  ageOfPropertyYears: z.coerce.number().min(0, 'Age must be 0 or higher'),
  facing: z.string().optional(),
  parking: z.string().optional(),
  description: z.string().min(15, 'Please provide a descriptive overview (at least 15 chars)'),
});

const DEFAULT_AMENITIES_OPTIONS = [
  'Power Backup',
  'Swimming Pool',
  'Clubhouse',
  'Gym & Spa',
  'Children Play Area',
  '24/7 Security CCTV',
  'EV Charging Station',
  'Gated Community',
  'Private Lawn',
  'Intercom',
  'Reserved Car Parking',
  'Metro Proximity (<1km)',
];

export default function PropertyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [images, setImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      city: 'Noida',
      locality: 'Sector 78',
      address: '',
      pincode: '201305',
      propertyType: 'Apartment',
      bhk: 3,
      bathrooms: 2,
      areaSqFt: 1450,
      price: 13500000,
      status: 'Ready to Move',
      furnishing: 'Semi-Furnished',
      floor: '8th of 22',
      ageOfPropertyYears: 3,
      facing: 'North-East',
      parking: '1 Covered',
      description: 'Well-lit corner unit in gated development close to expressway and public transport hubs.',
    },
  });

  useEffect(() => {
    if (isEditMode) {
      async function loadProperty() {
        try {
          const prop = await propertyService.getPropertyById(id);
          reset(prop);
          setImages(prop.images || []);
          setSelectedAmenities(prop.amenities || []);
        } catch (err) {
          toast.error('Failed to load property details', { description: err.message });
          navigate('/properties');
        } finally {
          setLoading(false);
        }
      }
      loadProperty();
    }
  }, [id, isEditMode]);

  const toggleAmenity = (item) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
        amenities: selectedAmenities,
      };

      if (isEditMode) {
        await propertyService.updateProperty(id, payload);
        toast.success('Property updated successfully');
      } else {
        const created = await propertyService.createProperty(payload);
        toast.success('New property listed successfully');
      }
      navigate('/properties');
    } catch (err) {
      toast.error('Save failed', { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400">Loading property data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>
        <span className="text-xs text-blue-400 font-mono">
          {isEditMode ? `ID: ${id}` : 'Drafting New NCR Listing'}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-500" />
          {isEditMode ? 'Edit Property Listing' : 'Add New Property Listing'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Provide complete structural, geographical, and pricing parameters for accurate valuation indexing.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Basic Identification & Location</CardTitle>
            <CardDescription>Primary title and geographical placement in Delhi NCR</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label required>Property Title / Project Name</Label>
              <Input
                {...register('title')}
                placeholder="e.g. DLF The Crest Luxury Suite, Golf Course Rd"
                error={errors.title?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label required>City</Label>
                <select
                  {...register('city')}
                  className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Gurugram">Gurugram</option>
                  <option value="Noida">Noida</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
                {errors.city && <p className="mt-1 text-xs text-rose-400">{errors.city.message}</p>}
              </div>

              <div>
                <Label required>Locality / Sector</Label>
                <Input
                  {...register('locality')}
                  placeholder="e.g. Sector 124, Indirapuram"
                  error={errors.locality?.message}
                />
              </div>

              <div>
                <Label required>PIN Code</Label>
                <Input
                  {...register('pincode')}
                  placeholder="e.g. 201301"
                  error={errors.pincode?.message}
                />
              </div>
            </div>

            <div>
              <Label required>Complete Street Address</Label>
              <Input
                {...register('address')}
                placeholder="Tower No, Unit / Plot No, Road name, Landmark"
                error={errors.address?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Dimensions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Dimension & Pricing Details</CardTitle>
            <CardDescription>Financial terms, carpet area, and unit configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label required>Property Type</Label>
                <select
                  {...register('propertyType')}
                  className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Independent House / Villa">Independent Villa</option>
                  <option value="Commercial Office">Commercial Office</option>
                  <option value="Plot / Land">Plot / Land</option>
                </select>
              </div>

              <div>
                <Label required>Total Asking Price (₹ INR)</Label>
                <Input
                  type="number"
                  {...register('price')}
                  placeholder="e.g. 15000000"
                  error={errors.price?.message}
                />
              </div>

              <div>
                <Label required>Super Area (sq.ft)</Label>
                <Input
                  type="number"
                  {...register('areaSqFt')}
                  placeholder="e.g. 1850"
                  error={errors.areaSqFt?.message}
                />
              </div>

              <div>
                <Label>Bedrooms (BHK)</Label>
                <Input
                  type="number"
                  {...register('bhk')}
                  placeholder="e.g. 3"
                  error={errors.bhk?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label required>Bathrooms</Label>
                <Input
                  type="number"
                  {...register('bathrooms')}
                  placeholder="e.g. 3"
                  error={errors.bathrooms?.message}
                />
              </div>

              <div>
                <Label>Construction Status</Label>
                <select
                  {...register('status')}
                  className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Resale">Resale</option>
                </select>
              </div>

              <div>
                <Label>Furnishing</Label>
                <select
                  {...register('furnishing')}
                  className="w-full bg-[#090f1d] text-sm text-slate-200 rounded-lg px-3 py-2 border border-slate-700/80 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div>
                <Label>Age of Property (Years)</Label>
                <Input
                  type="number"
                  {...register('ageOfPropertyYears')}
                  placeholder="e.g. 2"
                  error={errors.ageOfPropertyYears?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Floor Level</Label>
                <Input
                  {...register('floor')}
                  placeholder="e.g. 14th of 26"
                />
              </div>
              <div>
                <Label>Balcony / Main Facing</Label>
                <Input
                  {...register('facing')}
                  placeholder="e.g. North-East, Park Facing"
                />
              </div>
              <div>
                <Label>Parking Allocation</Label>
                <Input
                  {...register('parking')}
                  placeholder="e.g. 2 Covered Basement"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media & Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">3. Media & Society Amenities</CardTitle>
            <CardDescription>Visual assets and community infrastructure features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUpload images={images} onChange={setImages} />

            <div>
              <Label className="mb-2">Selected Amenities & Highlights</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {DEFAULT_AMENITIES_OPTIONS.map((item) => {
                  const isChecked = selectedAmenities.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleAmenity(item)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition ${
                        isChecked
                          ? 'bg-blue-600/15 border-blue-500/50 text-blue-300 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-600'
                        }`}
                      >
                        {isChecked && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className="truncate">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label required>Property Description & Highlights</Label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Describe spatial qualities, panoramic views, renovation status, connectivity to major roads..."
                className="w-full bg-[#090f1d] text-sm text-slate-200 placeholder:text-slate-500 rounded-lg p-3 border border-slate-700/80 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-400">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/properties')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            isLoading={submitting}
            className="gap-2 shadow-lg shadow-blue-600/30 min-w-40"
          >
            <Save className="w-4 h-4" />
            {isEditMode ? 'Update Listing' : 'Publish Property'}
          </Button>
        </div>
      </form>
    </div>
  );
}
