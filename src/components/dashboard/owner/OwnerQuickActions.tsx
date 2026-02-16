"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Calendar, List, MapPin, Plus } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Crear cancha",
    description: "Registra una nueva cancha",
    href: "/dashboard/fields/new",
    icon: Plus,
    variant: "default" as const,
  },
  {
    title: "Nueva reserva manual",
    description: "Crear reserva para un cliente",
    href: "/dashboard/reservations",
    icon: Calendar,
    variant: "outline" as const,
  },
  {
    title: "Ver todas las reservas",
    description: "Gestionar reservas",
    href: "/dashboard/reservations",
    icon: List,
    variant: "outline" as const,
  },
  {
    title: "Ver todas las canchas",
    description: "Listado de canchas",
    href: "/dashboard/fields",
    icon: MapPin,
    variant: "outline" as const,
  },
];

export function OwnerQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Acciones rápidas</CardTitle>
        <CardDescription>
          Acceso directo a las funciones más usadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.href + action.title}
                variant={action.variant}
                className="h-auto py-3 px-4 justify-start"
                asChild
              >
                <Link href={action.href}>
                  <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{action.title}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
