import * as z from "zod";
import { LanguageSchema } from "../../enums/Language.schema";
import { ThemeSchema } from "../../enums/Theme.schema";
// prettier-ignore
export const UserResultSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    phone: z.string().nullable(),
    language: LanguageSchema,
    theme: ThemeSchema,
    tenantId: z.string().nullable(),
    accounts: z.array(z.unknown()),
    sessions: z.array(z.unknown()),
    tenant: z.unknown().nullable(),
    userRoles: z.array(z.unknown()),
  })
  .strict();

export type UserResultType = z.infer<typeof UserResultSchema>;
