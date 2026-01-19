import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { SessionCreateManyInputObjectSchema } from "./objects/SessionCreateManyInput.schema";

export const SessionCreateManySchema: z.ZodType<Prisma.SessionCreateManyArgs> =
  z
    .object({
      data: z.union([
        SessionCreateManyInputObjectSchema,
        z.array(SessionCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.SessionCreateManyArgs>;

export const SessionCreateManyZodSchema = z
  .object({
    data: z.union([
      SessionCreateManyInputObjectSchema,
      z.array(SessionCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
