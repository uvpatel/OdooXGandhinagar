import { SignupForm } from "@/components/signup-form"
import { requireUnAuth } from "@/lib/auth-guard"

export default async function SignupPage() {
  await requireUnAuth()
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-background p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-primary/10 mb-4">
            <span className="font-bold text-primary">AF</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up creates an employee account. Admin roles are assigned later.
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
