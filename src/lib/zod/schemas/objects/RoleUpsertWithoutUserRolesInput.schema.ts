import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateWithoutUserRolesInputObjectSchema } from "./RoleCreateWithoutUserRolesInput.schema";
import { RoleUncheckedCreateWithoutUserRolesInputObjectSchema } from "./RoleUncheckedCreateWithoutUserRolesInput.schema";
import { RoleUncheckedUpdateWithoutUserRolesInputObjectSchema } from "./RoleUncheckedUpdateWithoutUserRolesInput.schema";
import { RoleUpdateWithoutUserRolesInputObjectSchema } from "./RoleUpdateWithoutUserRolesInput.schema";
import { RoleWhereInputObjectSchema } from "./RoleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      update: z.union([
        z.lazy(() => RoleUpdateWithoutUserRolesInputObjectSchema),
        z.lazy(() => RoleUncheckedUpdateWithoutUserRolesInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => RoleCreateWithoutUserRolesInputObjectSchema),
        z.lazy(() => RoleUncheckedCreateWithoutUserRolesInputObjectSchema),
      ]),
      where: z.lazy(() => RoleWhereInputObjectSchema).optional(),
    })
    .strict();
export const RoleUpsertWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.RoleUpsertWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUpsertWithoutUserRolesInput>;
export const RoleUpsertWithoutUserRolesInputObjectZodSchema = makeSchema();
