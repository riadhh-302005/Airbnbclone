import {
  Listing,
  ListingCreateInput,
  ListingUpdateInput,
  Booking,
  BookingCreateInput,
  Review,
  ReviewCreateInput,
  Favorite,
  DateRange,
  SearchFilters,
  User,
} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred';
    try {
      const data = await response.json();
      errorDetail = data.detail || errorDetail;
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }
  return response.json() as Promise<T>;
}

export const api = {
  // Listings
  async getListings(filters: SearchFilters = {}): Promise<Listing[]> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString());
    if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString());
    if (filters.property_type) params.append('property_type', filters.property_type);
    if (filters.category) params.append('category', filters.category);
    if (filters.guests) params.append('guests', filters.guests.toString());
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.beds) params.append('beds', filters.beds.toString());
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach((a) => params.append('amenities', a));
    }

    const res = await fetch(`${API_URL}/api/listings?${params.toString()}`, { cache: 'no-store' });
    return handleResponse<Listing[]>(res);
  },

  async getListingById(id: string): Promise<Listing> {
    const res = await fetch(`${API_URL}/api/listings/${id}`, { cache: 'no-store' });
    return handleResponse<Listing>(res);
  },

  async getListingAvailability(id: string): Promise<DateRange[]> {
    const res = await fetch(`${API_URL}/api/listings/${id}/availability`, { cache: 'no-store' });
    return handleResponse<DateRange[]>(res);
  },

  async createListing(input: ListingCreateInput): Promise<Listing> {
    const res = await fetch(`${API_URL}/api/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Listing>(res);
  },

  async updateListing(id: string, input: ListingUpdateInput): Promise<Listing> {
    const res = await fetch(`${API_URL}/api/listings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Listing>(res);
  },

  async deleteListing(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/api/listings/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(res);
  },

  // Bookings
  async createBooking(input: BookingCreateInput): Promise<Booking> {
    const res = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Booking>(res);
  },

  async getBookings(guestId?: string, listingId?: string): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (guestId) params.append('guest_id', guestId);
    if (listingId) params.append('listing_id', listingId);

    const res = await fetch(`${API_URL}/api/bookings?${params.toString()}`, { cache: 'no-store' });
    return handleResponse<Booking[]>(res);
  },

  async getBookingById(id: string): Promise<Booking> {
    const res = await fetch(`${API_URL}/api/bookings/${id}`, { cache: 'no-store' });
    return handleResponse<Booking>(res);
  },

  async cancelBooking(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/api/bookings/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(res);
  },

  // Reviews
  async getReviews(listingId: string): Promise<Review[]> {
    const res = await fetch(`${API_URL}/api/listings/${listingId}/reviews`, { cache: 'no-store' });
    return handleResponse<Review[]>(res);
  },

  async createReview(listingId: string, input: ReviewCreateInput): Promise<Review> {
    const res = await fetch(`${API_URL}/api/listings/${listingId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Review>(res);
  },

  // Favorites
  async getFavorites(userId: string): Promise<Favorite[]> {
    const res = await fetch(`${API_URL}/api/favorites?user_id=${userId}`, { cache: 'no-store' });
    return handleResponse<Favorite[]>(res);
  },

  async addFavorite(listingId: string, userId: string): Promise<Favorite> {
    const res = await fetch(`${API_URL}/api/favorites/${listingId}?user_id=${userId}`, {
      method: 'POST',
    });
    return handleResponse<Favorite>(res);
  },

  async removeFavorite(listingId: string, userId: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/api/favorites/${listingId}?user_id=${userId}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(res);
  },

  // Host
  async getHostListings(hostId: string): Promise<Listing[]> {
    const res = await fetch(`${API_URL}/api/host/listings?host_id=${hostId}`, { cache: 'no-store' });
    return handleResponse<Listing[]>(res);
  },

  async getHostBookings(hostId: string): Promise<Booking[]> {
    const res = await fetch(`${API_URL}/api/host/bookings?host_id=${hostId}`, { cache: 'no-store' });
    return handleResponse<Booking[]>(res);
  },

  async getHostStats(hostId: string): Promise<{
    total_listings: number;
    total_bookings: number;
    total_revenue: number;
    occupancy_rate: number;
  }> {
    const res = await fetch(`${API_URL}/api/host/stats?host_id=${hostId}`, { cache: 'no-store' });
    return handleResponse<{
      total_listings: number;
      total_bookings: number;
      total_revenue: number;
      occupancy_rate: number;
    }>(res);
  },

  // Users
  async getUser(userId: string): Promise<User> {
    const res = await fetch(`${API_URL}/api/users/${userId}`, { cache: 'no-store' });
    return handleResponse<User>(res);
  },
};
