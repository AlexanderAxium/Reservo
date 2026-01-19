import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateWithoutPermissionInputObjectSchema } from "./RolePermissionCreateWithoutPermissionInput.schema";
import { RolePermissionUncheckedCreateWithoutPermissionInputObjectSchema } from "./RolePermissionUncheckedCreateWithoutPermissionInput.schema";
import { RolePermissionUncheckedUpdateWithoutPermissionInputObjectSchema } from "./RolePermissionUncheckedUpdateWithoutPermissionInput.schema";
import { RolePermissionUpdateWithoutPermissionInputObjectSchema } from "./RolePermissionUpdateWithoutPermissionInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./RolePermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => RolePermissionUpdateWithoutPermissionInputObjectSchema),
        z.lazy(
          () => RolePermissionUncheckedUpdateWithoutPermissionInputObjectSchema
        ),
      ]),
      create: z.union([
        z.lazy(() => RolePermissionCreateWithoutPermissionInputObjectSchema),
        z.lazy(
          () => RolePermissionUncheckedCreateWithoutPermissionInputObjectSchema
        ),
      ]),
    })
    .strict();
export const RolePermissionUpsertWithWhereUniqueWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RolePermissionUpsertWithWhereUniqueWithoutPermissionInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpsertWithWhereUniqueWithoutPermissionInput>;
export const RolePermissionUpsertWithWhereUniqueWithoutPermissionInputObjectZodSchema =
  makeSchema();
