"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ScrollableTable,
  type TableColumn,
} from "@/components/ui/scrollable-table";
import { trpc } from "@/hooks/useTRPC";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Calendar, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

type Reservation = {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
  amount: number;
  field: {
    name: string;
    sport: string;
  };
  createdAt: Date;
};

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  const { data: client, isLoading: clientLoading } = trpc.user.getById.useQuery(
    {
      id: clientId,
    }
  );

  const { data: reservations = [], isLoading: reservationsLoading } =
    trpc.reservation.listByUser.useQuery(
      { userId: clientId, page: 1, limit: 100 },
      { enabled: !!clientId }
    );

  const columns: TableColumn<Reservation>[] = [
    {
      key: "field",
      title: "Cancha",
      width: "180px",
      render: (_, record) => (
        <div>
          <p className="font-medium text-sm">{record.field.name}</p>
          <p className="text-xs text-muted-foreground">{record.field.sport}</p>
        </div>
      ),
    },
    {
      key: "startDate",
      title: "Fecha",
      width: "130px",
      render: (value) =>
        new Date(value as Date).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "startDate",
      title: "Horario",
      width: "110px",
      render: (_, record) =>
        `${new Date(record.startDate).toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${new Date(record.endDate).toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
    },
    {
      key: "amount",
      title: "Monto",
      width: "100px",
      render: (value) => `S/ ${formatPrice(Number(value))}`,
    },
    {
      key: "status",
      title: "Estado",
      width: "120px",
      render: (value) => (
        <Badge variant="outline">
          {STATUS_LABELS[value as string] || value}
        </Badge>
      ),
    },
  ];

  if (clientLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Cargando...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Cliente no encontrado</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Perfil del Cliente
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Información y historial de reservas
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
              <p className="text-base">{client.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{client.email}</p>
              </div>
            </div>
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                  <p className="text-base">{client.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cliente desde
                </p>
                <p className="text-base">
                  {new Date(client.createdAt).toLocaleDateString("es-PE", {
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
          <CardTitle>Historial de Reservas</CardTitle>
          <CardDescription>
            {reservations.length} reserva(s) en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservationsLoading ? (
            <div className="text-center py-8">Cargando reservas...</div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Este cliente no tiene reservas aún
            </div>
          ) : (
            <ScrollableTable
              data={reservations}
              columns={columns}
              loading={false}
              emptyMessage="No hay reservas"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
