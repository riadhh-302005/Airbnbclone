'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { Listing, Booking } from '../../types';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  IndianRupee,
  CalendarCheck,
  Percent,
  Home,
  Star,
  Users,
} from 'lucide-react';

export default function HostDashboardPage() {
  const { user, activeRole, switchRole, showToast } = useAuth();

  const [hostListings, setHostListings] = useState<Listing[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    total_listings: 0,
    total_bookings: 0,
    total_revenue: 0,
    occupancy_rate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings');

  // Auto switch to host role if not set
  useEffect(() => {
    if (activeRole !== 'host') {
      switchRole('host');
    }
  }, []);

  const loadHostData = async () => {
    setIsLoading(true);
    try {
      const [lsts, bks, st] = await Promise.all([
        api.getHostListings(user.id),
        api.getHostBookings(user.id),
        api.getHostStats(user.id),
      ]);
      setHostListings(lsts);
      setHostBookings(bks);
      setStats(st);
    } catch (err: any) {
      showToast(err.message || 'Failed to load host dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHostData();
  }, [user.id]);

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteListing(listingToDelete.id);
      showToast('Listing deleted successfully', 'success');
      setListingToDelete(null);
      loadHostData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete listing', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Host Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#FF385C]" />
              <h1 className="text-3xl font-black text-neutral-900">Host Dashboard</h1>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Welcome back, <span className="font-bold text-neutral-900">{user.name}</span>! Here is your performance overview.
            </p>
          </div>

          <Link
            href="/host/listings/new"
            className="bg-[#FF385C] hover:bg-rose-600 text-white font-bold px-6 py-3.5 rounded-2xl transition shadow-md flex items-center gap-2 text-sm shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Listing</span>
          </Link>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Listings</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{stats.total_listings}</h3>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-xs">
              <Home className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{stats.total_bookings}</h3>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-xs">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Estimated Revenue</p>
              <h3 className="text-2xl font-black text-[#FF385C] mt-1">₹{stats.total_revenue.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-center text-[#FF385C] shadow-xs">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Occupancy Rate</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{stats.occupancy_rate}%</h3>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-xs">
              <Percent className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Row (My Listings vs Received Bookings) */}
        <div className="flex border-b border-neutral-200 mb-6 gap-8">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-4 text-sm font-bold transition border-b-2 ${
              activeTab === 'listings'
                ? 'text-neutral-900 border-neutral-900'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            My Listings ({hostListings.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 text-sm font-bold transition border-b-2 ${
              activeTab === 'bookings'
                ? 'text-neutral-900 border-neutral-900'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            Received Bookings ({hostBookings.length})
          </button>
        </div>

        {/* Listings Table / Grid */}
        {activeTab === 'listings' && (
          isLoading ? (
            <div className="h-64 bg-neutral-100 rounded-3xl animate-pulse" />
          ) : hostListings.length === 0 ? (
            <div className="py-16 text-center bg-neutral-50 rounded-3xl border border-neutral-200">
              <p className="text-neutral-500 text-sm mb-4">You have not created any property listings yet.</p>
              <Link
                href="/host/listings/new"
                className="bg-neutral-900 text-white font-bold px-6 py-3 rounded-2xl text-xs"
              >
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-800">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Property</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Price / night</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {hostListings.map((lst) => {
                      const img = lst.images && lst.images.length > 0 ? lst.images[0].image_url : 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=200';
                      return (
                        <tr key={lst.id} className="hover:bg-neutral-50/80 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={img} alt={lst.title} className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0" />
                              <div>
                                <p className="font-bold text-neutral-900 line-clamp-1">{lst.title}</p>
                                <p className="text-xs text-neutral-400 font-mono">{lst.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold">{lst.property_type}</td>
                          <td className="px-6 py-4 text-xs font-medium">{lst.city}, {lst.country}</td>
                          <td className="px-6 py-4 font-extrabold text-neutral-900">₹{lst.price_per_night.toLocaleString()}</td>
                          <td className="px-6 py-4 text-xs font-bold">★ {lst.rating.toFixed(2)} ({lst.review_count})</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Link
                              href={`/listing/${lst.id}`}
                              className="p-2 inline-flex text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/host/listings/${lst.id}/edit`}
                              className="p-2 inline-flex text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setListingToDelete(lst)}
                              className="p-2 inline-flex text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* Bookings Table */}
        {activeTab === 'bookings' && (
          isLoading ? (
            <div className="h-64 bg-neutral-100 rounded-3xl animate-pulse" />
          ) : hostBookings.length === 0 ? (
            <div className="py-16 text-center bg-neutral-50 rounded-3xl border border-neutral-200">
              <p className="text-neutral-500 text-sm">No bookings received for your properties yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-800">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Booking ID</th>
                      <th className="px-6 py-4">Property</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Guests</th>
                      <th className="px-6 py-4">Earnings</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {hostBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-50/80 transition">
                        <td className="px-6 py-4 font-mono font-bold text-xs">{b.id}</td>
                        <td className="px-6 py-4 font-bold text-neutral-900 line-clamp-1">{b.listing?.title || b.listing_id}</td>
                        <td className="px-6 py-4 text-xs">{b.check_in} to {b.check_out} ({b.nights}n)</td>
                        <td className="px-6 py-4 text-xs font-semibold">{b.guests} guests</td>
                        <td className="px-6 py-4 font-extrabold text-emerald-700">₹{b.total_price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </main>

      <Footer />

      {/* Confirmation Modal for Listing Deletion */}
      <ConfirmationModal
        isOpen={!!listingToDelete}
        title="Delete Listing?"
        message={`Are you sure you want to permanently delete "${listingToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Listing"
        isLoading={isDeleting}
        onConfirm={handleDeleteListing}
        onClose={() => setListingToDelete(null)}
      />
    </div>
  );
}
