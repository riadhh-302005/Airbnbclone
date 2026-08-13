'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Listing } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  isGuestFavorite?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, isGuestFavorite = true }) => {
  const { favoritesMap, toggleFavorite } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    listing.images && listing.images.length > 0
      ? listing.images.map((i) => i.image_url)
      : ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1000&auto=format&fit=crop&q=80'];

  const isFavorite = !!favoritesMap[listing.id];

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  const twoNightPrice = (listing.price_per_night * 2).toLocaleString();

  return (
    <div className="group cursor-pointer flex flex-col gap-2 relative">
      {/* Image Container with Slider */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-xs">
        <Link href={`/listing/${listing.id}`} className="block w-full h-full">
          <img
            src={images[currentImageIndex]}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Guest Favourite Badge */}
        {isGuestFavorite && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-neutral-900 font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md z-10 border border-neutral-200">
            Guest favourite
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full hover:scale-110 active:scale-95 transition z-10 drop-shadow-md"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite
                ? 'fill-[#FF385C] text-[#FF385C]'
                : 'fill-black/30 text-white stroke-[2.5]'
            }`}
          />
        </button>

        {/* Slider Nav Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/95 text-neutral-800 opacity-0 group-hover:opacity-100 hover:scale-110 transition shadow-md z-10"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/95 text-neutral-800 opacity-0 group-hover:opacity-100 hover:scale-110 transition shadow-md z-10"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {images.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white w-2.5' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Container */}
      <Link href={`/listing/${listing.id}`} className="flex flex-col gap-0.5 mt-0.5">
        <h3 className="font-bold text-neutral-900 text-sm truncate">
          {listing.property_type} in {listing.city}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
          <span className="font-semibold text-neutral-900">₹{twoNightPrice}</span>
          <span>for 2 nights</span>
          <span>·</span>
          <div className="flex items-center gap-0.5 text-neutral-900 font-bold">
            <Star className="w-3 h-3 fill-neutral-900 text-neutral-900" />
            <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
