'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { CategoryBar } from '../components/layout/CategoryBar';
import { SectionRow } from '../components/listings/SectionRow';
import { ListingGrid } from '../components/listings/ListingGrid';
import { SearchModal } from '../components/search/SearchModal';
import { FilterModal } from '../components/search/FilterModal';
import { Footer } from '../components/layout/Footer';
import { Listing, SearchFilters } from '../types';
import { api } from '../lib/api';
import { Sparkles, Hotel, Home as HomeIcon, Compass, ConciergeBell } from 'lucide-react';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeNavTab, setActiveNavTab] = useState('All');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const loadListings = async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      const data = await api.getListings(filters);
      setListings(data);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const combinedFilters: SearchFilters = {
      ...searchFilters,
      category: selectedCategory || undefined,
    };
    loadListings(combinedFilters);
  }, [selectedCategory, searchFilters]);

  const handleSearchSubmit = (searchParams: {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    setSearchFilters((prev) => ({
      ...prev,
      location: searchParams.location || undefined,
      guests: searchParams.guests || undefined,
    }));
  };

  const handleApplyFilters = (newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
  };

  // Filter listings according to active top tab (All | Homes | Experiences | Services)
  const displayListings = listings.filter((l) => {
    if (activeNavTab === 'All') return true;
    const ptype = (l.property_type || '').toLowerCase();
    const desc = (l.description || '').toLowerCase();
    const title = (l.title || '').toLowerCase();

    if (activeNavTab === 'Homes') {
      return (
        ptype.includes('house') ||
        ptype.includes('apartment') ||
        ptype.includes('villa') ||
        ptype.includes('mansion') ||
        ptype.includes('cabin') ||
        ptype.includes('countryside') ||
        ptype.includes('flat') ||
        title.includes('home') ||
        title.includes('villa') ||
        title.includes('apartment')
      );
    }

    if (activeNavTab === 'Experiences') {
      return (
        ptype.includes('cabin') ||
        ptype.includes('beach') ||
        ptype.includes('mountain') ||
        desc.includes('jungle') ||
        desc.includes('experience') ||
        title.includes('treehouse') ||
        title.includes('zen') ||
        title.includes('sanctuary') ||
        title.includes('chalet') ||
        title.includes('lodge')
      );
    }

    if (activeNavTab === 'Services') {
      return (
        ptype.includes('hotel') ||
        ptype.includes('luxury') ||
        desc.includes('concierge') ||
        desc.includes('butler') ||
        desc.includes('spa') ||
        title.includes('hotel') ||
        title.includes('palace') ||
        title.includes('resort') ||
        title.includes('spa')
      );
    }

    return true;
  });

  const goaListings = displayListings.filter(
    (l) => l.location.toLowerCase().includes('goa') || l.city.toLowerCase().includes('goa')
  );

  const lonavalaListings = displayListings.filter(
    (l) => l.location.toLowerCase().includes('lonavala') || l.city.toLowerCase().includes('lonavala')
  );

  const hotelListings = displayListings.filter(
    (l) => l.property_type.toLowerCase().includes('hotel') || l.title.toLowerCase().includes('hotel')
  );

  const activeFiltersCount = Object.keys(searchFilters).filter(
    (k) => searchFilters[k as keyof SearchFilters] !== undefined
  ).length;

  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900">
      {/* Header Navbar with Top Navigation Tabs (All | Homes | Experiences | Services) */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        activeNavTab={activeNavTab}
        onSelectNavTab={(tab) => {
          setActiveNavTab(tab);
          setSelectedCategory('');
        }}
      />

      {/* Horizontal Category Icons Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenFilterModal={() => setIsFilterOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full bg-white">
        {/* Active Tab Badge Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Browsing Category:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-[#FF385C] rounded-full text-xs font-extrabold border border-rose-100">
              {activeNavTab === 'All' && <Sparkles className="w-3.5 h-3.5" />}
              {activeNavTab === 'Homes' && <HomeIcon className="w-3.5 h-3.5" />}
              {activeNavTab === 'Experiences' && <Compass className="w-3.5 h-3.5" />}
              {activeNavTab === 'Services' && <ConciergeBell className="w-3.5 h-3.5" />}
              <span>{activeNavTab} Stays ({displayListings.length} properties)</span>
            </span>
          </div>
        </div>

        {/* Active Filter Badges */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" />
              Active Filters:
            </span>
            {searchFilters.location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold text-neutral-800">
                Location: {searchFilters.location}
              </span>
            )}
            {searchFilters.guests && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold text-neutral-800">
                Guests: {searchFilters.guests}+
              </span>
            )}
            {searchFilters.property_type && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold text-neutral-800">
                Type: {searchFilters.property_type}
              </span>
            )}
            <button
              onClick={() => setSearchFilters({})}
              className="text-xs font-bold text-[#FF385C] hover:underline ml-2"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Home View Mode: Show Section Rows when no specific category filter is active */}
        {!selectedCategory && activeFiltersCount === 0 ? (
          <div>
            {/* Section 1: Popular homes in North Goa */}
            <SectionRow
              title="Popular homes in North Goa"
              listings={goaListings.length > 0 ? goaListings : displayListings.slice(0, 6)}
            />

            {/* Section 2: Available in Lonavala & Hill Resorts */}
            <SectionRow
              title="Available in Lonavala this weekend"
              listings={lonavalaListings.length > 0 ? lonavalaListings : displayListings.slice(4, 11)}
            />

            {/* Section 3: Luxury Hotels & Spa Resorts */}
            {hotelListings.length > 0 && (
              <SectionRow
                title="Premier Hotels & Luxury Spa Resorts"
                listings={hotelListings}
              />
            )}

            {/* Section 4: All Stays Grid */}
            <div className="mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4">
                Explore All {activeNavTab} Properties ({displayListings.length})
              </h2>
              <ListingGrid listings={displayListings} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          /* Filtered View Mode: Show Responsive Grid */
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">
              {selectedCategory ? `${selectedCategory} Stays` : 'Search Results'} ({displayListings.length})
            </h2>
            <ListingGrid listings={displayListings} isLoading={isLoading} />
          </div>
        )}
      </main>

      <Footer />

      {/* Search & Filter Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearchSubmit}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={searchFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
