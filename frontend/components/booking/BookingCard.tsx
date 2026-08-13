'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Listing, DateRange } from '../../types';
import { DateRangePicker } from './DateRangePicker';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

interface BookingCardProps {
  listing: Listing;
  availability: DateRange[];
}

export const BookingCard: React.FC<BookingCardProps> = ({ listing, availability }) => {
  const router = RouterHook();
  const { showToast } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  function RouterHook() {
    return useRouter();
  }

  // Calculate nights
  let nights = 0;
  if (checkIn && checkOut) {
    try {
      const d1 = parseISO(checkIn);
      const d2 = parseISO(checkOut);
      nights = differenceInDays(d2, d1);
    } catch {
      nights = 0;
    }
  }

  const subtotal = nights > 0 ? listing.price_per_night * nights : 0;
  const cleaningFee = listing.cleaning_fee || 0;
  const serviceFee = listing.service_fee || 0;
  const totalPrice = subtotal > 0 ? subtotal + cleaningFee + serviceFee : 0;

  const handleReserve = () => {
    if (!checkIn || !checkOut || nights <= 0) {
      showToast('Please select valid check-in and check-out dates', 'error');
      return;
    }

    // Pass booking parameters via query params to Checkout Page
    const query = new URLSearchParams({
      check_in: checkIn,
      check_out: checkOut,
      guests: guests.toString(),
    });
    router.push(`/book/${listing.id}?${query.toString()}`);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xl sticky top-28 flex flex-col gap-6">
      {/* Price & Rating Header */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-neutral-900">₹{listing.price_per_night.toLocaleString()}</span>
          <span className="text-xs text-neutral-500 font-medium">night</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-neutral-900">
          <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
          <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          {listing.review_count > 0 && (
            <span className="text-neutral-500 font-normal">({listing.review_count})</span>
          )}
        </div>
      </div>

      {/* Date & Guest Form */}
      <div className="flex flex-col gap-3">
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={(cin, cout) => {
            setCheckIn(cin);
            setCheckOut(cout);
          }}
          disabledRanges={availability}
        />

        {/* Guests Dropdown */}
        <div className="relative border border-neutral-300 rounded-2xl p-3 bg-white">
          <button
            type="button"
            onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 block">
                Guests
              </label>
              <span className="text-xs font-semibold text-neutral-900">
                {guests} {guests === 1 ? 'guest' : 'guests'}
              </span>
            </div>
            {isGuestDropdownOpen ? <ChevronUp className="w-4 h-4 text-neutral-600" /> : <ChevronDown className="w-4 h-4 text-neutral-600" />}
          </button>

          {isGuestDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-neutral-200 rounded-2xl p-4 shadow-xl z-20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-900">Guests</p>
                  <p className="text-[10px] text-neutral-500">Max {listing.max_guests}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                    className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-xs font-bold disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(listing.max_guests, guests + 1))}
                    disabled={guests >= listing.max_guests}
                    className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-xs font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reserve CTA */}
      <button
        onClick={handleReserve}
        className="w-full bg-[#FF385C] hover:bg-rose-600 text-white font-bold py-3.5 rounded-2xl transition shadow-md hover:shadow-lg text-sm"
      >
        Reserve
      </button>

      <p className="text-center text-xs text-neutral-500">You won't be charged yet</p>

      {/* Price Calculations */}
      {nights > 0 && (
        <div className="flex flex-col gap-3 pt-4 border-t border-neutral-200 text-sm">
          <div className="flex justify-between text-neutral-600 text-xs">
            <span className="underline">₹{listing.price_per_night.toLocaleString()} × {nights} nights</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          {cleaningFee > 0 && (
            <div className="flex justify-between text-neutral-600 text-xs">
              <span className="underline">Cleaning fee</span>
              <span>₹{cleaningFee.toLocaleString()}</span>
            </div>
          )}

          {serviceFee > 0 && (
            <div className="flex justify-between text-neutral-600 text-xs">
              <span className="underline">Airbnb service fee</span>
              <span>₹{serviceFee.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between font-extrabold text-neutral-900 text-base pt-3 border-t border-neutral-200">
            <span>Total before taxes</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
