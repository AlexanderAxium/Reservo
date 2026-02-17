import { randomUUID } from "node:crypto";
import { SESSION_MAX_AGE, SESSION_UPDATE_AGE } from "@/constants/time";
import { prisma } from "@/lib/db";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/lib/mailer";
import type { GoogleProfile } from "@/types/auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";

const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "BETTER_AUTH_SECRET",
];

// Only check required environment variables at runtime, not during build
// Skip validation during build phase (when collecting static props/pages)
// or when explicitly disabled
const isBuildTime =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NODE_ENV === undefined ||
  (typeof window === "undefined" && !process.env.DATABASE_URL);

const skipValidation =
  process.env.SKIP_ENV_VALIDATION === "true" || isBuildTime;

if (!skipValidation) {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });
}

/**
 * Genera un username solo a partir del nombre (y dígitos del id para unicidad).
 * El modelo User de Prisma exige username; Better Auth no lo envía por defecto.
 * Solo se usan caracteres que provienen del nombre + hasta 4 dígitos del id.
 */
function generateUsernameFromName(name: string, userId: string): string {
  const base =
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 28) || "user";
  const digits = userId.replace(/\D/g, "").slice(0, 4);
  return digits ? `${base}_${digits}` : base;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  user: {
    additionalFields: {
      username: {
        type: "string",
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email" && ctx.body?.email && ctx.body?.name) {
        const name = String(ctx.body.name);
        const id = randomUUID();
        const username = generateUsernameFromName(name, id);
        return {
          context: {
            ...ctx,
            body: { ...ctx.body, username },
          },
        };
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const name =
            "name" in user && typeof user.name === "string" ? user.name : "";
          const id =
            "id" in user && typeof user.id === "string"
              ? user.id
              : randomUUID();
          const username =
            "username" in user && typeof user.username === "string"
              ? user.username
              : generateUsernameFromName(name || "user", id);
          return { data: { ...user, username } };
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendResetPasswordEmail(user.email, url);
      } catch (_error) {
        throw new Error("Failed to send password reset email");
      }
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendVerificationEmail(user.email, url);
      } catch (_error) {
        throw new Error("Failed to send verification email");
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "dummy-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "dummy-client-secret",
      mapProfileToUser: (profile: GoogleProfile) => {
        const name =
          profile.name ||
          `${profile.given_name || ""} ${profile.family_name || ""}`.trim() ||
          profile.email?.split("@")[0] ||
          "user";
        const sub = profile.sub ?? randomUUID();
        return {
          name,
          email: profile.email ?? "",
          emailVerified: profile.email_verified,
          image: profile.picture,
          username: generateUsernameFromName(name, sub),
        };
      },
    },
  },

  session: {
    strategy: "jwt",
    expiresIn: SESSION_MAX_AGE,
    updateAge: SESSION_UPDATE_AGE,
  },

  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: { id: string };
      account: { providerId?: string };
    }) {
      if (account?.providerId === "google") {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true },
          });
        } catch (_error) {
          // Continue even if update fails
        }
      }
      return true;
    },
  },

  security: {
    corsOrigin:
      process.env.NODE_ENV === "production"
        ? [
            process.env.SITE_URL ?? "https://canchalibre.com",
            "https://canchalibre.com",
            "https://www.canchalibre.com",
          ]
        : ["http://localhost:3000"],
  },

  logger: {
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
  },
});
