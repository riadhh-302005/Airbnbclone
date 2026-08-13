'use client';

import React, { useRef } from 'react';
import { Listing } from '../../types';
import { ListingCard } from './ListingCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface SectionRowProps {
  title: string;
  listings: Listing[];
  onViewMore?: () => void;
}

export const SectionRow: React.FC<SectionRowProps> = ({ title, listings, onViewMore }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (listings.length === 0) return null;

  return (
    <div className="my-10">
      {/* Section Header with Arrow Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onViewMore}
          className="flex items-center gap-2 group text-left"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 group-hover:underline">
            {title}
          </h2>
          <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center transition">
            <ArrowRight className="w-4 h-4 text-neutral-900" />
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="w-8 h-8 rounded-full border border-neutral-300 hover:border-neutral-900 flex items-center justify-center transition hover:bg-neutral-50"
          >
            <ChevronLeft className="w-4 h-4 text-neutral-700" />
          </button>
          <button
            onClick={scrollRight}
            className="w-8 h-8 rounded-full border border-neutral-300 hover:border-neutral-900 flex items-center justify-center transition hover:bg-neutral-50"
          >
            <ChevronRight className="w-4 h-4 text-neutral-700" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
      >
        {listings.map((listing) => (
          <div key={listing.id} className="w-[260px] sm:w-[280px] shrink-0">
            <ListingCard listing={listing} isGuestFavorite={true} />
          </div>
        ))}
      </div>
    </div>
  );
};
