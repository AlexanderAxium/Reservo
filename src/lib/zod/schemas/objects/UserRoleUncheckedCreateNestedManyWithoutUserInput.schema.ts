import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleCreateManyUserInputEnvelopeObjectSchema } from "./UserRoleCreateManyUserInputEnvelope.schema";
import { UserRoleCreateOrConnectWithoutUserInputObjectSchema } from "./UserRoleCreateOrConnectWithoutUserInput.schema";
import { UserRoleCreateWithoutUserInputObjectSchema } from "./UserRoleCreateWithoutUserInput.schema";
import { UserRoleUncheckedCreateWithoutUserInputObjectSchema } from "./UserRoleUncheckedCreateWithoutUserInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./UserRoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserRoleCreateWithoutUserInputObjectSchema),
          z.lazy(() => UserRoleCreateWithoutUserInputObjectSchema).array(),
          z.lazy(() => UserRoleUncheckedCreateWithoutUserInputObjectSchema),
          z
            .lazy(() => UserRoleUncheckedCreateWithoutUserInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => UserRoleCreateOrConnectWithoutUserInputObjectSchema),
          z
            .lazy(() => UserRoleCreateOrConnectWithoutUserInputObjectSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => UserRoleCreateManyUserInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
          z.lazy(() => UserRoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const UserRoleUncheckedCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.UserRoleUncheckedCreateNestedManyWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUncheckedCreateNestedManyWithoutUserInput>;
export const UserRoleUncheckedCreateNestedManyWithoutUserInputObjectZodSchema =
  makeSchema();
