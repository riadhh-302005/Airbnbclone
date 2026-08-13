'use client';

import React from 'react';
import { Listing } from '../../types';
import { ListingCard } from './ListingCard';
import { ListingSkeleton } from './ListingSkeleton';
import { SearchX } from 'lucide-react';

interface ListingGridProps {
  listings: Listing[];
  isLoading?: boolean;
}

export const ListingGrid: React.FC<ListingGridProps> = ({ listings, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 my-8">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ListingSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-rose-50 text-[#FF385C] rounded-full flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">No listings found</h3>
        <p className="text-sm text-neutral-500 mb-6">
          Try adjusting your search criteria or clearing filters to explore more properties.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 my-8">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};
