'use client';

import React, { useState } from 'react';
import { Search, X, MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';
import { GuestSelector } from './GuestSelector';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (params: { location: string; checkIn: string; checkOut: string; guests: number }) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'where' | 'dates' | 'who'>('where');

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location,
      checkIn,
      checkOut,
      guests: adults + childrenCount,
    });
    onClose();
  };

  const POPULAR_DESTINATIONS = ['Goa', 'Manali', 'Mumbai', 'Jaipur', 'Bali', 'Santorini', 'Paris', 'Dubai'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-neutral-100 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">Search Stays</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Row */}
        <form onSubmit={handleSearchSubmit} className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-2 bg-neutral-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('where')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === 'where' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Where</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dates')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === 'dates' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Dates</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('who')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === 'who' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Guests</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'where' && (
            <div className="flex flex-col gap-4">
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Search Destination
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search destinations (e.g. Goa, Manali, Bali...)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-medium"
                />
              </div>

              <p className="text-xs font-bold text-neutral-400 mt-2">Popular Destinations</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => setLocation(dest)}
                    className="px-3.5 py-2 rounded-full border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-neutral-900 hover:bg-neutral-50 transition"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dates' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2 block">
                  Check In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2 block">
                  Check Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {activeTab === 'who' && (
            <GuestSelector
              adults={adults}
              childrenCount={childrenCount}
              onChange={(a, c) => {
                setAdults(a);
                setChildrenCount(c);
              }}
            />
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-neutral-100 pt-4 mt-2">
            <button
              type="button"
              onClick={() => {
                setLocation('');
                setCheckIn('');
                setCheckOut('');
                setAdults(1);
                setChildrenCount(0);
              }}
              className="text-xs font-bold text-neutral-500 hover:text-neutral-900 underline"
            >
              Clear all
            </button>
            <button
              type="submit"
              className="bg-[#FF385C] hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-2xl transition shadow-md flex items-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
