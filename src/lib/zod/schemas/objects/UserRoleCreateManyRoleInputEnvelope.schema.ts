import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleCreateManyRoleInputObjectSchema } from "./UserRoleCreateManyRoleInput.schema";

const makeSchema = () =>
  z
    .object({
      data: z.union([
        z.lazy(() => UserRoleCreateManyRoleInputObjectSchema),
        z.lazy(() => UserRoleCreateManyRoleInputObjectSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();
export const UserRoleCreateManyRoleInputEnvelopeObjectSchema: z.ZodType<Prisma.UserRoleCreateManyRoleInputEnvelope> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleCreateManyRoleInputEnvelope>;
export const UserRoleCreateManyRoleInputEnvelopeObjectZodSchema = makeSchema();
