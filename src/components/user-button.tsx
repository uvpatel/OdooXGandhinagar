"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"

import { authClient } from "@/lib/auth-client"

import {
  LogOut,
  Settings,
  User,
} from "lucide-react"

import Link from "next/link"
import { useRouter } from "next/navigation"

export function UserButton() {
  const router = useRouter()

  const {
    data: session,
    isPending,
  } = authClient.useSession()

  async function logout() {
    await authClient.signOut()

    router.refresh()
    router.push("/login")
  }

  if (isPending) {
    return (
      <div className="size-9 rounded-full bg-muted animate-pulse" />
    )
  }

  if (!session?.user) {
    return (
      <Link href="/login">
        <Button>
          Login
        </Button>
      </Link>
    )
  }

  const user =
    session.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Avatar className="size-10 cursor-pointer">
            <AvatarImage
              src={user.image ?? ""}
            />

            <AvatarFallback>
              {user.name?.[0]}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60"
      >
        <div className="p-3">
          <p className="font-medium">
            {user.name}
          </p>

          <p className="text-sm text-muted-foreground">
            {user.email}
          </p>
        </div>

        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={logout}
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}