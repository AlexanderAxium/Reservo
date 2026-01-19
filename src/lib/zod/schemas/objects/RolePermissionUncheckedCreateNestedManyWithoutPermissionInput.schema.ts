import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateManyPermissionInputEnvelopeObjectSchema } from "./RolePermissionCreateManyPermissionInputEnvelope.schema";
import { RolePermissionCreateOrConnectWithoutPermissionInputObjectSchema } from "./RolePermissionCreateOrConnectWithoutPermissionInput.schema";
import { RolePermissionCreateWithoutPermissionInputObjectSchema } from "./RolePermissionCreateWithoutPermissionInput.schema";
import { RolePermissionUncheckedCreateWithoutPermissionInputObjectSchema } from "./RolePermissionUncheckedCreateWithoutPermissionInput.schema";
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
      createMany: z
        .lazy(() => RolePermissionCreateManyPermissionInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const RolePermissionUncheckedCreateNestedManyWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RolePermissionUncheckedCreateNestedManyWithoutPermissionInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUncheckedCreateNestedManyWithoutPermissionInput>;
export const RolePermissionUncheckedCreateNestedManyWithoutPermissionInputObjectZodSchema =
  makeSchema();
