import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateManyRoleInputEnvelopeObjectSchema } from "./RolePermissionCreateManyRoleInputEnvelope.schema";
import { RolePermissionCreateOrConnectWithoutRoleInputObjectSchema } from "./RolePermissionCreateOrConnectWithoutRoleInput.schema";
import { RolePermissionCreateWithoutRoleInputObjectSchema } from "./RolePermissionCreateWithoutRoleInput.schema";
import { RolePermissionScalarWhereInputObjectSchema } from "./RolePermissionScalarWhereInput.schema";
import { RolePermissionUncheckedCreateWithoutRoleInputObjectSchema } from "./RolePermissionUncheckedCreateWithoutRoleInput.schema";
import { RolePermissionUpdateManyWithWhereWithoutRoleInputObjectSchema } from "./RolePermissionUpdateManyWithWhereWithoutRoleInput.schema";
import { RolePermissionUpdateWithWhereUniqueWithoutRoleInputObjectSchema } from "./RolePermissionUpdateWithWhereUniqueWithoutRoleInput.schema";
import { RolePermissionUpsertWithWhereUniqueWithoutRoleInputObjectSchema } from "./RolePermissionUpsertWithWhereUniqueWithoutRoleInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./RolePermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => RolePermissionCreateWithoutRoleInputObjectSchema),
          z
            .lazy(() => RolePermissionCreateWithoutRoleInputObjectSchema)
            .array(),
          z.lazy(
            () => RolePermissionUncheckedCreateWithoutRoleInputObjectSchema
          ),
          z
            .lazy(
              () => RolePermissionUncheckedCreateWithoutRoleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => RolePermissionCreateOrConnectWithoutRoleInputObjectSchema
          ),
          z
            .lazy(
              () => RolePermissionCreateOrConnectWithoutRoleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              RolePermissionUpsertWithWhereUniqueWithoutRoleInputObjectSchema
          ),
          z
            .lazy(
              () =>
                RolePermissionUpsertWithWhereUniqueWithoutRoleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => RolePermissionCreateManyRoleInputEnvelopeObjectSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              RolePermissionUpdateWithWhereUniqueWithoutRoleInputObjectSchema
          ),
          z
            .lazy(
              () =>
                RolePermissionUpdateWithWhereUniqueWithoutRoleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => RolePermissionUpdateManyWithWhereWithoutRoleInputObjectSchema
          ),
          z
            .lazy(
              () =>
                RolePermissionUpdateManyWithWhereWithoutRoleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => RolePermissionScalarWhereInputObjectSchema),
          z.lazy(() => RolePermissionScalarWhereInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const RolePermissionUpdateManyWithoutRoleNestedInputObjectSchema: z.ZodType<Prisma.RolePermissionUpdateManyWithoutRoleNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpdateManyWithoutRoleNestedInput>;
export const RolePermissionUpdateManyWithoutRoleNestedInputObjectZodSchema =
  makeSchema();
