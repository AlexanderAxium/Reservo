import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LanguageSchema } from "../enums/Language.schema";
import { ThemeSchema } from "../enums/Theme.schema";
import { AccountUpdateManyWithoutUserNestedInputObjectSchema } from "./AccountUpdateManyWithoutUserNestedInput.schema";
import { BoolFieldUpdateOperationsInputObjectSchema } from "./BoolFieldUpdateOperationsInput.schema";
import { DateTimeFieldUpdateOperationsInputObjectSchema } from "./DateTimeFieldUpdateOperationsInput.schema";
import { EnumLanguageFieldUpdateOperationsInputObjectSchema } from "./EnumLanguageFieldUpdateOperationsInput.schema";
import { EnumThemeFieldUpdateOperationsInputObjectSchema } from "./EnumThemeFieldUpdateOperationsInput.schema";
import { NullableStringFieldUpdateOperationsInputObjectSchema } from "./NullableStringFieldUpdateOperationsInput.schema";
import { SessionUpdateManyWithoutUserNestedInputObjectSchema } from "./SessionUpdateManyWithoutUserNestedInput.schema";
import { StringFieldUpdateOperationsInputObjectSchema } from "./StringFieldUpdateOperationsInput.schema";
import { UserRoleUpdateManyWithoutUserNestedInputObjectSchema } from "./UserRoleUpdateManyWithoutUserNestedInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      emailVerified: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      image: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      phone: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      language: z
        .union([
          LanguageSchema,
          z.lazy(() => EnumLanguageFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      theme: z
        .union([
          ThemeSchema,
          z.lazy(() => EnumThemeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      accounts: z
        .lazy(() => AccountUpdateManyWithoutUserNestedInputObjectSchema)
        .optional(),
      sessions: z
        .lazy(() => SessionUpdateManyWithoutUserNestedInputObjectSchema)
        .optional(),
      userRoles: z
        .lazy(() => UserRoleUpdateManyWithoutUserNestedInputObjectSchema)
        .optional(),
    })
    .strict();
export const UserUpdateWithoutTenantInputObjectSchema: z.ZodType<Prisma.UserUpdateWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserUpdateWithoutTenantInput>;
export const UserUpdateWithoutTenantInputObjectZodSchema = makeSchema();
