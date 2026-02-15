"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/utils/trpc";
import { ChevronRight, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const LANGUAGE_OPTIONS = [
  { value: "ES", label: "Español" },
  { value: "EN", label: "English" },
  { value: "PT", label: "Português" },
] as const;

export default function ProfilePage() {
  const utils = trpc.useUtils();
  const { data: profile, isLoading } = trpc.user.getProfile.useQuery();
  const updateUser = trpc.user.update.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
      toast.success("Perfil actualizado correctamente");
    },
    onError: (e) => toast.error(e.message || "Error al actualizar"),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState<string>("ES");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setEmail(profile.email ?? "");
      setPhone(profile.phone ?? "");
      setLanguage(profile.language ?? "ES");
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (password && password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    updateUser.mutate({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      language: language as "ES" | "EN" | "PT",
      ...(password ? { password } : {}),
    });
    setPassword("");
    setPasswordConfirm("");
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="h-4 w-64 bg-muted rounded mt-2" />
            </CardHeader>
            <CardContent className="h-64 bg-muted/30 rounded" />
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Mi perfil</span>
        </nav>

        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mi perfil</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Edita tu nombre, correo, teléfono e idioma
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Datos personales
              </CardTitle>
              <CardDescription>
                Esta información se muestra en tu cuenta y en las reservas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex justify-center sm:justify-start">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.image ?? ""} />
                    <AvatarFallback className="text-xl text-foreground">
                      {profile?.name?.charAt(0).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name" className="text-foreground">
                      Nombre
                    </Label>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email" className="text-foreground">
                      Correo electrónico
                    </Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone" className="text-foreground">
                      Teléfono (opcional)
                    </Label>
                    <Input
                      id="profile-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+51 999 999 999"
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="profile-language"
                      className="text-foreground"
                    >
                      Idioma
                    </Label>
                    <Select
                      value={language}
                      onValueChange={(v) => setLanguage(v)}
                    >
                      <SelectTrigger
                        id="profile-language"
                        className="bg-background text-foreground"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="text-foreground"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Cambiar contraseña</CardTitle>
              <CardDescription>
                Deja en blanco si no quieres cambiar tu contraseña
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-password" className="text-foreground">
                  Nueva contraseña
                </Label>
                <Input
                  id="profile-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background text-foreground"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="profile-password-confirm"
                  className="text-foreground"
                >
                  Confirmar nueva contraseña
                </Label>
                <Input
                  id="profile-password-confirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background text-foreground"
                  autoComplete="new-password"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateUser.isPending}
              className="min-w-[160px]"
            >
              {updateUser.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
