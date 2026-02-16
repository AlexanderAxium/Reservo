"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/hooks/useTRPC";
import { useUser } from "@/hooks/useUser";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MyProfilePage() {
  const { user, isLoading: userLoading } = useUser();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const updateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar perfil");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateMutation.mutate({
      id: user.id,
      name: name.trim(),
      phone: phone.trim() || undefined,
    });
  };

  if (userLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-8">No se pudo cargar el perfil</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Actualiza tu información personal
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Modifica tus datos y preferencias</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                El email no se puede modificar
              </p>
            </div>

            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="999 888 777"
              />
            </div>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
