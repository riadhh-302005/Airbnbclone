export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'guest' | 'host' | 'admin';
  created_at?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export interface ListingImage {
  id: string;
  image_url: string;
  position: number;
}

export interface Listing {
  id: string;
  host_id: string;
  title: string;
  description: string;
  property_type: string;
  location: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  review_count: number;
  created_at: string;
  images: ListingImage[];
  amenities: Amenity[];
  host?: User;
}

export interface ListingCreateInput {
  host_id: string;
  title: string;
  description: string;
  property_type: string;
  location: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
}

export interface ListingUpdateInput {
  title?: string;
  description?: string;
  property_type?: string;
  location?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  price_per_night?: number;
  cleaning_fee?: number;
  service_fee?: number;
  max_guests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  images?: string[];
  amenities?: string[];
}

export interface Booking {
  id: string;
  listing_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  subtotal: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  status: 'confirmed' | 'cancelled';
  created_at: string;
  listing?: Listing;
  guest?: User;
}

export interface BookingCreateInput {
  listing_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  guests: number;
}

export interface Review {
  id: string;
  listing_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: User;
}

export interface ReviewCreateInput {
  user_id: string;
  rating: number;
  comment: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: Listing;
}

export interface DateRange {
  check_in: string;
  check_out: string;
}

export interface SearchFilters {
  search?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  category?: string;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  amenities?: string[];
  sort_by?: string;
  page?: number;
  limit?: number;
}
