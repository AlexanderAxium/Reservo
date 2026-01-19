import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleCreateManyUserInputObjectSchema } from "./UserRoleCreateManyUserInput.schema";

const makeSchema = () =>
  z
    .object({
      data: z.union([
        z.lazy(() => UserRoleCreateManyUserInputObjectSchema),
        z.lazy(() => UserRoleCreateManyUserInputObjectSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();
export const UserRoleCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.UserRoleCreateManyUserInputEnvelope> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleCreateManyUserInputEnvelope>;
export const UserRoleCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
