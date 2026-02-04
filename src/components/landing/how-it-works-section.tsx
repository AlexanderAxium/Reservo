"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Calendar, Check, Search } from "lucide-react";

export function HowItWorksSection() {
  const { t } = useTranslation("home");
  const steps = [
    {
      icon: Search,
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Desc"),
    },
    {
      icon: Calendar,
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
    },
    {
      icon: Check,
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
    },
  ];

  return (
    <section
      id="como-funciona"
      className="py-16 md:py-24 bg-white dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("howItWorks.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-7 w-7 text-emerald-700 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
