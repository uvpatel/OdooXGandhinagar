"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Calendar as CalendarIcon, Clock } from "lucide-react";
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

export function BookingWorkspace() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [resourceId, setResourceId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const { data } = await res.json();
        setBookings(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = bookings.filter((b) =>
    `${b.resourceName} ${b.bookedBy}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resourceId,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Booking failed: ${err.error || "Unknown error"}`);
      return;
    }

    setShowForm(false);
    setResourceId("");
    setStartsAt("");
    setEndsAt("");
    fetchData();
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
            <form onSubmit={handleBook} className="grid gap-3 md:grid-cols-3">
              <Input placeholder="Resource ID (UUID)" value={resourceId} onChange={(e) => setResourceId(e.target.value)} required />
              <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required />
              <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} required />
              <div className="md:col-span-3 flex gap-2">
                <Button type="submit">Confirm Booking</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
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
