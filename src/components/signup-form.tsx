
"use client"

import {
  useState,
} from "react"

import Link from "next/link"

import {
  useRouter,
} from "next/navigation"

import {
  authClient,
} from "@/lib/auth-client"

import {
  Button,
} from "@/components/ui/button"

import {
  Input,
} from "@/components/ui/input"

export function SignupForm() {
  const router =
    useRouter()

  const [loading,
    setLoading] =
    useState(false)

  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    const fd =
      new FormData(
        e.currentTarget as HTMLFormElement
      )

    const password =
      String(
        fd.get(
          "password"
        )
      )

    const confirm =
      String(
        fd.get(
          "confirm"
        )
      )

    if (
      password !==
      confirm
    ) {
      return alert(
        "Passwords mismatch"
      )
    }

    try {
      setLoading(
        true
      )

      await authClient.signUp.email(
        {
          name:
            String(
              fd.get(
                "name"
              )
            ),

          email:
            String(
              fd.get(
                "email"
              )
            ),

          password,
        }
      )

      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(
        false
      )
    }
  }

  return (
    <form
      onSubmit={
        submit
      }
      className="space-y-4"
    >
      <Input
        name="name"
        placeholder="Name"
      />

      <Input
        name="email"
        type="email"
      />

      <Input
        name="password"
        type="password"
      />

      <Input
        name="confirm"
        type="password"
      />

      <Button
        disabled={
          loading
        }
        className="w-full"
      >
        Create Account
      </Button>

      <p>
        Already
        have one?{" "}
        <Link href="/login">
          Login
        </Link>
      </p>
    </form>
  )
}
