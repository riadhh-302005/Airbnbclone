'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { SearchFilters } from '../../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const [minPrice, setMinPrice] = useState<number | undefined>(filters.min_price);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(filters.max_price);
  const [propertyType, setPropertyType] = useState<string | undefined>(filters.property_type);
  const [bedrooms, setBedrooms] = useState<number | undefined>(filters.bedrooms);
  const [beds, setBeds] = useState<number | undefined>(filters.beds);
  const [bathrooms, setBathrooms] = useState<number | undefined>(filters.bathrooms);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);

  if (!isOpen) return null;

  const PROPERTY_TYPES = ['All', 'Beachfront', 'Cabins', 'Mansions', 'Amazing views', 'Amazing pools', 'Luxury', 'Countryside'];
  const AMENITIES_LIST = ['Wifi', 'Air conditioning', 'Pool', 'Free parking', 'Kitchen', 'Hot tub', 'Beach access', 'Dedicated workspace', 'Fireplace', 'BBQ grill'];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      ...filters,
      min_price: minPrice,
      max_price: maxPrice,
      property_type: propertyType === 'All' ? undefined : propertyType,
      bedrooms,
      beds,
      bathrooms,
      amenities: selectedAmenities,
    });
    onClose();
  };

  const handleClear = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPropertyType(undefined);
    setBedrooms(undefined);
    setBeds(undefined);
    setBathrooms(undefined);
    setSelectedAmenities([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-neutral-100 max-h-[90vh] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filter Content */}
        <div className="p-6 overflow-y-auto space-y-8">
          {/* Price Range */}
          <div>
            <h3 className="font-bold text-neutral-900 text-sm mb-1">Price range</h3>
            <p className="text-xs text-neutral-500 mb-4">Nightly prices before taxes and fees</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1 block">Minimum (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice ?? ''}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1 block">Maximum (₹)</label>
                <input
                  type="number"
                  placeholder="30000"
                  value={maxPrice ?? ''}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div className="border-t border-neutral-100 pt-6">
            <h3 className="font-bold text-neutral-900 text-sm mb-4">Property Type</h3>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((pt) => {
                const isSelected = (propertyType || 'All') === pt;
                return (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPropertyType(pt)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition border ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                    }`}
                  >
                    {pt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rooms and Beds */}
          <div className="border-t border-neutral-100 pt-6">
            <h3 className="font-bold text-neutral-900 text-sm mb-4">Rooms and Beds</h3>
            <div className="space-y-4">
              {/* Bedrooms */}
              <div>
                <p className="text-xs font-semibold text-neutral-600 mb-2">Bedrooms</p>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBedrooms(num === 0 ? undefined : num)}
                      className={`w-10 h-10 rounded-full border text-xs font-bold transition flex items-center justify-center ${
                        (num === 0 && bedrooms === undefined) || bedrooms === num
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'border-neutral-300 hover:border-neutral-900 text-neutral-700'
                      }`}
                    >
                      {num === 0 ? 'Any' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="border-t border-neutral-100 pt-6">
            <h3 className="font-bold text-neutral-900 text-sm mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES_LIST.map((amen) => {
                const isChecked = selectedAmenities.includes(amen);
                return (
                  <button
                    key={amen}
                    type="button"
                    onClick={() => toggleAmenity(amen)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold transition text-left ${
                      isChecked
                        ? 'border-neutral-900 bg-neutral-50 text-neutral-900'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        isChecked ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-400'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{amen}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-white">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-bold text-neutral-900 underline hover:text-neutral-600"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="bg-neutral-900 hover:bg-black text-white font-bold px-6 py-3 rounded-xl transition text-xs shadow-md"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
};
