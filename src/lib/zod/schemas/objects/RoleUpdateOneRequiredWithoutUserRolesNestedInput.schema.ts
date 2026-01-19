import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateOrConnectWithoutUserRolesInputObjectSchema } from "./RoleCreateOrConnectWithoutUserRolesInput.schema";
import { RoleCreateWithoutUserRolesInputObjectSchema } from "./RoleCreateWithoutUserRolesInput.schema";
import { RoleUncheckedCreateWithoutUserRolesInputObjectSchema } from "./RoleUncheckedCreateWithoutUserRolesInput.schema";
import { RoleUncheckedUpdateWithoutUserRolesInputObjectSchema } from "./RoleUncheckedUpdateWithoutUserRolesInput.schema";
import { RoleUpdateToOneWithWhereWithoutUserRolesInputObjectSchema } from "./RoleUpdateToOneWithWhereWithoutUserRolesInput.schema";
import { RoleUpdateWithoutUserRolesInputObjectSchema } from "./RoleUpdateWithoutUserRolesInput.schema";
import { RoleUpsertWithoutUserRolesInputObjectSchema } from "./RoleUpsertWithoutUserRolesInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./RoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => RoleCreateWithoutUserRolesInputObjectSchema),
          z.lazy(() => RoleUncheckedCreateWithoutUserRolesInputObjectSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => RoleCreateOrConnectWithoutUserRolesInputObjectSchema)
        .optional(),
      upsert: z
        .lazy(() => RoleUpsertWithoutUserRolesInputObjectSchema)
        .optional(),
      connect: z.lazy(() => RoleWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => RoleUpdateToOneWithWhereWithoutUserRolesInputObjectSchema
          ),
          z.lazy(() => RoleUpdateWithoutUserRolesInputObjectSchema),
          z.lazy(() => RoleUncheckedUpdateWithoutUserRolesInputObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const RoleUpdateOneRequiredWithoutUserRolesNestedInputObjectSchema: z.ZodType<Prisma.RoleUpdateOneRequiredWithoutUserRolesNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateOneRequiredWithoutUserRolesNestedInput>;
export const RoleUpdateOneRequiredWithoutUserRolesNestedInputObjectZodSchema =
  makeSchema();
