"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { Building2, Check } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function ForOwnersSection() {
  const { t } = useTranslation("home");
  const benefits = useMemo(
    () => [
      t("forOwners.benefit1"),
      t("forOwners.benefit2"),
      t("forOwners.benefit3"),
      t("forOwners.benefit4"),
    ],
    [t]
  );
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    facilityName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: enviar a API o email
    await new Promise((r) => setTimeout(r, 800));
    setFormData({
      name: "",
      lastName: "",
      email: "",
      phone: "",
      facilityName: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <section
      id="para-duenos"
      className="py-16 md:py-24 bg-gray-900 dark:bg-gray-950 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1920)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Izquierda: contenido */}
          <div className="space-y-6 text-white">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500 text-white text-sm font-medium">
              {t("forOwners.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              {t("forOwners.title")}{" "}
              <span className="text-emerald-400">
                {t("forOwners.titleHighlight1")}
              </span>{" "}
              <span className="text-emerald-400">
                {t("forOwners.titleHighlight2")}
              </span>{" "}
              <span className="text-emerald-400">
                {t("forOwners.titleHighlight3")}
              </span>
            </h2>
            <p className="text-lg text-white/90">{t("forOwners.subtitle")}</p>
            <ul className="space-y-3">
              {benefits.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Derecha: formulario */}
          <div className="rounded-2xl bg-gray-800/90 backdrop-blur border border-white/10 p-6 lg:p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-400" />
              {t("forOwners.formTitle")}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/90">
                    {t("forOwners.firstName")}
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={t("forOwners.firstNamePlaceholder")}
                    className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white/90">
                    {t("forOwners.lastName")}
                  </Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder={t("forOwners.lastNamePlaceholder")}
                    className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-white/90">{t("forOwners.email")}</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder={t("forOwners.emailPlaceholder")}
                  className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>
              <div>
                <Label className="text-white/90">{t("forOwners.phone")}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder={t("forOwners.phonePlaceholder")}
                  className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label className="text-white/90">
                  {t("forOwners.facilityName")}
                </Label>
                <Input
                  value={formData.facilityName}
                  onChange={(e) =>
                    setFormData({ ...formData, facilityName: e.target.value })
                  }
                  placeholder={t("forOwners.facilityPlaceholder")}
                  className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label className="text-white/90">
                  {t("forOwners.message")}
                </Label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder={t("forOwners.messagePlaceholder")}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
              >
                {isSubmitting ? t("forOwners.sending") : t("forOwners.submit")}
              </Button>
              <p className="text-xs text-white/60 text-center">
                {t("forOwners.termsNote")}{" "}
                <Link
                  href="/legal/terms"
                  className="text-emerald-400 hover:underline"
                >
                  {t("forOwners.terms")}
                </Link>{" "}
                {t("forOwners.and")}{" "}
                <Link
                  href="/legal/privacy"
                  className="text-emerald-400 hover:underline"
                >
                  {t("forOwners.privacy")}
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
