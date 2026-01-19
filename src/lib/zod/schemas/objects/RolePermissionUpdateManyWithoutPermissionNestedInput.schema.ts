import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateManyPermissionInputEnvelopeObjectSchema } from "./RolePermissionCreateManyPermissionInputEnvelope.schema";
import { RolePermissionCreateOrConnectWithoutPermissionInputObjectSchema } from "./RolePermissionCreateOrConnectWithoutPermissionInput.schema";
import { RolePermissionCreateWithoutPermissionInputObjectSchema } from "./RolePermissionCreateWithoutPermissionInput.schema";
import { RolePermissionScalarWhereInputObjectSchema } from "./RolePermissionScalarWhereInput.schema";
import { RolePermissionUncheckedCreateWithoutPermissionInputObjectSchema } from "./RolePermissionUncheckedCreateWithoutPermissionInput.schema";
import { RolePermissionUpdateManyWithWhereWithoutPermissionInputObjectSchema } from "./RolePermissionUpdateManyWithWhereWithoutPermissionInput.schema";
import { RolePermissionUpdateWithWhereUniqueWithoutPermissionInputObjectSchema } from "./RolePermissionUpdateWithWhereUniqueWithoutPermissionInput.schema";
import { RolePermissionUpsertWithWhereUniqueWithoutPermissionInputObjectSchema } from "./RolePermissionUpsertWithWhereUniqueWithoutPermissionInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./RolePermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => RolePermissionCreateWithoutPermissionInputObjectSchema),
          z
            .lazy(() => RolePermissionCreateWithoutPermissionInputObjectSchema)
            .array(),
          z.lazy(
            () =>
              RolePermissionUncheckedCreateWithoutPermissionInputObjectSchema
          ),
          z
            .lazy(
              () =>
                RolePermissionUncheckedCreateWithoutPermissionInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () =>
              RolePermissionCreateOrConnectWithoutPermissionInputObjectSchema
          ),
          z
            .lazy(
              () =>
                RolePermissionCreateOrConnectWithoutPermissionInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              RolePermissionUpsertWithWhereUniqueWithoutPermissionInputObjectSchema
          ),
          z
            .lazy(
              () =>
                RolePermissionUpsertWithWhereUniqueWithoutPermissionInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => RolePermissionCreateManyPermissionInputEnvelopeObjectSchema)
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
              RolePermissionUpdateWithWhereUniqueWithoutPermissionInputObjectSchema
          ),
          z
            .lazy(
              () =>
                RolePermissionUpdateWithWhereUniqueWithoutPermissionInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () =>
              RolePermissionUpdateManyWithWhereWithoutPermissionInputObjectSchema
          ),
          z
            .lazy(
              () =>
                RolePermissionUpdateManyWithWhereWithoutPermissionInputObjectSchema
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
export const RolePermissionUpdateManyWithoutPermissionNestedInputObjectSchema: z.ZodType<Prisma.RolePermissionUpdateManyWithoutPermissionNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpdateManyWithoutPermissionNestedInput>;
export const RolePermissionUpdateManyWithoutPermissionNestedInputObjectZodSchema =
  makeSchema();
