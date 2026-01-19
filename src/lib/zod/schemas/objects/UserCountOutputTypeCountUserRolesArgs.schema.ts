import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleWhereInputObjectSchema } from "./UserRoleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserRoleWhereInputObjectSchema).optional(),
    })
    .strict();
export const UserCountOutputTypeCountUserRolesArgsObjectSchema = makeSchema();
export const UserCountOutputTypeCountUserRolesArgsObjectZodSchema =
  makeSchema();
