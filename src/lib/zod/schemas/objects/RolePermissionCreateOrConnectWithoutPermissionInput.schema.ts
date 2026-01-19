import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateWithoutPermissionInputObjectSchema } from "./RolePermissionCreateWithoutPermissionInput.schema";
import { RolePermissionUncheckedCreateWithoutPermissionInputObjectSchema } from "./RolePermissionUncheckedCreateWithoutPermissionInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./RolePermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => RolePermissionCreateWithoutPermissionInputObjectSchema),
        z.lazy(
          () => RolePermissionUncheckedCreateWithoutPermissionInputObjectSchema
        ),
      ]),
    })
    .strict();
export const RolePermissionCreateOrConnectWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RolePermissionCreateOrConnectWithoutPermissionInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCreateOrConnectWithoutPermissionInput>;
export const RolePermissionCreateOrConnectWithoutPermissionInputObjectZodSchema =
  makeSchema();
