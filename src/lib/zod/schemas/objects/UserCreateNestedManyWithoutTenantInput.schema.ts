import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateManyTenantInputEnvelopeObjectSchema } from "./UserCreateManyTenantInputEnvelope.schema";
import { UserCreateOrConnectWithoutTenantInputObjectSchema } from "./UserCreateOrConnectWithoutTenantInput.schema";
import { UserCreateWithoutTenantInputObjectSchema } from "./UserCreateWithoutTenantInput.schema";
import { UserUncheckedCreateWithoutTenantInputObjectSchema } from "./UserUncheckedCreateWithoutTenantInput.schema";
import { UserWhereUniqueInputObjectSchema } from "./UserWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutTenantInputObjectSchema),
          z.lazy(() => UserCreateWithoutTenantInputObjectSchema).array(),
          z.lazy(() => UserUncheckedCreateWithoutTenantInputObjectSchema),
          z
            .lazy(() => UserUncheckedCreateWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => UserCreateOrConnectWithoutTenantInputObjectSchema),
          z
            .lazy(() => UserCreateOrConnectWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => UserCreateManyTenantInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => UserWhereUniqueInputObjectSchema),
          z.lazy(() => UserWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const UserCreateNestedManyWithoutTenantInputObjectSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedManyWithoutTenantInput>;
export const UserCreateNestedManyWithoutTenantInputObjectZodSchema =
  makeSchema();
