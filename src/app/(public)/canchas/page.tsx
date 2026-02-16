"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { FeatureIcon } from "@/lib/feature-icons";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import {
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type SportFilter =
  | "FOOTBALL"
  | "TENNIS"
  | "BASKETBALL"
  | "VOLLEYBALL"
  | "FUTSAL"
  | undefined;

const SPORT_KEYS: Record<string, string> = {
  FOOTBALL: "football",
  TENNIS: "tennis",
  BASKETBALL: "basketball",
  VOLLEYBALL: "volleyball",
  FUTSAL: "futsal",
};

const SPORT_OPTIONS: { value: SportFilter; labelKey: string }[] = [
  { value: undefined, labelKey: "allSports" },
  { value: "FOOTBALL", labelKey: "football" },
  { value: "TENNIS", labelKey: "tennis" },
  { value: "BASKETBALL", labelKey: "basketball" },
  { value: "VOLLEYBALL", labelKey: "volleyball" },
  { value: "FUTSAL", labelKey: "futsal" },
];

function FieldCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function FilterSidebar({
  search,
  setSearch,
  sportFilter,
  setSportFilter,
  setPage,
  t,
  totalResults,
}: {
  search: string;
  setSearch: (v: string) => void;
  sportFilter: SportFilter;
  setSportFilter: (v: SportFilter) => void;
  setPage: (v: number) => void;
  t: (key: string, params?: Record<string, string>) => string;
  totalResults: number;
}) {
  const hasFilters = !!search || !!sportFilter;

  return (
    <div className="space-y-6">
      {/* Búsqueda */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          {t("searchPlaceholder")}
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Deporte */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          {t("sportType")}
        </Label>
        <div className="flex flex-col gap-1.5">
          {SPORT_OPTIONS.map((opt) => (
            <button
              key={opt.value ?? "all"}
              type="button"
              onClick={() => {
                setSportFilter(opt.value);
                setPage(1);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sportFilter === opt.value
                  ? "bg-teal-600 text-white"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => {
              setSearch("");
              setSportFilter(undefined);
              setPage(1);
            }}
          >
            <X className="h-4 w-4 mr-1" />
            {t("clearFilters")}
          </Button>
        </>
      )}

      <Separator />

      {/* Contador */}
      <p className="text-sm text-muted-foreground">
        {t("resultsCount", { count: String(totalResults) })}
      </p>
    </div>
  );
}

export default function PublicCanchasPage() {
  const { t } = useTranslation("fields");
  const searchParams = useSearchParams();
  const initialSport = useMemo(
    () => (searchParams.get("sport") as SportFilter) ?? undefined,
    [searchParams]
  );
  const initialDistrict = useMemo(
    () => searchParams.get("district") ?? undefined,
    [searchParams]
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(initialDistrict ?? "");
  const [sportFilter, setSportFilter] = useState<SportFilter>(initialSport);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data, isLoading } = trpc.field.getAllPublic.useQuery({
    page,
    limit: 12,
    search: search || undefined,
    sport: sportFilter,
  });

  const fields = data?.data ?? [];
  const pagination = data?.pagination;
  const totalResults = pagination?.total ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero delgado */}
      <section className="relative bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920')] bg-cover bg-center opacity-15" />
        <div className="relative container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {t("heroTitle")}
            </h1>
            <p className="text-white/85 text-lg">{t("heroSubtitle")}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                {t("filters")}
              </h2>
              <FilterSidebar
                search={search}
                setSearch={setSearch}
                sportFilter={sportFilter}
                setSportFilter={setSportFilter}
                setPage={setPage}
                t={t}
                totalResults={totalResults}
              />
            </div>
          </aside>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            {/* Mobile: botón filtros + contador */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {t("resultsCount", { count: String(totalResults) })}
              </p>
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {t("filters")}
                    {(!!search || !!sportFilter) && (
                      <span className="ml-1.5 h-5 w-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center">
                        {(search ? 1 : 0) + (sportFilter ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      {t("filters")}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar
                      search={search}
                      setSearch={setSearch}
                      sportFilter={sportFilter}
                      setSportFilter={(v) => {
                        setSportFilter(v);
                        setMobileFiltersOpen(false);
                      }}
                      setPage={setPage}
                      t={t}
                      totalResults={totalResults}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Chips activos en mobile */}
            {(!!search || !!sportFilter) && (
              <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
                {sportFilter && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => {
                      setSportFilter(undefined);
                      setPage(1);
                    }}
                  >
                    {t(SPORT_KEYS[sportFilter] ?? "football")}
                    <X className="h-3 w-3" />
                  </Badge>
                )}
                {search && (
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                  >
                    &quot;{search}&quot;
                    <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}

            {/* Resultados */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <FieldCardSkeleton key={`skeleton-${i.toString()}`} />
                ))}
              </div>
            ) : fields.length === 0 ? (
              <Card className="py-16 text-center">
                <CardContent className="space-y-3">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-muted-foreground text-base">
                    {t("noFieldsFound")}
                  </p>
                  {(!!search || !!sportFilter) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setSportFilter(undefined);
                        setPage(1);
                      }}
                    >
                      {t("clearFilters")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {fields.map((field) => {
                  const imageUrl =
                    field.images?.[0] ??
                    "https://images.unsplash.com/photo-1575361204480-05e88e6e8b1f?w=800";
                  const locationName =
                    field.sportCenter?.name ?? t("independentField");
                  const district = (field.district ?? field.city ?? "")
                    .toString()
                    .trim();
                  const price = Number(field.price);
                  return (
                    <Card
                      key={field.id}
                      className="overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      <Link href={`/canchas/${field.slug}`}>
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={field.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {t("available")}
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-teal-700/95 dark:bg-teal-600/95 backdrop-blur-sm text-white border-0 font-semibold shadow-sm">
                              {t(SPORT_KEYS[field.sport] ?? "football")}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <CardTitle className="text-lg mb-1">
                            {field.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {locationName}
                            {district ? `, ${district}` : ""}
                          </CardDescription>
                        </div>
                        {field.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {field.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          {field.fieldFeatures && field.fieldFeatures.length > 0
                            ? field.fieldFeatures.slice(0, 4).map((ff) => (
                                <Badge
                                  key={ff.id}
                                  variant="secondary"
                                  className="text-xs gap-1"
                                >
                                  <FeatureIcon
                                    iconName={ff.feature?.icon}
                                    className="h-3 w-3"
                                    size={12}
                                  />
                                  {ff.feature?.name ?? ""}
                                </Badge>
                              ))
                            : null}
                        </div>
                        <div className="rounded-lg bg-muted border border-border p-3">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            {t("pricePerHour")}
                          </p>
                          <p className="font-semibold text-foreground">
                            S/ {formatPrice(price)} /{t("perHour")}
                          </p>
                        </div>
                        <Button
                          asChild
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          <Link
                            href={`/canchas/${field.slug}`}
                            className="inline-flex items-center justify-center gap-2"
                          >
                            {t("reserve")} <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  {t("previous")}
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  {t("pageOf", {
                    page: String(page),
                    total: String(pagination.totalPages),
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t("next")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
