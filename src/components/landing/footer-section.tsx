"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const socialIcons = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function FooterSection() {
  const { t } = useTranslation("home");
  const [email, setEmail] = useState("");

  const platformLinks = useMemo(
    () => [
      { label: t("footer.links.home"), href: "/" },
      { label: t("footer.links.exploreCourts"), href: "/canchas" },
      { label: t("footer.links.sportCenters"), href: "/canchas" },
      { label: t("footer.links.sports"), href: "/canchas" },
      { label: t("footer.links.howItWorks"), href: "/#como-funciona" },
    ],
    [t]
  );

  const serviceLinks = useMemo(
    () => [
      { label: t("footer.links.bookCourts"), href: "/canchas" },
      { label: t("footer.links.forOwners"), href: "/#para-duenos" },
      { label: t("footer.links.tournaments"), href: "/canchas" },
      { label: t("footer.links.community"), href: "/canchas" },
      { label: t("footer.links.mobileApp"), href: "/canchas" },
    ],
    [t]
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-gray-100 dark:bg-[#0D1117] border-t border-gray-200 dark:border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Columna 1: Logo y redes */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
                CL
              </span>
              <span className="font-semibold text-gray-900 dark:text-emerald-400">
                CanchaLibre
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-2">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: PLATAFORMA (con punto verde) */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-sm tracking-wide mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              {t("footer.platform")}
            </h3>
            <ul className="space-y-2">
              {platformLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: SERVICIOS (con punto verde) */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-sm tracking-wide mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              {t("footer.services")}
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: MANTENTE INFORMADO y CONTÁCTANOS */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-sm tracking-wide mb-2">
                {t("footer.stayInformed")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {t("footer.subscribeDesc")}
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-md shrink-0 text-white"
                >
                  {t("footer.subscribe")}
                </Button>
              </form>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-sm tracking-wide mb-2">
                {t("footer.contactUs")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                  Av. Principal 123, Lima, Perú
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                  +51 123 456 789
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                  info@canchalibre.com
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("footer.copyright")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
            <Link
              href="/legal/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {t("footer.termsOfService")}
            </Link>
            <Link
              href="/legal/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {t("footer.privacyPolicy")}
            </Link>
            <Link
              href="/legal/cookies"
              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {t("footer.cookiePolicy")}
            </Link>
            <Link
              href="/legal/complaints"
              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {t("footer.accessibility")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
