import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { SessionCreateManyInputObjectSchema } from "./objects/SessionCreateManyInput.schema";
import { SessionSelectObjectSchema } from "./objects/SessionSelect.schema";

export const SessionCreateManyAndReturnSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> =
  z
    .object({
      select: SessionSelectObjectSchema.optional(),
      data: z.union([
        SessionCreateManyInputObjectSchema,
        z.array(SessionCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.SessionCreateManyAndReturnArgs>;

export const SessionCreateManyAndReturnZodSchema = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    data: z.union([
      SessionCreateManyInputObjectSchema,
      z.array(SessionCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
