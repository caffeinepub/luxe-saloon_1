import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppointmentStatus } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllServices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllStylists() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stylists"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStylists();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllGalleryItems() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGalleryItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAvailableTimeSlots(
  stylistId: bigint | null,
  date: bigint | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["timeSlots", stylistId?.toString(), date?.toString()],
    queryFn: async () => {
      if (!actor || !stylistId || !date) return [];
      return actor.getAvailableTimeSlots(stylistId, date);
    },
    enabled: !!actor && !isFetching && !!stylistId && !!date,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      serviceId: bigint;
      stylistId: bigint;
      date: bigint;
      timeSlot: string;
      notes: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.bookAppointment(
        params.customerName,
        params.customerEmail,
        params.customerPhone,
        params.serviceId,
        params.stylistId,
        params.date,
        params.timeSlot,
        params.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      appointmentId: bigint;
      status: AppointmentStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateAppointmentStatus(params.appointmentId, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
