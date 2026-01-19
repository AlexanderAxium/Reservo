import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionScalarWhereInputObjectSchema } from "./RolePermissionScalarWhereInput.schema";
import { RolePermissionUncheckedUpdateManyWithoutRoleInputObjectSchema } from "./RolePermissionUncheckedUpdateManyWithoutRoleInput.schema";
import { RolePermissionUpdateManyMutationInputObjectSchema } from "./RolePermissionUpdateManyMutationInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RolePermissionScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => RolePermissionUpdateManyMutationInputObjectSchema),
        z.lazy(
          () => RolePermissionUncheckedUpdateManyWithoutRoleInputObjectSchema
        ),
      ]),
    })
    .strict();
export const RolePermissionUpdateManyWithWhereWithoutRoleInputObjectSchema: z.ZodType<Prisma.RolePermissionUpdateManyWithWhereWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpdateManyWithWhereWithoutRoleInput>;
export const RolePermissionUpdateManyWithWhereWithoutRoleInputObjectZodSchema =
  makeSchema();
