import { requireUnAuth } from "@/lib/auth-guard"
import { LoginForm } from "@/components/login-form"
import { Command } from "lucide-react"

export default async function LoginPage() {
  await requireUnAuth()
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Command className="size-4" />
            </div>
            AssetFlow
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <h1 className="mb-2 text-2xl font-semibold">Welcome back</h1>
            <p className="mb-6 text-sm text-muted-foreground">Sign in to manage your organization’s assets and resources.</p>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
