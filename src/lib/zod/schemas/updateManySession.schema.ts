import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { SessionUpdateManyMutationInputObjectSchema } from "./objects/SessionUpdateManyMutationInput.schema";
import { SessionWhereInputObjectSchema } from "./objects/SessionWhereInput.schema";

export const SessionUpdateManySchema: z.ZodType<Prisma.SessionUpdateManyArgs> =
  z
    .object({
      data: SessionUpdateManyMutationInputObjectSchema,
      where: SessionWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.SessionUpdateManyArgs>;

export const SessionUpdateManyZodSchema = z
  .object({
    data: SessionUpdateManyMutationInputObjectSchema,
    where: SessionWhereInputObjectSchema.optional(),
  })
  .strict();
