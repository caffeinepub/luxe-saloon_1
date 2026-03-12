import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Service {
    id: bigint;
    duration: bigint;
    name: string;
    description: string;
    category: string;
    price: bigint;
}
export interface Stylist {
    id: bigint;
    bio: string;
    name: string;
    specialties: Array<string>;
}
export interface GalleryItem {
    id: bigint;
    title: string;
    description: string;
    imageUrl: string;
}
export interface Appointment {
    id: bigint;
    customerName: string;
    status: AppointmentStatus;
    customerPhone: string;
    date: bigint;
    stylistId: bigint;
    notes?: string;
    serviceId: bigint;
    customerEmail: string;
    timeSlot: string;
}
export interface UserProfile {
    name: string;
}
export enum AppointmentStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookAppointment(customerName: string, customerEmail: string, customerPhone: string, serviceId: bigint, stylistId: bigint, date: bigint, timeSlot: string, notes: string | null): Promise<Appointment>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getAllServices(): Promise<Array<Service>>;
    getAllStylists(): Promise<Array<Stylist>>;
    getAppointmentById(appointmentId: bigint): Promise<Appointment>;
    getAppointmentsByDateRange(startDate: bigint, endDate: bigint): Promise<Array<Appointment>>;
    getAvailableTimeSlots(stylistId: bigint, date: bigint): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGalleryItemById(itemId: bigint): Promise<GalleryItem>;
    getServiceById(serviceId: bigint): Promise<Service>;
    getStylistById(stylistId: bigint): Promise<Stylist>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAppointmentStatus(appointmentId: bigint, newStatus: AppointmentStatus): Promise<Appointment>;
}
