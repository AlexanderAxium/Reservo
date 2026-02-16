"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const SPORT_KEYS: Record<string, string> = {
  FOOTBALL: "football",
  TENNIS: "tennis",
  BASKETBALL: "basketball",
  VOLLEYBALL: "volleyball",
  FUTSAL: "futsal",
};

export function FeaturedFieldsSection() {
  const { t } = useTranslation("home");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = trpc.field.getAllPublic.useQuery({
    limit: 12,
    page: 1,
  });

  const fields = data?.data ?? [];

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="canchas-destacadas"
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-4">
            {t("featured.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("featured.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-80 animate-pulse"
              />
            ))}
          </div>
        ) : fields.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            {t("featured.noFields")}
          </p>
        ) : (
          <>
            <div className="relative">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label={t("featured.previous")}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label={t("featured.next")}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
                style={{ scrollbarWidth: "none" }}
              >
                {fields.map((field) => {
                  const imageUrl =
                    field.images?.[0] ??
                    "https://images.unsplash.com/photo-1575361204480-05e88e6e8b1f?w=800";
                  const price = Number(field.price);
                  return (
                    <div
                      key={field.id}
                      className="flex-shrink-0 w-[320px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={imageUrl}
                          alt={field.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-emerald-600 text-white">
                          {t(`sports.${SPORT_KEYS[field.sport] ?? "football"}`)}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {field.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                          <MapPin className="h-3.5 w-3.5" />
                          {field.district ?? field.city ?? "Lima"}
                        </p>
                        {field.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                            {field.description}
                          </p>
                        )}
                        <div className="flex items-baseline gap-2 text-sm mb-3">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {formatPrice(price)}
                            {t("featured.perHour")}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {t("featured.nightRate")}:{" "}
                            {formatPrice(price * 1.25)}
                            {t("featured.perHour")}
                          </span>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Link href={`/canchas/${field.slug}`}>
                            {t("featured.viewDetails")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button
                asChild
                variant="outline"
                className="rounded-lg border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
              >
                <Link
                  href="/canchas"
                  className="inline-flex items-center gap-2"
                >
                  {t("featured.viewAll")} <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
