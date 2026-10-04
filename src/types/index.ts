export type Language = 'en' | 'ar';
export type Theme = 'dark' | 'light';

export type PlateDisplayMode = 'masked' | 'full' | 'hidden';
export type LocationPrecision = 'exact' | 'approximate' | 'off';

export interface User {
  id: string;
  name: string;
  nameAr?: string;
  username: string;
  avatar: string;
  bio: string;
  bioAr?: string;
  phone: string;
  email: string;
  region: string;
  role: 'member' | 'club_admin' | 'moderator' | 'admin';
  primaryPlate: string;
  primaryVehicleId: string;
  isPrivate: boolean;
  allowPlateDiscovery: boolean;
  plateDisplayMode: PlateDisplayMode;
  locationPrecision: LocationPrecision;
  aiPersonalization: boolean;
  autoBlurFacesAndPlates: boolean;
  age: number;
  isVerified: boolean;
}

export interface Modification {
  id: string;
  category: 'Exhaust' | 'Wheels' | 'Suspension' | 'Aero' | 'Engine' | 'Interior' | 'Brakes';
  categoryAr?: string;
  partName: string;
  brand: string;
  installedDate: string;
  cost?: number;
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  serviceType: string;
  serviceTypeAr?: string;
  odometer: number; // in km
  workshop: string;
  cost: number;
  invoiceNumber?: string;
  notes?: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  ownerName: string;
  plateNumber: string; // Unmasked e.g. "A 19242"
  region: string; // e.g. "Dubai, UAE"
  regionCode: string; // e.g. "DXB"
  make: string;
  model: string;
  year: number;
  trim: string;
  color: string;
  colorHex: string;
  engine: string;
  horsepower: number;
  odometerKm: number;
  lastServiceDate: string;
  lastServiceMileage: number;
  isPrimary: boolean;
  isVerified: boolean;
  isPrivateVehicle: boolean;
  allowDiscovery: boolean;
  vinMasked: string;
  image: string;
  modifications: Modification[];
  maintenanceLogs: MaintenanceLog[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorPlateMasked: string;
  isVerified: boolean;
  taggedVehicle?: {
    make: string;
    model: string;
    year: number;
    plateMasked: string;
  };
  content: string;
  contentAr?: string;
  image?: string;
  location?: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: Comment[];
  sharesCount: number;
  isSaved?: boolean;
  isAiRecommended?: boolean;
  aiRecommendationReason?: string;
  aiRecommendationReasonAr?: string;
  hashtags: string[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  mediaUrl: string;
  caption: string;
  carTag: string;
  createdAt: string;
  expiresInHours: number;
  isViewed?: boolean;
}

export interface Community {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  category: 'brand' | 'model' | 'region' | 'track';
  categoryAr?: string;
  description: string;
  descriptionAr?: string;
  coverImage: string;
  avatar: string;
  membersCount: number;
  isJoined?: boolean;
  isPrivate: boolean;
  isVerifiedClub: boolean;
  rules: string[];
  rulesAr?: string[];
  location: string;
  pinnedPost?: string;
  pinnedPostAr?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  nameAr: string;
  scenicScore: number; // e.g. 96/100
  distanceKm: number;
  estimatedMinutes: number;
  highlights: string[];
  highlightsAr: string[];
  type: 'canyon' | 'coastal' | 'expressway';
  recommendedPace: string;
  recommendedPaceAr: string;
}

export interface Event {
  id: string;
  title: string;
  titleAr?: string;
  type: 'meet' | 'group_drive' | 'track_day' | 'cars_and_coffee';
  typeAr?: string;
  organizerName: string;
  organizerAvatar: string;
  communityId?: string;
  date: string;
  time: string;
  location: string;
  locationAr?: string;
  description: string;
  descriptionAr?: string;
  image: string;
  capacity: number;
  attendeesCount: number;
  waitlistCount: number;
  userRsvp?: 'going' | 'maybe' | 'not_going' | 'waitlisted' | null;
  routes: RouteOption[];
  chatMessages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isOwn?: boolean;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  locationShare?: { name: string; coordinates: string };
  mediaUrl?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantPlateMasked: string;
  isVerified: boolean;
  isRequest: boolean; // Message request inbox
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface ModerationItem {
  id: string;
  type: 'post' | 'comment' | 'plate_dispute' | 'story' | 'user';
  targetTitle: string;
  reportedBy: string;
  authorName: string;
  authorPlateMasked: string;
  reportedReason: string;
  reportedReasonAr: string;
  severity: 'high' | 'medium' | 'low';
  aiConfidence: number; // 0-100%
  aiFlagRule: string;
  aiExplanation: string;
  aiExplanationAr: string;
  status: 'pending' | 'dismissed' | 'warned' | 'removed' | 'suspended' | 'banned';
  createdAt: string;
  mediaUrl?: string;
  textContent?: string;
}
