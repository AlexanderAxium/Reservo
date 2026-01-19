import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateManyTenantInputEnvelopeObjectSchema } from "./RoleCreateManyTenantInputEnvelope.schema";
import { RoleCreateOrConnectWithoutTenantInputObjectSchema } from "./RoleCreateOrConnectWithoutTenantInput.schema";
import { RoleCreateWithoutTenantInputObjectSchema } from "./RoleCreateWithoutTenantInput.schema";
import { RoleScalarWhereInputObjectSchema } from "./RoleScalarWhereInput.schema";
import { RoleUncheckedCreateWithoutTenantInputObjectSchema } from "./RoleUncheckedCreateWithoutTenantInput.schema";
import { RoleUpdateManyWithWhereWithoutTenantInputObjectSchema } from "./RoleUpdateManyWithWhereWithoutTenantInput.schema";
import { RoleUpdateWithWhereUniqueWithoutTenantInputObjectSchema } from "./RoleUpdateWithWhereUniqueWithoutTenantInput.schema";
import { RoleUpsertWithWhereUniqueWithoutTenantInputObjectSchema } from "./RoleUpsertWithWhereUniqueWithoutTenantInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./RoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => RoleCreateWithoutTenantInputObjectSchema),
          z.lazy(() => RoleCreateWithoutTenantInputObjectSchema).array(),
          z.lazy(() => RoleUncheckedCreateWithoutTenantInputObjectSchema),
          z
            .lazy(() => RoleUncheckedCreateWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => RoleCreateOrConnectWithoutTenantInputObjectSchema),
          z
            .lazy(() => RoleCreateOrConnectWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => RoleUpsertWithWhereUniqueWithoutTenantInputObjectSchema),
          z
            .lazy(() => RoleUpsertWithWhereUniqueWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => RoleCreateManyTenantInputEnvelopeObjectSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => RoleWhereUniqueInputObjectSchema),
          z.lazy(() => RoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => RoleWhereUniqueInputObjectSchema),
          z.lazy(() => RoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => RoleWhereUniqueInputObjectSchema),
          z.lazy(() => RoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => RoleWhereUniqueInputObjectSchema),
          z.lazy(() => RoleWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => RoleUpdateWithWhereUniqueWithoutTenantInputObjectSchema),
          z
            .lazy(() => RoleUpdateWithWhereUniqueWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => RoleUpdateManyWithWhereWithoutTenantInputObjectSchema),
          z
            .lazy(() => RoleUpdateManyWithWhereWithoutTenantInputObjectSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => RoleScalarWhereInputObjectSchema),
          z.lazy(() => RoleScalarWhereInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const RoleUncheckedUpdateManyWithoutTenantNestedInputObjectSchema: z.ZodType<Prisma.RoleUncheckedUpdateManyWithoutTenantNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedUpdateManyWithoutTenantNestedInput>;
export const RoleUncheckedUpdateManyWithoutTenantNestedInputObjectZodSchema =
  makeSchema();
