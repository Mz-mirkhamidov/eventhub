export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type OrderType = "VENUE_BOOKING" | "ARTIST_BOOKING" | "BLOGGER_ORDER";
export type BarterStatus = "OPEN" | "REQUESTED" | "CONFIRMED" | "CLOSED";
export type SocialPlatform = "INSTAGRAM" | "TELEGRAM" | "YOUTUBE" | "TIKTOK";
export type ContentFormat = "STORY" | "POST" | "REEL" | "VIDEO" | "REVIEW";

export interface BloggerPlatform {
  platform: SocialPlatform;
  username: string;
  followerCount: number;
  engagementRate?: number | null;
  profileUrl: string;
}

export interface BloggerContentFormat {
  format: ContentFormat;
  price: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Booking {
  id: string;
  clientId: string;
  orderType?: OrderType;
  artistId: string | null;
  venueId: string | null;
  bloggerId?: string | null;
  eventDate: string | null;
  startTime: string | null;
  endTime: string | null;
  publicationDate?: string | null;
  contentFormat?: string | null;
  briefDescription?: string | null;
  referenceLink?: string | null;
  totalPrice: number;
  advancePayment: number | null;
  remainingPayment?: number | null;
  eventCity?: string | null;
  guestsCount?: number | null;
  cancellationReason?: string | null;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
}

export interface SavedEventPlan {
  id: string;
  eventType: string;
  city: string;
  eventDate: string;
  guestsCount: number;
  budget: number;
  selectedServices: string;
  createdAt: string;
}

export interface ArtistProfile {
  id: string;
  userId: string;
  fullName: string;
  categoryId: number;
  categoryName: string;
  bio: string | null;
  profilePhoto?: string | null;
  portfolioPhotos?: string[];
  pricePerHour: number | null;
  pricePerEvent: number | null;
  advancePaymentPercent?: number | null;
  rating: number | null;
  verified?: boolean;
  isVerified?: boolean;
}

export interface VenueProfile {
  id: string;
  userId: string;
  categoryId?: number | null;
  categoryName?: string | null;
  name: string;
  coverPhoto?: string | null;
  photos?: string[];
  description: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number;
  pricePerHour: number;
  advancePaymentPercent?: number | null;
  rating: number | null;
  verified?: boolean;
  isVerified?: boolean;
}

export interface BarterOffer {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  description: string;
  productValue: number;
  platform: SocialPlatform;
  minFollowers: number | null;
  status: BarterStatus;
  expiresAt: string | null;
  createdAt: string | null;
}

export interface BarterRequestItem {
  id: string;
  offerId: string;
  offerTitle: string;
  requesterId: string;
  requesterName: string;
  followerCount: number | null;
  profileUrl: string;
  message: string | null;
  status: BarterStatus;
  createdAt: string;
}

export interface BloggerProfile {
  id: string;
  userId: string;
  fullName: string;
  bio: string | null;
  profilePhoto: string | null;
  platforms: BloggerPlatform[];
  contentFormats: BloggerContentFormat[];
  categories: string[];
  advancePaymentPercent?: number | null;
  rating: number | null;
  verified?: boolean;
  isVerified?: boolean;
}

export interface BusinessProfile {
  userId: string;
  fullName: string;
  logo: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Category {
  id: number;
  name: string;
  type: string;
  active?: boolean;
  isActive?: boolean;
}

export interface UserListItem {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  active?: boolean;
  isActive?: boolean;
  createdAt: string;
}
