"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationsWorkspace() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const { data } = await res.json();
        setNotifications(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PUT" });
    fetchNotifications();
  };

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Stay updated</p>
          <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="mt-1 text-muted-foreground">Alerts for asset assignments, maintenance, and returns.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Your unread and past alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {loading ? <p className="text-muted-foreground">Loading...</p> : null}
            {!loading && notifications.length === 0 ? <p className="text-muted-foreground">No notifications.</p> : null}
            {notifications.map((note) => (
              <div key={note.id} className={`flex items-start justify-between rounded-lg border p-4 shadow-sm ${!note.isRead ? 'bg-primary/5 border-primary/20' : 'bg-background'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Bell className={`size-5 ${!note.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-base flex items-center gap-2">
                      {note.message}
                      {!note.isRead && <Badge className="text-[10px] h-4 px-1 bg-primary">New</Badge>}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="size-3" /> {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!note.isRead && (
                  <Button variant="ghost" size="sm" onClick={() => markAsRead(note.id)}>
                    <Check className="size-4 mr-2" /> Mark Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
