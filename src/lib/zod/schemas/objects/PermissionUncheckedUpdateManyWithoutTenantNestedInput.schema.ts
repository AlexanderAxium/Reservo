import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateManyTenantInputEnvelopeObjectSchema } from "./PermissionCreateManyTenantInputEnvelope.schema";
import { PermissionCreateOrConnectWithoutTenantInputObjectSchema } from "./PermissionCreateOrConnectWithoutTenantInput.schema";
import { PermissionCreateWithoutTenantInputObjectSchema } from "./PermissionCreateWithoutTenantInput.schema";
import { PermissionScalarWhereInputObjectSchema } from "./PermissionScalarWhereInput.schema";
import { PermissionUncheckedCreateWithoutTenantInputObjectSchema } from "./PermissionUncheckedCreateWithoutTenantInput.schema";
import { PermissionUpdateManyWithWhereWithoutTenantInputObjectSchema } from "./PermissionUpdateManyWithWhereWithoutTenantInput.schema";
import { PermissionUpdateWithWhereUniqueWithoutTenantInputObjectSchema } from "./PermissionUpdateWithWhereUniqueWithoutTenantInput.schema";
import { PermissionUpsertWithWhereUniqueWithoutTenantInputObjectSchema } from "./PermissionUpsertWithWhereUniqueWithoutTenantInput.schema";
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
      upsert: z
        .union([
          z.lazy(
            () => PermissionUpsertWithWhereUniqueWithoutTenantInputObjectSchema
          ),
          z
            .lazy(
              () =>
                PermissionUpsertWithWhereUniqueWithoutTenantInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => PermissionCreateManyTenantInputEnvelopeObjectSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => PermissionWhereUniqueInputObjectSchema),
          z.lazy(() => PermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => PermissionWhereUniqueInputObjectSchema),
          z.lazy(() => PermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => PermissionWhereUniqueInputObjectSchema),
          z.lazy(() => PermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => PermissionWhereUniqueInputObjectSchema),
          z.lazy(() => PermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => PermissionUpdateWithWhereUniqueWithoutTenantInputObjectSchema
          ),
          z
            .lazy(
              () =>
                PermissionUpdateWithWhereUniqueWithoutTenantInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => PermissionUpdateManyWithWhereWithoutTenantInputObjectSchema
          ),
          z
            .lazy(
              () => PermissionUpdateManyWithWhereWithoutTenantInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => PermissionScalarWhereInputObjectSchema),
          z.lazy(() => PermissionScalarWhereInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const PermissionUncheckedUpdateManyWithoutTenantNestedInputObjectSchema: z.ZodType<Prisma.PermissionUncheckedUpdateManyWithoutTenantNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionUncheckedUpdateManyWithoutTenantNestedInput>;
export const PermissionUncheckedUpdateManyWithoutTenantNestedInputObjectZodSchema =
  makeSchema();
