import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCountOutputTypeCountAccountsArgsObjectSchema } from "./UserCountOutputTypeCountAccountsArgs.schema";
import { UserCountOutputTypeCountSessionsArgsObjectSchema } from "./UserCountOutputTypeCountSessionsArgs.schema";
import { UserCountOutputTypeCountUserRolesArgsObjectSchema } from "./UserCountOutputTypeCountUserRolesArgs.schema";

const makeSchema = () =>
  z
    .object({
      accounts: z
        .union([
          z.boolean(),
          z.lazy(() => UserCountOutputTypeCountAccountsArgsObjectSchema),
        ])
        .optional(),
      sessions: z
        .union([
          z.boolean(),
          z.lazy(() => UserCountOutputTypeCountSessionsArgsObjectSchema),
        ])
        .optional(),
      userRoles: z
        .union([
          z.boolean(),
          z.lazy(() => UserCountOutputTypeCountUserRolesArgsObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const UserCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCountOutputTypeSelect>;
export const UserCountOutputTypeSelectObjectZodSchema = makeSchema();
