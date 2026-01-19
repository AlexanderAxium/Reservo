import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionScalarWhereInputObjectSchema } from "./PermissionScalarWhereInput.schema";
import { PermissionUncheckedUpdateManyWithoutTenantInputObjectSchema } from "./PermissionUncheckedUpdateManyWithoutTenantInput.schema";
import { PermissionUpdateManyMutationInputObjectSchema } from "./PermissionUpdateManyMutationInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => PermissionScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => PermissionUpdateManyMutationInputObjectSchema),
        z.lazy(
          () => PermissionUncheckedUpdateManyWithoutTenantInputObjectSchema
        ),
      ]),
    })
    .strict();
export const PermissionUpdateManyWithWhereWithoutTenantInputObjectSchema: z.ZodType<Prisma.PermissionUpdateManyWithWhereWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionUpdateManyWithWhereWithoutTenantInput>;
export const PermissionUpdateManyWithWhereWithoutTenantInputObjectZodSchema =
  makeSchema();
