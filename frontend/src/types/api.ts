export type Role = "admin" | "host" | "tenant";
export type PropertyType = "apartment" | "villa" | "land" | "chalet" | "commercial" | "parking";
export type DamageStatus = "intact" | "partial" | "renovated";
export type PropertyStatus = "pending" | "accepted" | "rejected" | "archived";
export type Availability = "available" | "not_available" | "booked";
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled" | "completed";
export type ContractStatus = "active" | "expired" | "cancelled" | "archived";

export interface User {
  id: number;
  first_name: string;
  second_name?: string | null;
  third_name?: string | null;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  national_id?: string | null;
}

export interface AuthResponse {
  token: string;
  role: Role;
  user: User;
  is_profile_complete: boolean;
}

export interface LocationEntity {
  id: number;
  name: string;
}

export interface PropertyImage {
  id: number;
  property_id?: number;
  url: string;
  is_main?: boolean;
}

export interface Property {
  id: number;
  host_id?: number;
  title: string;
  description?: string | null;
  type: PropertyType;
  price: number | string;
  area_m2?: number | string | null;
  rooms?: number | null;
  damage_status: DamageStatus;
  has_water?: boolean | number;
  has_electricity?: boolean | number;
  is_ready?: boolean | number;
  status?: PropertyStatus;
  availability?: Availability;
  rejection_reason?: string | null;
  street?: string | null;
  location?: string | null;
  governorate_id?: number | null;
  city_id?: number | null;
  neighborhood_id?: number | null;
  governorate?: LocationEntity | null;
  city?: LocationEntity | null;
  neighborhood?: LocationEntity | null;
  images?: PropertyImage[];
  main_image?: PropertyImage | null;
  mainImage?: PropertyImage | null;
  host?: User | null;
  created_at?: string;
}

export interface Booking {
  id: number;
  property_id: number;
  tenant_id?: number;
  host_id?: number;
  start_date: string;
  end_date: string;
  price?: number | string;
  status: BookingStatus;
  property?: Property | null;
  tenant?: User | null;
  created_at?: string;
}

export interface Contract {
  id: number;
  property_id?: number;
  booking_id?: number;
  tenant_id?: number;
  host_id?: number;
  status?: ContractStatus;
  start_date?: string;
  end_date?: string;
  property?: Property | null;
  booking?: Booking | null;
}

export interface NotificationItem {
  id: number;
  title: string;
  body?: string;
  message?: string;
  type?: string;
  is_read?: boolean;
  read_at?: string | null;
  created_at?: string;
}

export interface Review {
  id: number;
  rating?: number;
  comment?: string | null;
  user?: User | null;
  created_at?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: Extract<Role, "tenant" | "host">;
}

export interface CompleteProfilePayload {
  second_name: string;
  third_name: string;
  last_name: string;
  national_id: string;
  phone: string;
}

export interface PropertyFilters {
  type?: string;
  governorate_id?: string;
  city_id?: string;
  neighborhood_id?: string;
  min_price?: string;
  max_price?: string;
  rooms?: string;
  damage_status?: string;
  has_water?: string;
  has_electricity?: string;
  is_ready?: string;
}

export interface PropertyFormPayload {
  title: string;
  description?: string;
  type: PropertyType;
  governorate_id: string;
  city_id: string;
  neighborhood_id?: string;
  street?: string;
  price: string;
  area_m2?: string;
  rooms?: string;
  damage_status: DamageStatus;
  has_water: boolean;
  has_electricity: boolean;
  is_ready: boolean;
}

export interface BookingPayload {
  property_id: number;
  start_date: string;
  end_date: string;
}

export interface RejectPropertyPayload {
  reason: string;
}
