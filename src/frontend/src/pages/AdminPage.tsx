import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, LogIn, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppointmentStatus } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllAppointments,
  useGetAllServices,
  useGetAllStylists,
  useIsCallerAdmin,
  useUpdateAppointmentStatus,
} from "../hooks/useQueries";

const ADMIN_SKELETON_KEYS_5 = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];
const ADMIN_SKELETON_KEYS_8 = [
  "sk-1",
  "sk-2",
  "sk-3",
  "sk-4",
  "sk-5",
  "sk-6",
  "sk-7",
  "sk-8",
];

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: appointments, isLoading: apptLoading } =
    useGetAllAppointments();
  const { data: services } = useGetAllServices();
  const { data: stylists } = useGetAllStylists();
  const updateStatus = useUpdateAppointmentStatus();

  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const getServiceName = (id: bigint) =>
    services?.find((s) => s.id === id)?.name ?? "—";
  const getStylistName = (id: bigint) =>
    stylists?.find((s) => s.id === id)?.name ?? "—";

  const formatDate = (ns: bigint) => {
    const ms = Number(ns / 1_000_000n);
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = async (
    appointmentId: bigint,
    status: AppointmentStatus,
  ) => {
    setUpdatingId(appointmentId);
    try {
      await updateStatus.mutateAsync({ appointmentId, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColors: Record<AppointmentStatus, string> = {
    [AppointmentStatus.pending]:
      "bg-yellow-900/40 text-yellow-300 border-yellow-700",
    [AppointmentStatus.confirmed]:
      "bg-green-900/40 text-green-300 border-green-700",
    [AppointmentStatus.completed]:
      "bg-blue-900/40 text-blue-300 border-blue-700",
    [AppointmentStatus.cancelled]: "bg-red-900/40 text-red-300 border-red-700",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gold" />
            <span className="font-display text-xl text-foreground">
              Admin Dashboard
            </span>
            <span className="text-muted-foreground">—</span>
            <a
              href="/"
              data-ocid="admin.link"
              className="text-sm text-gold hover:opacity-80 transition-opacity"
            >
              ← Back to Site
            </a>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-mono hidden sm:block">
                {identity?.getPrincipal().toString().slice(0, 20)}...
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="border-border hover:border-gold hover:text-gold"
              >
                <LogOut className="w-3 h-3 mr-1" /> Sign Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="admin.primary_button"
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Sign In
            </Button>
          )}
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-6 py-10">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-display text-3xl text-foreground">
              Admin Access Required
            </h2>
            <p className="text-muted-foreground text-center max-w-sm">
              Please sign in with your Internet Identity to access the admin
              dashboard.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="admin.primary_button"
              className="bg-primary text-primary-foreground px-8 py-3 hover:opacity-90"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              Sign In to Continue
            </Button>
          </div>
        ) : adminLoading ? (
          <div data-ocid="admin.loading_state" className="space-y-4">
            {ADMIN_SKELETON_KEYS_5.map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
          </div>
        ) : !isAdmin ? (
          <div
            data-ocid="admin.error_state"
            className="flex flex-col items-center justify-center py-32 gap-4"
          >
            <p className="text-destructive font-display text-2xl">
              Access Denied
            </p>
            <p className="text-muted-foreground">
              You do not have admin privileges.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="font-display text-3xl text-foreground mb-1">
                Appointments
              </h1>
              <p className="text-muted-foreground">
                {appointments?.length ?? 0} total appointments
              </p>
            </div>

            {apptLoading ? (
              <div data-ocid="admin.loading_state" className="space-y-3">
                {ADMIN_SKELETON_KEYS_8.map((k) => (
                  <Skeleton key={k} className="h-14 w-full" />
                ))}
              </div>
            ) : appointments && appointments.length > 0 ? (
              <div className="rounded border border-border overflow-hidden">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">
                        Customer
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Service
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Stylist
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Date
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Time
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Update
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appt, idx) => (
                      <TableRow
                        key={appt.id.toString()}
                        data-ocid={`admin.row.${idx + 1}`}
                        className="border-border hover:bg-muted/30"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {appt.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appt.customerEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {getServiceName(appt.serviceId)}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {getStylistName(appt.stylistId)}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {formatDate(appt.date)}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {appt.timeSlot}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs border ${statusColors[appt.status]}`}
                          >
                            {appt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={appt.status}
                            onValueChange={(val) =>
                              handleStatusChange(
                                appt.id,
                                val as AppointmentStatus,
                              )
                            }
                            disabled={updatingId === appt.id}
                          >
                            <SelectTrigger
                              data-ocid={`admin.select.${idx + 1}`}
                              className="w-36 h-8 text-xs border-border"
                            >
                              {updatingId === appt.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(AppointmentStatus).map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="text-xs"
                                >
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div
                data-ocid="admin.empty_state"
                className="text-center py-20 text-muted-foreground"
              >
                <p className="font-display text-xl">No appointments yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
