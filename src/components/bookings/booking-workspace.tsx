"use client";

import { useState } from "react";
import { CalendarDays, Plus, Search, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

type Booking = {
  id: string;
  resourceName: string;
  bookedBy: string;
  startsAt: string;
  endsAt: string;
  status: string;
};

const mockBookings: Booking[] = [
  { id: "1", resourceName: "Conference Room A", bookedBy: "Aarav Shah", startsAt: "2026-07-12T09:00:00Z", endsAt: "2026-07-12T10:00:00Z", status: "upcoming" },
  { id: "2", resourceName: "Projector X1", bookedBy: "Meera Patel", startsAt: "2026-07-12T13:00:00Z", endsAt: "2026-07-12T15:00:00Z", status: "ongoing" },
];

export function BookingWorkspace() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = bookings.filter((b) =>
    `${b.resourceName} ${b.bookedBy}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Backend overlap validation: Two people can't book the same room at overlapping times.");
    setShowForm(false);
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Shared Resources</p>
          <h1 className="text-3xl font-semibold tracking-tight">Resource Booking</h1>
          <p className="mt-1 text-muted-foreground">Time-slot booking of shared resources with no overlaps.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="size-4 mr-2" /> Book Resource</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Book a Resource</CardTitle>
            <CardDescription>Select a resource and time slot.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBook} className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Resource Name (e.g., Room B2)" required />
              <Input type="datetime-local" required />
              <Input type="datetime-local" required />
              <div className="md:col-span-2">
                <Button type="submit">Confirm Booking</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>Upcoming and ongoing reservations</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              placeholder="Search resource or person..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {filtered.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CalendarIcon className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base">{booking.resourceName}</h3>
                    <p className="text-sm text-muted-foreground">Booked by {booking.bookedBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-sm text-right">
                    <div className="flex items-center justify-end gap-1 font-medium">
                      <Clock className="size-4 text-muted-foreground" />
                      {format(new Date(booking.startsAt), "h:mm a")} - {format(new Date(booking.endsAt), "h:mm a")}
                    </div>
                    <div className="text-muted-foreground">
                      {format(new Date(booking.startsAt), "MMM d, yyyy")}
                    </div>
                  </div>
                  <Badge variant={booking.status === "ongoing" ? "default" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No bookings found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
