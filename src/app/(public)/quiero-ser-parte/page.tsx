"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  CreditCard,
  MessageCircle,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "51999888777";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, quiero registrar mi cancha en Cancha Libre"
);

const FEATURES = [
  {
    icon: Calendar,
    titleKey: "joinUsFeatureReservations",
    descKey: "joinUsFeatureReservationsDesc",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400",
  },
  {
    icon: CreditCard,
    titleKey: "joinUsFeaturePayments",
    descKey: "joinUsFeaturePaymentsDesc",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
  },
  {
    icon: Users,
    titleKey: "joinUsFeatureClients",
    descKey: "joinUsFeatureClientsDesc",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
  },
  {
    icon: BarChart3,
    titleKey: "joinUsFeatureMetrics",
    descKey: "joinUsFeatureMetricsDesc",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400",
  },
  {
    icon: Shield,
    titleKey: "joinUsFeatureMultifield",
    descKey: "joinUsFeatureMultifieldDesc",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
  },
  {
    icon: Users,
    titleKey: "joinUsFeatureStaff",
    descKey: "joinUsFeatureStaffDesc",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400",
  },
] as const;

export default function QuieroSerPartePage() {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-700" />
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-6 border border-white/20">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                CL
              </span>
              Cancha Libre
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t("joinUsHeroTitle")}
            </h1>
            <p className="text-lg sm:text-xl text-white/85 mb-10 max-w-2xl mx-auto">
              {t("joinUsHeroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-teal-700 hover:bg-white/90 rounded-xl px-8 font-semibold text-base shadow-lg"
              >
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t("joinUsCTAButton")}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 rounded-xl px-8 font-semibold text-base backdrop-blur-sm"
              >
                <Link href="/canchas">
                  {t("fields")} <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {[
                { key: "joinUsFree", icon: CheckCircle },
                { key: "joinUsSupport", icon: Users },
                { key: "joinUsQuick", icon: Calendar },
              ].map((badge) => (
                <span
                  key={badge.key}
                  className="flex items-center gap-2 text-white/80 text-sm"
                >
                  <badge.icon className="h-4 w-4 text-emerald-300" />
                  {t(badge.key)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 sm:py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("joinUsWhyTitle")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("joinUsWhyDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <Card
              key={feature.titleKey}
              className="border border-border hover:shadow-lg transition-shadow duration-300 group"
            >
              <CardContent className="p-6 space-y-4">
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50 mb-6">
            <MessageCircle className="h-8 w-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("joinUsCTATitle")}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t("joinUsCTADesc")}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#25D366] hover:bg-[#22c55e] text-white rounded-xl px-8 font-semibold text-base shadow-lg"
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              {t("joinUsCTAButton")}
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
