"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface OwnerDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    tenantId?: string;
  } | null;
}

export default function OwnerDashboard({ user }: OwnerDashboardProps) {
  // Obtener todas las canchas del owner
  const { data: fieldsData, isLoading: fieldsLoading } =
    trpc.field.getAll.useQuery(
      {
        page: 1,
        limit: 100,
      },
      {
        enabled: !!user?.id,
      }
    );

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (!fieldsData?.data) {
      return {
        totalFields: 0,
        availableFields: 0,
        unavailableFields: 0,
        totalReservations: 0,
        // Estos se calcularán cuando tengamos el router de reservations
        monthlyReservations: 0,
        monthlyRevenue: 0,
      };
    }

    const fields = fieldsData.data;
    const totalFields = fields.length;
    const availableFields = fields.filter((f) => f.available).length;
    const unavailableFields = totalFields - availableFields;
    const totalReservations = fields.reduce(
      (sum, field) => sum + (field._count?.reservations || 0),
      0
    );

    return {
      totalFields,
      availableFields,
      unavailableFields,
      totalReservations,
      monthlyReservations: 0, // TODO: Calcular cuando tengamos reservations router
      monthlyRevenue: 0, // TODO: Calcular cuando tengamos payments router
    };
  }, [fieldsData]);

  const ownerSections = [
    {
      title: "Mis Canchas",
      description: "Gestiona todas tus canchas deportivas",
      icon: <MapPin className="h-5 w-5" />,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      href: "/dashboard/owner/fields",
      count: stats.totalFields,
    },
    {
      title: "Reservas",
      description: "Visualiza y gestiona las reservas de tus canchas",
      icon: <Calendar className="h-5 w-5" />,
      iconColor: "text-accent-foreground",
      bgColor: "bg-accent/20",
      href: "/dashboard/owner/reservations",
      count: stats.totalReservations,
      badge: stats.totalReservations > 0 ? "Nuevas" : undefined,
    },
  ];

  if (fieldsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Panel de Dueño
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Cargando información...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-3 bg-muted rounded w-16 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Panel de Dueño
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Bienvenido, {user?.name || "Dueño"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Dueño de Canchas
          </span>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Canchas
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFields}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableFields} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Canchas Disponibles
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.availableFields}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.unavailableFields} no disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reservas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
            <p className="text-xs text-muted-foreground">
              En todas tus canchas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del Mes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/ {stats.monthlyRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.monthlyReservations} reservas este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secciones Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {ownerSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group relative overflow-hidden bg-card rounded-xl border border-border p-6 transition-all hover:border-primary/20 hover:shadow-md"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start space-x-4 mb-4">
                <div
                  className={`flex-shrink-0 rounded-lg p-3 ${section.bgColor}`}
                >
                  <div className={section.iconColor}>{section.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    {section.count !== undefined && (
                      <Badge variant="secondary" className="rounded-full">
                        {section.count}
                      </Badge>
                    )}
                    {section.badge && (
                      <Badge
                        variant={
                          section.badge === "Próximamente"
                            ? "outline"
                            : "default"
                        }
                        className="rounded-full"
                      >
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Canchas Recientes */}
      {fieldsData?.data && fieldsData.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mis Canchas</CardTitle>
            <CardDescription>
              Vista rápida de tus canchas deportivas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fieldsData.data.slice(0, 5).map((field) => (
                <Link
                  key={field.id}
                  href={`/dashboard/owner/fields/${field.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        field.available
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{field.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {field.sport} • {field.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={field.available ? "default" : "secondary"}>
                      {field.available ? "Disponible" : "No disponible"}
                    </Badge>
                    <div className="text-right">
                      <p className="font-semibold">
                        S/ {formatPrice(field.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {field._count?.reservations || 0} reservas
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              {fieldsData.data.length > 5 && (
                <Link
                  href="/dashboard/owner/fields"
                  className="block text-center text-sm text-primary hover:underline pt-2"
                >
                  Ver todas las canchas ({fieldsData.data.length})
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensaje si no hay canchas */}
      {fieldsData?.data && fieldsData.data.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>¡Comienza a gestionar tus canchas!</CardTitle>
            <CardDescription>
              Aún no tienes canchas registradas. Crea tu primera cancha para
              empezar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/owner/fields/new"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Crear Primera Cancha
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
