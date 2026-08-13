'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Listing } from '../../../types';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import {
  ChevronLeft,
  CreditCard,
  Lock,
  CheckCircle,
  Calendar,
  Users,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { differenceInDays, parseISO, format } from 'date-fns';

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = params.id as string;
  const { user, showToast } = useAuth();

  const checkIn = searchParams.get('check_in') || '';
  const checkOut = searchParams.get('check_out') || '';
  const guests = Number(searchParams.get('guests') || 1);

  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'paypal'>('card');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  useEffect(() => {
    async function loadListing() {
      try {
        const data = await api.getListingById(listingId);
        setListing(data);
      } catch (err: any) {
        showToast(err.message || 'Failed to load listing', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    if (listingId) loadListing();
  }, [listingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 flex-1 w-full animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded-md w-1/2" />
          <div className="h-64 bg-neutral-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center flex-1">
          <h2 className="text-2xl font-bold">Listing not found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  let nights = 0;
  if (checkIn && checkOut) {
    try {
      nights = differenceInDays(parseISO(checkOut), parseISO(checkIn));
    } catch {
      nights = 1;
    }
  }

  const subtotal = nights * listing.price_per_night;
  const cleaningFee = listing.cleaning_fee || 0;
  const serviceFee = listing.service_fee || 0;
  const totalPrice = subtotal + cleaningFee + serviceFee;

  const handleConfirmAndPay = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.createBooking({
        listing_id: listing.id,
        guest_id: user.id,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests,
      });

      setBookingSuccess(res);
      showToast('Booking confirmed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Booking failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-black text-neutral-900 mb-2">Booking Confirmed!</h1>
          <p className="text-sm text-neutral-500 mb-8 max-w-md">
            Your reservation at <span className="font-bold text-neutral-900">{listing.title}</span> has been confirmed and saved to SQLite.
          </p>

          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 w-full text-left mb-8 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Booking Confirmation ID</span>
              <span className="font-mono font-bold text-neutral-900">{bookingSuccess.id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Dates</span>
              <span className="font-semibold text-neutral-900">{checkIn} to {checkOut} ({nights} nights)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Guests</span>
              <span className="font-semibold text-neutral-900">{guests} guest(s)</span>
            </div>
            <div className="flex justify-between text-sm pt-3 border-t border-neutral-200 font-extrabold text-neutral-900">
              <span>Total Paid</span>
              <span className="text-[#FF385C]">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/trips')}
              className="bg-[#FF385C] hover:bg-rose-600 text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-md text-sm"
            >
              View My Trips
            </button>
            <button
              onClick={() => router.push('/')}
              className="border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold px-6 py-3.5 rounded-2xl transition text-sm"
            >
              Explore More
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 font-bold text-sm mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Request to book</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Checkout Details */}
          <div className="flex flex-col gap-8">
            {/* Trip Details */}
            <div className="pb-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Your trip</h2>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">Dates</h4>
                    <p className="text-xs text-neutral-500">{checkIn} to {checkOut}</p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 underline">Edit</span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">Guests</h4>
                    <p className="text-xs text-neutral-500">{guests} guest(s)</p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 underline">Edit</span>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="pb-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Guest Information</h2>
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-neutral-900">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Mock Payment Selector */}
            <div className="pb-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Pay with</h2>
              <p className="text-xs text-neutral-500 mb-4">Mocked checkout environment (no real card charged)</p>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-bold transition ${
                    paymentMethod === 'card'
                      ? 'border-neutral-900 bg-neutral-50 text-neutral-900'
                      : 'border-neutral-200 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-neutral-900" />
                    <span>Credit or Debit Card</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'card' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-bold transition ${
                    paymentMethod === 'upi'
                      ? 'border-neutral-900 bg-neutral-50 text-neutral-900'
                      : 'border-neutral-200 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-neutral-900" />
                    <span>UPI Instant Payment</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'upi' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'}`} />
                </button>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="text-xs text-neutral-500 space-y-2">
              <p className="font-bold text-neutral-900">Cancellation policy</p>
              <p>Free cancellation for 48 hours. After that, cancel before check-in and get a 50% refund.</p>
            </div>

            {/* Confirm & Pay CTA */}
            <button
              onClick={handleConfirmAndPay}
              disabled={isSubmitting}
              className="w-full bg-[#FF385C] hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition shadow-lg text-base disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Processing Confirmation...' : 'Confirm and Pay'}</span>
            </button>
          </div>

          {/* Right Summary Box */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 h-fit space-y-6">
            {/* Listing Preview */}
            <div className="flex gap-4 pb-6 border-b border-neutral-200">
              <img
                src={listing.images[0]?.image_url || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=300'}
                alt={listing.title}
                className="w-24 h-24 rounded-2xl object-cover border border-neutral-200"
              />
              <div>
                <p className="text-xs font-semibold text-neutral-500">{listing.property_type}</p>
                <h3 className="font-bold text-neutral-900 text-sm leading-snug line-clamp-2">{listing.title}</h3>
                <p className="text-xs text-neutral-600 mt-1">★ {listing.rating.toFixed(2)} ({listing.review_count} reviews)</p>
              </div>
            </div>

            {/* Price Details */}
            <div className="space-y-3 text-xs font-medium text-neutral-700">
              <h4 className="font-bold text-neutral-900 text-sm mb-3">Price details</h4>
              <div className="flex justify-between">
                <span>₹{listing.price_per_night.toLocaleString()} × {nights} nights</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>₹{cleaningFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Airbnb service fee</span>
                <span>₹{serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-200 text-sm font-extrabold text-neutral-900">
                <span>Total (INR)</span>
                <span className="text-[#FF385C]">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
