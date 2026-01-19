import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateManyRoleInputEnvelopeObjectSchema } from "./RolePermissionCreateManyRoleInputEnvelope.schema";
import { RolePermissionCreateOrConnectWithoutRoleInputObjectSchema } from "./RolePermissionCreateOrConnectWithoutRoleInput.schema";
import { RolePermissionCreateWithoutRoleInputObjectSchema } from "./RolePermissionCreateWithoutRoleInput.schema";
import { RolePermissionUncheckedCreateWithoutRoleInputObjectSchema } from "./RolePermissionUncheckedCreateWithoutRoleInput.schema";
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
      createMany: z
        .lazy(() => RolePermissionCreateManyRoleInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
          z.lazy(() => RolePermissionWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const RolePermissionCreateNestedManyWithoutRoleInputObjectSchema: z.ZodType<Prisma.RolePermissionCreateNestedManyWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCreateNestedManyWithoutRoleInput>;
export const RolePermissionCreateNestedManyWithoutRoleInputObjectZodSchema =
  makeSchema();
