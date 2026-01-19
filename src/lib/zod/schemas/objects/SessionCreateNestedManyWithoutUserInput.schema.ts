import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SessionCreateManyUserInputEnvelopeObjectSchema } from "./SessionCreateManyUserInputEnvelope.schema";
import { SessionCreateOrConnectWithoutUserInputObjectSchema } from "./SessionCreateOrConnectWithoutUserInput.schema";
import { SessionCreateWithoutUserInputObjectSchema } from "./SessionCreateWithoutUserInput.schema";
import { SessionUncheckedCreateWithoutUserInputObjectSchema } from "./SessionUncheckedCreateWithoutUserInput.schema";
import { SessionWhereUniqueInputObjectSchema } from "./SessionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => SessionCreateWithoutUserInputObjectSchema),
          z.lazy(() => SessionCreateWithoutUserInputObjectSchema).array(),
          z.lazy(() => SessionUncheckedCreateWithoutUserInputObjectSchema),
          z
            .lazy(() => SessionUncheckedCreateWithoutUserInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => SessionCreateOrConnectWithoutUserInputObjectSchema),
          z
            .lazy(() => SessionCreateOrConnectWithoutUserInputObjectSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => SessionCreateManyUserInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => SessionWhereUniqueInputObjectSchema),
          z.lazy(() => SessionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const SessionCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput>;
export const SessionCreateNestedManyWithoutUserInputObjectZodSchema =
  makeSchema();
