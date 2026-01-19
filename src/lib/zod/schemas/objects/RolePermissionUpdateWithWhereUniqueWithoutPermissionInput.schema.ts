import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionUncheckedUpdateWithoutPermissionInputObjectSchema } from "./RolePermissionUncheckedUpdateWithoutPermissionInput.schema";
import { RolePermissionUpdateWithoutPermissionInputObjectSchema } from "./RolePermissionUpdateWithoutPermissionInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./RolePermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => RolePermissionUpdateWithoutPermissionInputObjectSchema),
        z.lazy(
          () => RolePermissionUncheckedUpdateWithoutPermissionInputObjectSchema
        ),
      ]),
    })
    .strict();
export const RolePermissionUpdateWithWhereUniqueWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RolePermissionUpdateWithWhereUniqueWithoutPermissionInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpdateWithWhereUniqueWithoutPermissionInput>;
export const RolePermissionUpdateWithWhereUniqueWithoutPermissionInputObjectZodSchema =
  makeSchema();
