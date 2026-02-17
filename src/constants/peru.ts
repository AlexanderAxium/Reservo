/**
 * Constantes geográficas del Perú para formularios y filtros.
 */

export const PERU_DEPARTMENTS = [
  "Amazonas",
  "Áncash",
  "Apurímac",
  "Arequipa",
  "Ayacucho",
  "Cajamarca",
  "Callao",
  "Cusco",
  "Huancavelica",
  "Huánuco",
  "Ica",
  "Junín",
  "La Libertad",
  "Lambayeque",
  "Lima",
  "Loreto",
  "Madre de Dios",
  "Moquegua",
  "Pasco",
  "Piura",
  "Puno",
  "San Martín",
  "Tacna",
  "Tumbes",
  "Ucayali",
] as const;

export const LIMA_DISTRICTS = [
  "Barranco",
  "Breña",
  "Cercado de Lima",
  "Chorrillos",
  "Comas",
  "El Agustino",
  "Jesús María",
  "La Molina",
  "La Victoria",
  "Lince",
  "Los Olivos",
  "Magdalena del Mar",
  "Miraflores",
  "Pueblo Libre",
  "Rímac",
  "San Borja",
  "San Isidro",
  "San Juan de Lurigancho",
  "San Juan de Miraflores",
  "San Luis",
  "San Martín de Porres",
  "San Miguel",
  "Santa Anita",
  "Santiago de Surco",
  "Surquillo",
  "Villa El Salvador",
  "Villa María del Triunfo",
] as const;

export type PeruDepartment = (typeof PERU_DEPARTMENTS)[number];
export type LimaDistrict = (typeof LIMA_DISTRICTS)[number];
