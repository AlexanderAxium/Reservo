"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { Dumbbell, ShieldCheck, Target, Trophy } from "lucide-react";

const sponsors = [
  { name: "ProSports", icon: Target, color: "text-red-500" },
  { name: "ActiveLife", icon: Dumbbell, color: "text-purple-500" },
  { name: "SportElite", icon: ShieldCheck, color: "text-blue-500" },
  { name: "FieldMasters", icon: Target, color: "text-teal-500" },
  { name: "GameDay", icon: Trophy, color: "text-orange-500" },
  { name: "SportsFusion", icon: ShieldCheck, color: "text-pink-500" },
  { name: "ChampionGear", icon: Dumbbell, color: "text-blue-600" },
  { name: "VictoryZone", icon: Target, color: "text-orange-600" },
];

export function SponsorsSection() {
  const { t } = useTranslation("home");
  return (
    <section
      id="patrocinadores"
      className="py-16 md:py-24 bg-white dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-4">
            {t("sponsors.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t("sponsors.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {sponsors.map((s) => (
            <div
              key={s.name}
              className="w-36 h-28 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow"
            >
              <s.icon className={`h-8 w-8 ${s.color} mb-2`} />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
