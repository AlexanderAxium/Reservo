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
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/lib/utils";
import type { ReservationStatus, Sport } from "@prisma/client";
import { ArrowLeft, Calendar, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const STATUS_MAP: Record<ReservationStatus, string> = {
  PENDING: "statuses.pending",
  CONFIRMED: "statuses.confirmed",
  CANCELLED: "statuses.cancelled",
  COMPLETED: "statuses.completed",
  NO_SHOW: "statuses.noShow",
};

type Reservation = {
  id: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  amount: string;
  field: {
    name: string;
    sport: Sport;
  };
};

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { t } = useTranslation("dashboard");

  const { data: client, isLoading: clientLoading } = trpc.user.getById.useQuery(
    {
      id: clientId,
    }
  );

  const { data: reservationsResponse, isLoading: reservationsLoading } =
    trpc.reservation.listByUser.useQuery(
      { userId: clientId, page: 1, limit: 100 },
      { enabled: !!clientId }
    );
  const reservations = reservationsResponse?.data ?? [];

  const columns: TableColumn<Reservation>[] = [
    {
      key: "field",
      title: t("clientDetail.fieldCol"),
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
      title: t("clientDetail.dateCol"),
      width: "130px",
      render: (value) =>
        new Date(value as string).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "schedule",
      title: t("clientDetail.scheduleCol"),
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
      title: t("clientDetail.amountCol"),
      width: "100px",
      render: (value) => `S/ ${formatPrice(Number(value))}`,
    },
    {
      key: "status",
      title: t("clientDetail.statusCol"),
      width: "120px",
      render: (value) => (
        <Badge variant="outline">
          {t(STATUS_MAP[value as ReservationStatus] ?? String(value))}
        </Badge>
      ),
    },
  ];

  if (clientLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          {t("clientDetail.loadingClient")}
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-8">{t("clientDetail.notFound")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("clientDetail.back")}
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {t("clientDetail.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("clientDetail.description")}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("clientDetail.personalInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("clientDetail.nameLabel")}
              </p>
              <p className="text-base">{client.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("clientDetail.emailLabel")}
                </p>
                <p className="text-base">{client.email}</p>
              </div>
            </div>
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("clientDetail.phoneLabel")}
                  </p>
                  <p className="text-base">{client.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("clientDetail.memberSince")}
                </p>
                <p className="text-base">
                  {new Date(client.createdAt as string).toLocaleDateString(
                    "es-PE",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("clientDetail.reservationsTitle")}</CardTitle>
          <CardDescription>
            {t("clientDetail.reservationsCount", {
              count: String(reservations.length),
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservationsLoading ? (
            <div className="text-center py-8">
              {t("clientDetail.loadingReservations")}
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("clientDetail.noReservations")}
            </div>
          ) : (
            <ScrollableTable
              data={reservations}
              columns={columns}
              loading={false}
              emptyMessage={t("clientDetail.noReservationsTable")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
