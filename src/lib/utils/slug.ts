/**
 * Genera un slug URL-friendly a partir de un nombre y deporte.
 * Ejemplo: "Cancha Fútbol 7" + "FOOTBALL" → "cancha-futbol-7"
 * Si hay colisión, se le agrega un sufijo numérico.
 */
export function generateSlug(name: string, sport?: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo alfanuméricos, espacios, guiones
    .replace(/\s+/g, "-") // Espacios → guiones
    .replace(/-+/g, "-") // Múltiples guiones → uno
    .replace(/^-|-$/g, ""); // Trim guiones

  if (sport) {
    const sportSlug = sport.toLowerCase().replace(/_/g, "-");
    return `${base}-${sportSlug}`;
  }

  return base;
}

/**
 * Genera un slug único verificando contra un Set de slugs existentes.
 */
export function generateUniqueSlug(
  name: string,
  sport: string,
  existingSlugs: Set<string>
): string {
  const base = generateSlug(name, sport);
  if (!existingSlugs.has(base)) return base;

  let counter = 2;
  while (existingSlugs.has(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}
