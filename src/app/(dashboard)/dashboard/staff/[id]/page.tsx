"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/hooks/useTRPC";
import { useUser } from "@/hooks/useUser";
import { ArrowLeft, Calendar, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function StaffDetailPage() {
  const params = useParams();
  const staffId = params.id as string;
  const { isTenantAdmin } = useUser();

  const { data: staff, isLoading } = trpc.user.getById.useQuery({
    id: staffId,
  });

  if (!isTenantAdmin) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta sección
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Cargando...</div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Personal no encontrado</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/staff">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Detalle del Personal
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Información del miembro del equipo
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nombre
              </p>
              <p className="text-base">{staff.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{staff.email}</p>
              </div>
            </div>
            {staff.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                  <p className="text-base">{staff.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Miembro desde
                </p>
                <p className="text-base">
                  {new Date(staff.createdAt).toLocaleDateString("es-PE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles y Permisos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {staff.roles
              ?.filter((r) => r.isActive)
              .map((role) => (
                <Badge key={role.name} variant="secondary">
                  {role.name}
                </Badge>
              )) || (
              <p className="text-muted-foreground">Sin roles asignados</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
