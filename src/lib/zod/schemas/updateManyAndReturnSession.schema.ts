import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { SessionSelectObjectSchema } from "./objects/SessionSelect.schema";
import { SessionUpdateManyMutationInputObjectSchema } from "./objects/SessionUpdateManyMutationInput.schema";
import { SessionWhereInputObjectSchema } from "./objects/SessionWhereInput.schema";

export const SessionUpdateManyAndReturnSchema: z.ZodType<Prisma.SessionUpdateManyAndReturnArgs> =
  z
    .object({
      select: SessionSelectObjectSchema.optional(),
      data: SessionUpdateManyMutationInputObjectSchema,
      where: SessionWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.SessionUpdateManyAndReturnArgs>;

export const SessionUpdateManyAndReturnZodSchema = z
  .object({
    select: SessionSelectObjectSchema.optional(),
    data: SessionUpdateManyMutationInputObjectSchema,
    where: SessionWhereInputObjectSchema.optional(),
  })
  .strict();
