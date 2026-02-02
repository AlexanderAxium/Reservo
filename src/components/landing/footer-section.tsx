"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useState } from "react";

const platformLinks = [
  { label: "Inicio", href: "/" },
  { label: "Explorar canchas", href: "/canchas" },
  { label: "Centros deportivos", href: "/canchas" },
  { label: "Deportes", href: "/canchas" },
  { label: "Cómo funciona", href: "/#como-funciona" },
];

const serviceLinks = [
  { label: "Reserva canchas", href: "/canchas" },
  { label: "Para propietarios", href: "/#para-duenos" },
  { label: "Torneos", href: "/canchas" },
  { label: "Comunidad", href: "/canchas" },
  { label: "Aplicación móvil", href: "/canchas" },
];

const socialIcons = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function FooterSection() {
  const [email, setEmail] = useState("");

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
              La plataforma líder en reservas de canchas deportivas. Conectando
              atletas con las mejores instalaciones desde 2023.
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
              Plataforma
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
              Servicios
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
                Mantente Informado
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Suscríbete para recibir las últimas noticias y promociones
                exclusivas.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-md shrink-0 text-white"
                >
                  Suscríbete
                </Button>
              </form>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-sm tracking-wide mb-2">
                Contáctanos
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
            © 2026 CanchaLibre. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
            <Link
              href="/legal/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Términos de Servicio
            </Link>
            <Link
              href="/legal/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              href="/legal/cookies"
              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Política de Cookies
            </Link>
            <Link
              href="/legal/complaints"
              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Accesibilidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
