"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import {
  Car,
  ChevronRight,
  Lightbulb,
  MapPin,
  Search,
  ShowerHead,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const SPORT_LABELS: Record<string, string> = {
  FOOTBALL: "FOOTBALL",
  TENNIS: "TENNIS",
  BASKETBALL: "BASKETBALL",
  VOLLEYBALL: "VOLLEYBALL",
  FUTSAL: "FUTSAL",
};

const DEFAULT_FEATURES = [
  { icon: Lightbulb, label: "Iluminación" },
  { icon: Car, label: "Estacionamiento" },
  { icon: ShowerHead, label: "Duchas" },
];

export default function PublicCanchasPage() {
  const searchParams = useSearchParams();
  const initialSport = useMemo(
    () => searchParams.get("sport") ?? undefined,
    [searchParams]
  );
  const initialDistrict = useMemo(
    () => searchParams.get("district") ?? undefined,
    [searchParams]
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(initialDistrict ?? "");

  const { data, isLoading } = trpc.field.getAllPublic.useQuery({
    page,
    limit: 12,
    search: search || undefined,
    sport: initialSport as
      | "FOOTBALL"
      | "TENNIS"
      | "BASKETBALL"
      | "VOLLEYBALL"
      | "FUTSAL"
      | undefined,
  });

  const fields = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Canchas disponibles
          </h1>
          <p className="text-muted-foreground mt-1">
            Elige una cancha y reserva tu horario
          </p>
        </div>

        <div className="mb-8 flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, ciudad, distrito..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 border-border bg-muted focus:bg-background"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">
            Cargando canchas...
          </p>
        ) : fields.length === 0 ? (
          <div className="rounded-xl border border-border bg-card py-12 text-center text-muted-foreground">
            No se encontraron canchas disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => {
              const imageUrl =
                field.images?.[0] ??
                "https://images.unsplash.com/photo-1575361204480-05e88e6e8b1f?w=800";
              const locationName =
                field.sportCenter?.name ?? "Cancha independiente";
              const district = (field.district ?? field.city ?? "LIMA")
                .toString()
                .toUpperCase()
                .replace(/\s+/g, "_");
              const price = Number(field.price);
              return (
                <div
                  key={field.id}
                  className="rounded-xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={field.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Disponible
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-teal-600 text-white border-0 font-medium">
                        {SPORT_LABELS[field.sport] ?? field.sport}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="font-bold text-foreground text-lg mb-1">
                      {field.name}
                    </h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                      {locationName}, {district}
                    </p>
                    {field.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {field.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {DEFAULT_FEATURES.map((f) => (
                        <span
                          key={f.label}
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground border border-border"
                        >
                          <f.icon className="h-3.5 w-3.5 text-muted-foreground" />
                          {f.label}
                        </span>
                      ))}
                    </div>
                    <div className="rounded-lg bg-muted border border-border p-3 mb-4">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Precio por hora
                      </p>
                      <p className="font-semibold text-foreground">
                        S/ {formatPrice(price)} /hora
                      </p>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
                    >
                      <Link
                        href={`/canchas/${field.id}`}
                        className="inline-flex items-center justify-center gap-2"
                      >
                        Reservar <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="border-border text-foreground"
            >
              Anterior
            </Button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Página {page} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border-border text-foreground"
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
