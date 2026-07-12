import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/index"
import * as schema from "@/db/schema"
import { eq } from "drizzle-orm"
import { sendWelcomeEmail, sendOTPEmail } from "./email"
import { emailOTP } from "better-auth/plugins"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendOTPEmail(email, otp, type);
      }
    })
  ],

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  user: {
    additionalFields: {
      lastLoginAt: {
        type: "date",
        required: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (newUser) => {
          await db.insert(schema.employees).values({
            userId: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: "employee",
          }).onConflictDoNothing({ target: schema.employees.userId });
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          try {
            const [foundUser] = await db
              .select()
              .from(schema.user)
              .where(eq(schema.user.id, session.userId))
              .limit(1);

            if (foundUser?.email) {
              await sendWelcomeEmail(foundUser.email, foundUser.name || "");
            }
          } catch (e) {
            console.error("Failed to send login email:", e);
          }
        },
      },
    },
  },

  socialProviders: {
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),

    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
})
