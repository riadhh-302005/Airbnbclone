'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Plus, Trash2, Building2 } from 'lucide-react';

export default function CreateListingPage() {
  const router = useRouter();
  const { user, showToast } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Beachfront');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [pricePerNight, setPricePerNight] = useState<number | ''>(5000);
  const [cleaningFee, setCleaningFee] = useState<number | ''>(800);
  const [serviceFee, setServiceFee] = useState<number | ''>(500);
  const [maxGuests, setMaxGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const AMENITY_OPTIONS = ['Wifi', 'Air conditioning', 'Pool', 'Free parking', 'Kitchen', 'Hot tub', 'Beach access', 'Dedicated workspace', 'Fireplace', 'BBQ grill'];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Wifi', 'Air conditioning', 'Kitchen']);

  const PROPERTY_TYPES = ['Beachfront', 'Cabins', 'Mansions', 'Amazing views', 'Amazing pools', 'Luxury', 'Countryside', 'Design', 'Trending', 'Mountains'];

  const toggleAmenity = (amen: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amen) ? prev.filter((a) => a !== amen) : [...prev, amen]
    );
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setImageUrls((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim() || !city.trim()) {
      showToast('Please fill out all required fields', 'error');
      return;
    }
    if (!pricePerNight || Number(pricePerNight) <= 0) {
      showToast('Please enter a valid price per night', 'error');
      return;
    }
    if (imageUrls.length === 0) {
      showToast('Please provide at least one photo URL', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createListing({
        host_id: user.id,
        title: title.trim(),
        description: description.trim(),
        property_type: propertyType,
        location: location.trim(),
        country: country.trim(),
        city: city.trim(),
        price_per_night: Number(pricePerNight),
        cleaning_fee: Number(cleaningFee) || 0,
        service_fee: Number(serviceFee) || 0,
        max_guests: maxGuests,
        bedrooms: bedrooms,
        beds: beds,
        bathrooms: bathrooms,
        images: imageUrls,
        amenities: selectedAmenities,
      });

      showToast('Listing created successfully!', 'success');
      router.push('/host');
    } catch (err: any) {
      showToast(err.message || 'Failed to create listing', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 font-bold text-sm mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Host Dashboard</span>
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-[#FF385C]" />
          <h1 className="text-3xl font-black text-neutral-900">Create New Property Listing</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-50 p-8 rounded-3xl border border-neutral-200">
          {/* Basics Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">1. Basic Overview</h3>
            <div>
              <label className="text-xs font-bold text-neutral-700 mb-1 block">Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Cliffside Oceanfront Villa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-medium bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 mb-1 block">Description *</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your property in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-medium bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-medium bg-white"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Location Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Goa"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-medium bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-medium bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Country *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-medium bg-white"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Capacity */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">2. Pricing & Capacity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Price per night (₹) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-medium bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Cleaning fee (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-medium bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Service fee (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={serviceFee}
                  onChange={(e) => setServiceFee(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-medium bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Max Guests</label>
                <input
                  type="number"
                  min={1}
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 text-sm font-medium bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Bedrooms</label>
                <input
                  type="number"
                  min={1}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 text-sm font-medium bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Beds</label>
                <input
                  type="number"
                  min={1}
                  value={beds}
                  onChange={(e) => setBeds(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 text-sm font-medium bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Bathrooms</label>
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 text-sm font-medium bg-white"
                />
              </div>
            </div>
          </div>

          {/* Amenities Selection */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">3. Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITY_OPTIONS.map((amen) => {
                const isChecked = selectedAmenities.includes(amen);
                return (
                  <button
                    key={amen}
                    type="button"
                    onClick={() => toggleAmenity(amen)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition text-left flex items-center justify-between ${
                      isChecked ? 'border-neutral-900 bg-white shadow-xs' : 'border-neutral-200 bg-white/50 text-neutral-500'
                    }`}
                  >
                    <span>{amen}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300'}`}>
                      {isChecked && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photos URLs */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-2">4. Photos (URLs)</h3>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste Unsplash image URL (e.g. https://images.unsplash.com/...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl border border-neutral-300 text-sm font-medium bg-white"
              />
              <button
                type="button"
                onClick={addImage}
                className="bg-neutral-900 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-200 group">
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Submit */}
          <div className="pt-6 border-t border-neutral-200 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3.5 rounded-2xl border border-neutral-300 font-bold text-neutral-700 text-sm hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF385C] hover:bg-rose-600 text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-lg text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Listing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
