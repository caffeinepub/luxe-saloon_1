import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useBookAppointment,
  useGetAllServices,
  useGetAllStylists,
  useGetAvailableTimeSlots,
} from "../hooks/useQueries";

export default function BookingSection() {
  const { data: services } = useGetAllServices();
  const { data: stylists } = useGetAllStylists();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
    stylistId: "",
    date: "",
    timeSlot: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const dateAsBigInt =
    form.date && form.stylistId
      ? BigInt(new Date(form.date).getTime()) * 1_000_000n
      : null;
  const stylistBigInt = form.stylistId ? BigInt(form.stylistId) : null;

  const { data: timeSlots, isLoading: slotsLoading } = useGetAvailableTimeSlots(
    stylistBigInt,
    dateAsBigInt,
  );

  const bookMutation = useBookAppointment();

  const set = (field: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "stylistId" || field === "date" ? { timeSlot: "" } : {}),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.serviceId ||
      !form.stylistId ||
      !form.date ||
      !form.timeSlot
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await bookMutation.mutateAsync({
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        serviceId: BigInt(form.serviceId),
        stylistId: BigInt(form.stylistId),
        date: BigInt(new Date(form.date).getTime()) * 1_000_000n,
        timeSlot: form.timeSlot,
        notes: form.notes || null,
      });
      setSubmitted(true);
      toast.success("Appointment booked successfully!");
    } catch {
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  return (
    <section id="book" className="py-24 px-6 bg-card/20">
      <div className="container max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">
            Reserve Your Session
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Book an Appointment
          </h2>
          <div className="section-divider max-w-24 mx-auto" />
        </motion.div>

        {submitted ? (
          <motion.div
            data-ocid="booking.success_state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-6" />
            <h3 className="font-display text-3xl text-foreground mb-3">
              Appointment Confirmed!
            </h3>
            <p className="text-muted-foreground mb-8">
              We'll send a confirmation to{" "}
              <span className="text-gold">{form.email}</span>. Our team will be
              in touch to confirm the details.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  serviceId: "",
                  stylistId: "",
                  date: "",
                  timeSlot: "",
                  notes: "",
                });
              }}
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              Book Another
            </Button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 md:p-10 space-y-6"
          >
            {/* Personal Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  data-ocid="booking.input"
                  placeholder="Your full name"
                  className="bg-background/50 border-border focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className="bg-background/50 border-border focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Phone *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="bg-background/50 border-border focus:border-gold"
                />
              </div>
            </div>

            {/* Service & Stylist */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Service *
                </Label>
                <Select
                  value={form.serviceId}
                  onValueChange={(v) => set("serviceId", v)}
                >
                  <SelectTrigger
                    data-ocid="booking.select"
                    className="bg-background/50 border-border"
                  >
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      services ?? [
                        { id: 1n, name: "Signature Haircut" },
                        { id: 2n, name: "Color & Highlights" },
                        { id: 3n, name: "Keratin Treatment" },
                      ]
                    ).map((s) => (
                      <SelectItem key={s.id.toString()} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Preferred Stylist *
                </Label>
                <Select
                  value={form.stylistId}
                  onValueChange={(v) => set("stylistId", v)}
                >
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue placeholder="Choose a stylist" />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      stylists ?? [
                        { id: 1n, name: "Isabella Laurent" },
                        { id: 2n, name: "Marcus Chen" },
                        { id: 3n, name: "Sophia Reyes" },
                      ]
                    ).map((s) => (
                      <SelectItem key={s.id.toString()} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Date *
                </Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="bg-background/50 border-border pl-10 [color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Time Slot *
                </Label>
                <Select
                  value={form.timeSlot}
                  onValueChange={(v) => set("timeSlot", v)}
                  disabled={!form.stylistId || !form.date || slotsLoading}
                >
                  <SelectTrigger className="bg-background/50 border-border">
                    {slotsLoading ? (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" /> Loading
                        slots...
                      </span>
                    ) : (
                      <SelectValue
                        placeholder={
                          !form.stylistId || !form.date
                            ? "Select stylist & date first"
                            : "Choose a time"
                        }
                      />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {(timeSlots && timeSlots.length > 0
                      ? timeSlots
                      : [
                          "10:00 AM",
                          "11:00 AM",
                          "12:00 PM",
                          "2:00 PM",
                          "3:00 PM",
                          "4:00 PM",
                        ]
                    ).map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Special Requests
              </Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                data-ocid="booking.textarea"
                placeholder="Any preferences, allergies, or special requests..."
                className="bg-background/50 border-border focus:border-gold resize-none"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              data-ocid="booking.submit_button"
              disabled={bookMutation.isPending}
              className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 uppercase tracking-widest text-sm"
            >
              {bookMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                "Confirm Appointment"
              )}
            </Button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
