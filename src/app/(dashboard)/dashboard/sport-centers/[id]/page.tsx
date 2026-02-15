"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";
import { Building2, Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function SportCenterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: sportCenter, isLoading } = trpc.sportCenter.getById.useQuery({
    id,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </Card>
      </div>
    );
  }

  if (!sportCenter) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Centro deportivo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{sportCenter.name}</h1>
          <p className="text-muted-foreground">Detalles del centro deportivo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
          <Link href={`/dashboard/sport-centers/${id}/edit`}>
            <Button>Editar</Button>
          </Link>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nombre
              </p>
              <p className="text-base">{sportCenter.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Dirección
              </p>
              <p className="text-base">{sportCenter.address}</p>
              <p className="text-sm text-muted-foreground">
                {sportCenter.district && `${sportCenter.district}, `}
                {sportCenter.city}
              </p>
            </div>
          </div>

          {sportCenter.phone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </p>
                <p className="text-base">{sportCenter.phone}</p>
              </div>
            </div>
          )}

          {sportCenter.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{sportCenter.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Propietario
              </p>
              <p className="text-base">{sportCenter.owner.name}</p>
              <p className="text-sm text-muted-foreground">
                {sportCenter.owner.email}
              </p>
            </div>
          </div>

          {sportCenter.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Descripción
              </p>
              <p className="text-base">{sportCenter.description}</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Canchas</h3>
        {sportCenter.fields.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No hay canchas registradas para este centro deportivo.
          </p>
        ) : (
          <div className="space-y-3">
            {sportCenter.fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{field.name}</p>
                  <p className="text-sm text-muted-foreground">{field.sport}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">S/ {Number(field.price)}</p>
                  <p className="text-sm text-muted-foreground">
                    {field.available ? "Disponible" : "No disponible"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
