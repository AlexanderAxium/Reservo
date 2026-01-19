import * as z from "zod";

export const ThemeSchema = z.enum(["LIGHT", "DARK", "AUTO"]);

export type Theme = z.infer<typeof ThemeSchema>;
