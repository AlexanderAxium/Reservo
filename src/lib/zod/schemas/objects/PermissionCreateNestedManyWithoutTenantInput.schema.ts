import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateManyTenantInputEnvelopeObjectSchema } from "./PermissionCreateManyTenantInputEnvelope.schema";
import { PermissionCreateOrConnectWithoutTenantInputObjectSchema } from "./PermissionCreateOrConnectWithoutTenantInput.schema";
import { PermissionCreateWithoutTenantInputObjectSchema } from "./PermissionCreateWithoutTenantInput.schema";
import { PermissionUncheckedCreateWithoutTenantInputObjectSchema } from "./PermissionUncheckedCreateWithoutTenantInput.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./PermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => PermissionCreateWithoutTenantInputObjectSchema),
          z.lazy(() => PermissionCreateWithoutTenantInputObjectSchema).array(),
          z.lazy(() => PermissionUncheckedCreateWithoutTenantInputObjectSchema),
          z
            .lazy(() => PermissionUncheckedCreateWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => PermissionCreateOrConnectWithoutTenantInputObjectSchema),
          z
            .lazy(() => PermissionCreateOrConnectWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => PermissionCreateManyTenantInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => PermissionWhereUniqueInputObjectSchema),
          z.lazy(() => PermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const PermissionCreateNestedManyWithoutTenantInputObjectSchema: z.ZodType<Prisma.PermissionCreateNestedManyWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateNestedManyWithoutTenantInput>;
export const PermissionCreateNestedManyWithoutTenantInputObjectZodSchema =
  makeSchema();
