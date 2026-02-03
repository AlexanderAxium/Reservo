import {
  Award,
  Building2,
  Camera,
  Car,
  Clock,
  Coffee,
  Droplet,
  Dumbbell,
  Gamepad2,
  Heart,
  Lightbulb,
  Lock,
  type LucideIcon,
  MapPin,
  Music,
  Shield,
  ShowerHead,
  Sprout,
  Star,
  Tv,
  Users,
  Utensils,
  Wifi,
  Zap,
} from "lucide-react";

// Mapeo de nombres de iconos a componentes de Lucide React
const iconMap: Record<string, LucideIcon> = {
  shower: ShowerHead,
  showerhead: ShowerHead,
  locker: Lock,
  lock: Lock,
  parking: Car,
  car: Car,
  wifi: Wifi,
  light: Lightbulb,
  lightbulb: Lightbulb,
  coffee: Coffee,
  grass: Sprout,
  sprout: Sprout,
  building: Building2,
  building2: Building2,
  location: MapPin,
  mappin: MapPin,
  clock: Clock,
  users: Users,
  user: Users,
  star: Star,
  award: Award,
  shield: Shield,
  zap: Zap,
  droplet: Droplet,
  utensils: Utensils,
  music: Music,
  tv: Tv,
  gamepad: Gamepad2,
  gamepad2: Gamepad2,
  dumbbell: Dumbbell,
  camera: Camera,
  heart: Heart,
};

/**
 * Obtiene el componente de icono de Lucide React basado en el nombre del icono
 * @param iconName - Nombre del icono (puede ser el nombre del icono o un string vacío/null)
 * @param defaultIcon - Icono por defecto si no se encuentra el icono
 * @returns Componente de icono de Lucide React o null
 */
export function getFeatureIcon(
  iconName: string | null | undefined,
  defaultIcon: LucideIcon = Star
): LucideIcon | null {
  if (!iconName) {
    return defaultIcon;
  }

  // Normalizar el nombre del icono (lowercase, sin espacios)
  const normalizedName = iconName.toLowerCase().trim().replace(/\s+/g, "");

  // Buscar el icono en el mapa
  const IconComponent = iconMap[normalizedName];

  return IconComponent || defaultIcon;
}

/**
 * Renderiza un icono de feature
 * @param iconName - Nombre del icono
 * @param className - Clases CSS adicionales
 * @param size - Tamaño del icono (por defecto 20)
 * @param defaultIcon - Icono por defecto si no se encuentra
 * @returns Componente JSX del icono
 */
export function FeatureIcon({
  iconName,
  className = "",
  size = 20,
  defaultIcon = Star,
}: {
  iconName: string | null | undefined;
  className?: string;
  size?: number;
  defaultIcon?: LucideIcon;
}) {
  const IconComponent = getFeatureIcon(iconName, defaultIcon);

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} size={size} />;
}
