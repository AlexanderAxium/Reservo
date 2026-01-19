import * as z from "zod";
import { LanguageSchema } from "../../enums/Language.schema";
import { ThemeSchema } from "../../enums/Theme.schema";
// prettier-ignore
export const UserInputSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    phone: z.string().optional().nullable(),
    language: LanguageSchema,
    theme: ThemeSchema,
    tenantId: z.string().optional().nullable(),
    accounts: z.array(z.unknown()),
    sessions: z.array(z.unknown()),
    tenant: z.unknown().optional().nullable(),
    userRoles: z.array(z.unknown()),
  })
  .strict();

export type UserInputType = z.infer<typeof UserInputSchema>;
