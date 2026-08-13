'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { ImageGallery } from '../../../components/listings/ImageGallery';
import { BookingCard } from '../../../components/booking/BookingCard';
import { ReviewList } from '../../../components/reviews/ReviewList';
import { Listing, DateRange, Review } from '../../../types';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import {
  Star,
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  Wifi,
  Wind,
  Waves,
  Car,
  Utensils,
  Bath,
  Sun,
  Umbrella,
  Zap,
  Mountain,
  Laptop,
  Flame,
  Tv,
  CheckCircle2,
} from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params.id as string;
  const { favoritesMap, toggleFavorite, showToast } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [availability, setAvailability] = useState<DateRange[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const loadListingData = async () => {
    try {
      const [lst, avail, revs] = await Promise.all([
        api.getListingById(listingId),
        api.getListingAvailability(listingId),
        api.getReviews(listingId),
      ]);
      setListing(lst);
      setAvailability(avail);
      setReviews(revs);
    } catch (err: any) {
      showToast(err.message || 'Failed to load listing details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (listingId) {
      loadListingData();
    }
  }, [listingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded-lg w-1/2" />
          <div className="h-4 bg-neutral-200 rounded-md w-1/3" />
          <div className="h-96 bg-neutral-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center flex-1">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Listing not found</h2>
          <p className="text-neutral-500 text-sm">The listing you are looking for does not exist or was removed.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const isFavorite = !!favoritesMap[listing.id];
  const host = listing.host || {
    name: 'Ria',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'host',
  };

  const getAmenityIcon = (name: string) => {
    const lname = name.toLowerCase();
    if (lname.includes('wifi')) return <Wifi className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('air')) return <Wind className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('pool')) return <Waves className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('park')) return <Car className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('kitchen')) return <Utensils className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('tub')) return <Bath className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('patio')) return <Sun className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('beach')) return <Umbrella className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('ev')) return <Zap className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('mountain')) return <Mountain className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('workspace')) return <Laptop className="w-5 h-5 text-neutral-700" />;
    if (lname.includes('fire') || lname.includes('bbq')) return <Flame className="w-5 h-5 text-neutral-700" />;
    return <Sparkles className="w-5 h-5 text-neutral-700" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Title Header */}
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {listing.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm font-semibold text-neutral-800">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-neutral-900 text-neutral-900" />
              <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
              <span>·</span>
              <span className="underline">{listing.review_count} reviews</span>
              <span>·</span>
              <span className="text-neutral-500 font-normal flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {listing.location}, {listing.city}, {listing.country}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Link copied to clipboard!', 'info');
                }}
                className="flex items-center gap-2 hover:bg-neutral-100 px-3 py-1.5 rounded-full transition underline text-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button
                onClick={() => toggleFavorite(listing.id)}
                className="flex items-center gap-2 hover:bg-neutral-100 px-3 py-1.5 rounded-full transition underline text-xs"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : 'text-neutral-700'
                  }`}
                />
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Photo Gallery Component */}
        <ImageGallery images={listing.images} title={listing.title} />

        {/* 2-Column Content Layout (Details Left, Sticky Booking Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-10">
          {/* Left Main Details Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Property Stats & Host Info */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  {listing.property_type} hosted by {host.name}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {listing.max_guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} baths
                </p>
              </div>
              <img
                src={host.avatar}
                alt={host.name}
                className="w-14 h-14 rounded-full object-cover border border-neutral-200 shadow-sm shrink-0"
              />
            </div>

            {/* Airbnb Highlights Badges */}
            <div className="flex flex-col gap-5 pb-6 border-b border-neutral-200 text-sm">
              <div className="flex items-start gap-4">
                <Award className="w-6 h-6 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">{host.name} is a Superhost</h4>
                  <p className="text-xs text-neutral-500">Superhosts are experienced, highly rated hosts committed to great stays.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">Great Location</h4>
                  <p className="text-xs text-neutral-500">95% of recent guests gave the location a 5-star rating.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900">Free Cancellation</h4>
                  <p className="text-xs text-neutral-500">Cancel up to 48 hours before check-in for a full refund.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-neutral-200">
              <p className={`text-neutral-700 leading-relaxed text-sm ${!showFullDescription ? 'line-clamp-4' : ''}`}>
                {listing.description}
              </p>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-3 font-bold text-neutral-900 underline text-sm hover:text-neutral-600"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Amenities Grid */}
            <div className="pb-6 border-b border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map((amen) => (
                  <div key={amen.id} className="flex items-center gap-3 text-sm text-neutral-800 font-medium">
                    {getAmenityIcon(amen.name)}
                    <span>{amen.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Section */}
            <div className="pb-6 border-b border-neutral-200 bg-neutral-50 p-6 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <img src={host.avatar} alt={host.name} className="w-16 h-16 rounded-full object-cover border border-neutral-200" />
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Hosted by {host.name}</h3>
                  <p className="text-xs text-neutral-500">Joined in 2024 · Superhost</p>
                </div>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Response rate: 100% · Response time: within an hour
              </p>
            </div>

            {/* Map Placeholder */}
            <div className="pb-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Where you'll be</h3>
              <p className="text-xs text-neutral-500 mb-4">{listing.location}, {listing.city}, {listing.country}</p>
              <div className="w-full h-64 bg-neutral-100 rounded-3xl border border-neutral-200 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-[#FF385C] text-white p-3 rounded-full shadow-lg mb-2">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-neutral-900 text-sm">{listing.city}, {listing.country}</h4>
                <p className="text-xs text-neutral-500 mt-1">Exact location provided after booking confirmation.</p>
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewList
              listingId={listing.id}
              reviews={reviews}
              rating={listing.rating}
              reviewCount={listing.review_count}
              onReviewAdded={loadListingData}
            />
          </div>

          {/* Right Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <BookingCard listing={listing} availability={availability} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
