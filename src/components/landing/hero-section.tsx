"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight, Calendar, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const SPORT_KEYS: Record<string, string> = {
  FOOTBALL: "football",
  TENNIS: "tennis",
  BASKETBALL: "basketball",
  VOLLEYBALL: "volleyball",
  FUTSAL: "futsal",
};

const DISTRICTS = [
  "Lima",
  "Miraflores",
  "San Isidro",
  "Surco",
  "La Molina",
  "Jesús María",
  "Lince",
  "Magdalena",
  "Pueblo Libre",
  "Barranco",
];

export function LandingHeroSection() {
  const { t } = useTranslation("home");
  const router = useRouter();
  const [sport, setSport] = useState<string>("");
  const sports = useMemo(
    () =>
      (
        ["FOOTBALL", "TENNIS", "BASKETBALL", "VOLLEYBALL", "FUTSAL"] as const
      ).map((value) => ({ value, label: t(`sports.${SPORT_KEYS[value]}`) })),
    [t]
  );
  const [district, setDistrict] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (sport) params.set("sport", sport);
    if (district) params.set("district", district);
    if (date) params.set("date", date);
    router.push(`/canchas?${params.toString()}`);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat min-h-[90vh] flex items-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920)",
      }}
    >
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Izquierda: contenido */}
          <div className="space-y-6 text-white">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/90 text-white text-sm font-medium">
              {t("hero.badge")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {t("hero.title")}{" "}
              <span className="text-emerald-400">
                {t("hero.titleHighlight1")}
              </span>{" "}
              <span className="text-emerald-400">
                {t("hero.titleHighlight2")}
              </span>{" "}
              {t("hero.titleEnd")}
            </h1>
            <p className="text-lg text-white/90 max-w-xl">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-6"
              >
                <Link
                  href="/canchas"
                  className="inline-flex items-center gap-2"
                >
                  {t("hero.searchCourts")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white bg-white/15 text-white hover:bg-white/25 hover:border-white rounded-lg px-6 font-medium shadow-lg"
              >
                <Link href="/signup">{t("hero.registerCourt")}</Link>
              </Button>
            </div>
          </div>

          {/* Derecha: formulario de búsqueda */}
          <div className="rounded-2xl bg-gray-900/80 backdrop-blur border border-white/10 p-6 lg:p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Search className="h-5 w-5 text-emerald-400" />
              {t("hero.findIdealCourt")}
            </h2>
            <form onSubmit={handleSearch} className="space-y-5">
              <div>
                <Label className="text-white/90">{t("hero.whatSport")}</Label>
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger className="mt-1.5 bg-white/5 border-white/20 text-white placeholder:text-white/50">
                    <SelectValue placeholder={t("hero.selectSport")} />
                  </SelectTrigger>
                  <SelectContent>
                    {sports.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/90">{t("hero.wherePlay")}</Label>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger className="mt-1.5 bg-white/5 border-white/20 text-white placeholder:text-white/50">
                    <MapPin className="h-4 w-4 mr-2 text-white/60" />
                    <SelectValue placeholder={t("hero.selectDistrict")} />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/90">{t("hero.whenPlay")}</Label>
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
              >
                <Search className="h-4 w-4 mr-2" />
                {t("hero.searchAvailability")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
