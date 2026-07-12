"use client";

import * as React from "react";
import { Bell, BookOpenCheck, Building2, CalendarDays, ClipboardCheck, Command, LayoutDashboard, Package, Settings, Wrench } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: <LayoutDashboard /> },
  { title: "Organization", url: "/organization", icon: <Building2 /> },
  { title: "Assets", url: "/assets", icon: <Package /> },
  { title: "Allocations", url: "/allocations", icon: <BookOpenCheck /> },
  { title: "Bookings", url: "/bookings", icon: <CalendarDays /> },
  { title: "Maintenance", url: "/maintenance", icon: <Wrench /> },
  { title: "Audits", url: "/audits", icon: <ClipboardCheck /> },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/dashboard"><Command className="size-5!" /><span className="text-base font-semibold">AssetFlow</span></a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation} />
        <NavSecondary className="mt-auto" items={[{ title: "Notifications", url: "/notifications", icon: <Bell /> }, { title: "Settings", url: "/organization", icon: <Settings /> }]} />
      </SidebarContent>
      <SidebarFooter><NavUser user={{ name: currentUser?.name || "Signed-in user", email: currentUser?.email || "Manage account", avatar: currentUser?.image || "" }} /></SidebarFooter>
    </Sidebar>
  );
}
