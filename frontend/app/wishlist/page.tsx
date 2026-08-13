'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ListingGrid } from '../../components/listings/ListingGrid';
import { Listing, Favorite } from '../../types';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { user, favoritesMap } = useAuth();
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const favs: Favorite[] = await api.getFavorites(user.id);
      const listings = favs.map((f) => f.listing).filter((l): l is Listing => l !== undefined);
      setFavoriteListings(listings);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [user.id, favoritesMap]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-7 h-7 text-[#FF385C] fill-[#FF385C]" />
          <h1 className="text-3xl font-black text-neutral-900">Wishlists</h1>
        </div>
        <p className="text-sm text-neutral-500 mb-8">Properties you saved for future travel</p>

        {isLoading ? (
          <ListingGrid listings={[]} isLoading={true} />
        ) : favoriteListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-50 text-[#FF385C] rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-neutral-500 mb-6">
              As you search, tap the heart icon on any listing to save your favorite stays here.
            </p>
            <Link
              href="/"
              className="bg-neutral-900 hover:bg-black text-white font-bold px-6 py-3 rounded-2xl transition text-sm shadow-md"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <ListingGrid listings={favoriteListings} isLoading={false} />
        )}
      </main>

      <Footer />
    </div>
  );
}
