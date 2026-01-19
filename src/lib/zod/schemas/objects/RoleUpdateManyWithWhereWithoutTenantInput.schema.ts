import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleScalarWhereInputObjectSchema } from "./RoleScalarWhereInput.schema";
import { RoleUncheckedUpdateManyWithoutTenantInputObjectSchema } from "./RoleUncheckedUpdateManyWithoutTenantInput.schema";
import { RoleUpdateManyMutationInputObjectSchema } from "./RoleUpdateManyMutationInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RoleScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => RoleUpdateManyMutationInputObjectSchema),
        z.lazy(() => RoleUncheckedUpdateManyWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const RoleUpdateManyWithWhereWithoutTenantInputObjectSchema: z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutTenantInput>;
export const RoleUpdateManyWithWhereWithoutTenantInputObjectZodSchema =
  makeSchema();
