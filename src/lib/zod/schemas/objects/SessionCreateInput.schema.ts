import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateNestedOneWithoutSessionsInputObjectSchema } from "./UserCreateNestedOneWithoutSessionsInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      token: z.string(),
      expiresAt: z.coerce.date(),
      ipAddress: z.string().optional().nullable(),
      userAgent: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputObjectSchema),
    })
    .strict();
export const SessionCreateInputObjectSchema: z.ZodType<Prisma.SessionCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.SessionCreateInput>;
export const SessionCreateInputObjectZodSchema = makeSchema();
