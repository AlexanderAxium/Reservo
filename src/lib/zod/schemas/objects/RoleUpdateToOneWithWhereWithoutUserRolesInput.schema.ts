import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleUncheckedUpdateWithoutUserRolesInputObjectSchema } from "./RoleUncheckedUpdateWithoutUserRolesInput.schema";
import { RoleUpdateWithoutUserRolesInputObjectSchema } from "./RoleUpdateWithoutUserRolesInput.schema";
import { RoleWhereInputObjectSchema } from "./RoleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RoleWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => RoleUpdateWithoutUserRolesInputObjectSchema),
        z.lazy(() => RoleUncheckedUpdateWithoutUserRolesInputObjectSchema),
      ]),
    })
    .strict();
export const RoleUpdateToOneWithWhereWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.RoleUpdateToOneWithWhereWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateToOneWithWhereWithoutUserRolesInput>;
export const RoleUpdateToOneWithWhereWithoutUserRolesInputObjectZodSchema =
  makeSchema();
