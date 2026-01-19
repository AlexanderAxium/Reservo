import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionScalarWhereInputObjectSchema } from "./RolePermissionScalarWhereInput.schema";
import { RolePermissionUncheckedUpdateManyWithoutPermissionInputObjectSchema } from "./RolePermissionUncheckedUpdateManyWithoutPermissionInput.schema";
import { RolePermissionUpdateManyMutationInputObjectSchema } from "./RolePermissionUpdateManyMutationInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RolePermissionScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => RolePermissionUpdateManyMutationInputObjectSchema),
        z.lazy(
          () =>
            RolePermissionUncheckedUpdateManyWithoutPermissionInputObjectSchema
        ),
      ]),
    })
    .strict();
export const RolePermissionUpdateManyWithWhereWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RolePermissionUpdateManyWithWhereWithoutPermissionInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpdateManyWithWhereWithoutPermissionInput>;
export const RolePermissionUpdateManyWithWhereWithoutPermissionInputObjectZodSchema =
  makeSchema();
