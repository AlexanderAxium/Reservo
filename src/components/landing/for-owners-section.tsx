"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const benefits = [
  "Aumenta tus ingresos",
  "Estadísticas detalladas",
  "Gestión automatizada",
  "Soporte personalizado",
];

export function ForOwnersSection() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    facilityName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: enviar a API o email
    await new Promise((r) => setTimeout(r, 800));
    setFormData({
      name: "",
      lastName: "",
      email: "",
      phone: "",
      facilityName: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <section
      id="para-duenos"
      className="py-16 md:py-24 bg-gray-900 dark:bg-gray-950 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1920)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Izquierda: contenido */}
          <div className="space-y-6 text-white">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500 text-white text-sm font-medium">
              Para Dueños de Canchas
            </span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Únete a la{" "}
              <span className="text-emerald-400">Red de Canchas</span>{" "}
              Deportivas <span className="text-emerald-400">Más Grande</span>
            </h2>
            <p className="text-lg text-white/90">
              Aumenta la visibilidad de tus instalaciones, optimiza tu ocupación
              y gestiona tus reservas de forma sencilla.
            </p>
            <ul className="space-y-3">
              {benefits.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Derecha: formulario */}
          <div className="rounded-2xl bg-gray-800/90 backdrop-blur border border-white/10 p-6 lg:p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-400" />
              Registra tus Instalaciones
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/90">Nombre</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Tu nombre"
                    className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white/90">Apellido</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Tu apellido"
                    className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-white/90">Correo Electrónico</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="correo@ejemplo.com"
                  className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>
              <div>
                <Label className="text-white/90">Teléfono</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+51 123 456 789"
                  className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label className="text-white/90">
                  Nombre de la Instalación
                </Label>
                <Input
                  value={formData.facilityName}
                  onChange={(e) =>
                    setFormData({ ...formData, facilityName: e.target.value })
                  }
                  placeholder="Nombre de tu centro deportivo"
                  className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label className="text-white/90">Mensaje (opcional)</Label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Cuéntanos sobre tus instalaciones deportivas"
                  rows={3}
                  className="mt-1 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
              </Button>
              <p className="text-xs text-white/60 text-center">
                Al enviar este formulario, aceptas nuestros{" "}
                <Link
                  href="/legal/terms"
                  className="text-emerald-400 hover:underline"
                >
                  Términos y Condiciones
                </Link>{" "}
                y{" "}
                <Link
                  href="/legal/privacy"
                  className="text-emerald-400 hover:underline"
                >
                  Política de Privacidad
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
