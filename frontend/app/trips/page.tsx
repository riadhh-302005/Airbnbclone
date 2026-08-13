'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { Booking } from '../../types';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Calendar, MapPin, CheckCircle, Ban, ArrowRight } from 'lucide-react';

export default function TripsPage() {
  const { user, showToast } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const data = await api.getBookings(user.id);
      setBookings(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load trips', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [user.id]);

  const handleCancelBooking = async () => {
    if (!selectedBookingToCancel) return;

    setIsCancelling(true);
    try {
      await api.cancelBooking(selectedBookingToCancel.id);
      showToast('Trip cancelled successfully', 'info');
      setSelectedBookingToCancel(null);
      loadTrips();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel trip', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-3xl font-black text-neutral-900 mb-2">My Trips</h1>
        <p className="text-sm text-neutral-500 mb-8">Manage your reservations and upcoming stays</p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-48 bg-neutral-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-50 text-[#FF385C] rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">No trips booked yet</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Time to dust off your bags and start planning your next adventure.
            </p>
            <Link
              href="/"
              className="bg-[#FF385C] hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-2xl transition shadow-md text-sm"
            >
              Start searching
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => {
              const lst = b.listing;
              const imgUrl =
                lst?.images && lst.images.length > 0
                  ? lst.images[0].image_url
                  : 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600';

              return (
                <div
                  key={b.id}
                  className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5"
                >
                  <img
                    src={imgUrl}
                    alt={lst?.title || 'Listing'}
                    className="w-full sm:w-40 h-40 rounded-2xl object-cover border border-neutral-200 shrink-0"
                  />

                  <div className="flex flex-col justify-between flex-1 gap-2">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-neutral-400">{b.id}</span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {b.status === 'confirmed' ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Confirmed</span>
                            </>
                          ) : (
                            <>
                              <Ban className="w-3 h-3" />
                              <span>Cancelled</span>
                            </>
                          )}
                        </span>
                      </div>

                      <h3 className="font-bold text-neutral-900 text-base line-clamp-1">
                        {lst?.title || 'Vacation Stay'}
                      </h3>
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {lst?.location}, {lst?.city}
                      </p>

                      <p className="text-xs text-neutral-600 flex items-center gap-1 mt-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{b.check_in} to {b.check_out} ({b.nights} nights)</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-3 mt-2">
                      <div>
                        <span className="text-xs text-neutral-400">Total Paid</span>
                        <p className="text-sm font-extrabold text-neutral-900">₹{b.total_price.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => setSelectedBookingToCancel(b)}
                            className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition"
                          >
                            Cancel
                          </button>
                        )}
                        <Link
                          href={`/listing/${b.listing_id}`}
                          className="text-xs font-bold text-neutral-900 hover:bg-neutral-100 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      <ConfirmationModal
        isOpen={!!selectedBookingToCancel}
        title="Cancel Trip Reservation?"
        message={`Are you sure you want to cancel your stay at ${selectedBookingToCancel?.listing?.title}?`}
        confirmText="Cancel Reservation"
        isLoading={isCancelling}
        onConfirm={handleCancelBooking}
        onClose={() => setSelectedBookingToCancel(null)}
      />
    </div>
  );
}
