"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import {
  getAuthErrorMessage,
  hasSessionToken,
  responseErrorMessage,
} from "@/lib/auth-response"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SignupForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const fd = new FormData(e.currentTarget)
    const password = String(fd.get("password"))
    const confirm = String(fd.get("confirm"))

    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)

      const response = await authClient.signUp.email({
        name: String(fd.get("name")),
        email: String(fd.get("email")),
        password,
      })

      const message = responseErrorMessage(response, "Unable to create your account.")
      if (message) {
        setError(message)
        return
      }

      if (!hasSessionToken(response)) {
        setError("Account created, but no session was returned. Please sign in.")
        router.replace("/login")
        return
      }

      router.replace("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, "Something went wrong. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4"
    >
      <Input
        name="name"
        placeholder="Name"
        required
      />

      <Input
        name="email"
        type="email"
        required
      />

      <Input
        name="password"
        type="password"
        minLength={8}
        required
      />

      <Input
        name="confirm"
        type="password"
        minLength={8}
        required
      />

      <Button
        disabled={loading}
        className="w-full"
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <p>
        Already have one?{" "}
        <Link href="/login">
          Login
        </Link>
      </p>
    </form>
  )
}
