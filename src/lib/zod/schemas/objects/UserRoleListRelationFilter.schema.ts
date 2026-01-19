import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleWhereInputObjectSchema } from "./UserRoleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      every: z.lazy(() => UserRoleWhereInputObjectSchema).optional(),
      some: z.lazy(() => UserRoleWhereInputObjectSchema).optional(),
      none: z.lazy(() => UserRoleWhereInputObjectSchema).optional(),
    })
    .strict();
export const UserRoleListRelationFilterObjectSchema: z.ZodType<Prisma.UserRoleListRelationFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleListRelationFilter>;
export const UserRoleListRelationFilterObjectZodSchema = makeSchema();
