import * as z from "zod";

export const LanguageSchema = z.enum(["ES", "EN", "PT"]);

export type Language = z.infer<typeof LanguageSchema>;
