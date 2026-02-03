"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ImageUpload } from "@/components/fields/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FeatureIcon } from "@/lib/feature-icons";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createFieldSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  sport: z.enum(["FOOTBALL", "TENNIS", "BASKETBALL", "VOLLEYBALL", "FUTSAL"]),
  price: z.number().positive("El precio debe ser mayor a 0"),
  available: z.boolean().default(true),
  images: z.array(z.string().url("URL de imagen inválida")).default([]),
  address: z.string().min(1, "La dirección es requerida"),
  city: z.string().optional().default("Lima"),
  district: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  googleMapsUrl: z
    .string()
    .url("URL de Google Maps inválida")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  sportCenterId: z.string().uuid().optional(),
  ownerId: z
    .string()
    .min(1, "Debes seleccionar un dueño")
    .refine(
      (val) =>
        z.union([z.string().uuid(), z.string().cuid()]).safeParse(val).success,
      "Debes seleccionar un dueño válido"
    ),
  features: z
    .array(
      z.object({
        featureId: z.string().uuid(),
        value: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

type CreateFieldFormData = z.infer<typeof createFieldSchema>;

export default function NewFieldPage() {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [_newImageUrl, _setNewImageUrl] = useState("");

  // Obtener usuarios con rol owner para seleccionar
  const { data: usersData } = trpc.user.getAll.useQuery({
    page: 1,
    limit: 1000,
  });

  // Obtener features activas
  const { data: features = [] } = trpc.feature.getActive.useQuery();

  // Filtrar usuarios que tengan el rol "owner"
  const ownerUsers =
    usersData?.data.filter((user) => {
      return user.userRoles?.some(
        (ur) => ur.role.name.toLowerCase() === "owner" && ur.role.isActive
      );
    }) || [];

  const form = useForm<CreateFieldFormData>({
    resolver: zodResolver(createFieldSchema) as Resolver<CreateFieldFormData>,
    defaultValues: {
      name: "",
      sport: "FOOTBALL",
      price: 0,
      available: true,
      images: [],
      address: "",
      city: "Lima",
      district: "",
      latitude: undefined,
      longitude: undefined,
      googleMapsUrl: "",
      description: "",
      phone: "",
      email: "",
      sportCenterId: undefined,
      ownerId: "",
      features: [],
    },
    mode: "onChange", // Validar en tiempo real
  });

  const createField = trpc.field.create.useMutation({
    onSuccess: () => {
      toast.success("Cancha creada correctamente");
      router.push("/dashboard/admin/fields");
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo crear la cancha");
    },
  });

  const onSubmit = (data: CreateFieldFormData) => {
    // Validar que sport sea un valor válido del enum
    const validSports = [
      "FOOTBALL",
      "TENNIS",
      "BASKETBALL",
      "VOLLEYBALL",
      "FUTSAL",
    ];
    const validSport =
      data.sport && validSports.includes(data.sport) ? data.sport : "FOOTBALL";

    const submitData: CreateFieldFormData = {
      ...data,
      sport: validSport as
        | "FOOTBALL"
        | "TENNIS"
        | "BASKETBALL"
        | "VOLLEYBALL"
        | "FUTSAL",
      images: imageUrls,
      email: data.email || undefined,
      googleMapsUrl: data.googleMapsUrl || undefined,
      sportCenterId: data.sportCenterId || undefined,
      features: data.features || [],
    };

    createField.mutate(submitData);
  };

  const selectedFeatures = form.watch("features") || [];

  const toggleFeature = (featureId: string) => {
    const currentFeatures = selectedFeatures;
    const isSelected = currentFeatures.some((f) => f.featureId === featureId);

    if (isSelected) {
      form.setValue(
        "features",
        currentFeatures.filter((f) => f.featureId !== featureId)
      );
    } else {
      form.setValue("features", [
        ...currentFeatures,
        { featureId, value: undefined },
      ]);
    }
  };

  const updateFeatureValue = (featureId: string, value: string) => {
    const currentFeatures = selectedFeatures;
    form.setValue(
      "features",
      currentFeatures.map((f) =>
        f.featureId === featureId ? { ...f, value } : f
      )
    );
  };

  const _users = ownerUsers;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Nueva Cancha
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Crea una nueva cancha deportiva en el sistema
            </p>
          </div>
          <Link href="/dashboard/admin/fields">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información Básica */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>
                    Datos principales de la cancha deportiva
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ownerId"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Dueño *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              if (
                                value &&
                                value !== "" &&
                                value !== "no-owners"
                              ) {
                                field.onChange(value);
                              } else {
                                field.onChange("");
                              }
                            }}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un dueño" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ownerUsers.length === 0 ? (
                                <SelectItem value="no-owners" disabled>
                                  No hay owners disponibles
                                </SelectItem>
                              ) : (
                                ownerUsers.map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Selecciona el usuario que será el dueño de esta
                            cancha
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Cancha Principal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sport"
                    render={({ field }) => {
                      const currentValue = field.value || "FOOTBALL";
                      return (
                        <FormItem>
                          <FormLabel>Deporte *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              // Asegurar que siempre sea un valor válido
                              if (value && value !== "") {
                                field.onChange(value);
                              } else {
                                // Si está vacío, mantener el valor actual
                                field.onChange(currentValue);
                              }
                            }}
                            value={currentValue}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un deporte" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="FOOTBALL">Fútbol</SelectItem>
                              <SelectItem value="TENNIS">Tenis</SelectItem>
                              <SelectItem value="BASKETBALL">
                                Básquet
                              </SelectItem>
                              <SelectItem value="VOLLEYBALL">Vóley</SelectItem>
                              <SelectItem value="FUTSAL">Futsal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio (S/) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="available"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Disponible
                          </FormLabel>
                          <FormDescription>
                            La cancha estará disponible para reservas
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Ubicación */}
              <Card>
                <CardHeader>
                  <CardTitle>Ubicación</CardTitle>
                  <CardDescription>
                    Información de ubicación de la cancha
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Av. Principal 123"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Input placeholder="Lima" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distrito</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: San Isidro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitud</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              placeholder="-12.0464"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value && e.target.value !== ""
                                    ? Number.parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitud</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              placeholder="-77.0428"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value && e.target.value !== ""
                                    ? Number.parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="googleMapsUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de Google Maps</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://maps.google.com/..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Características */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Características
                </CardTitle>
                <CardDescription>
                  Selecciona las características disponibles en la cancha
                </CardDescription>
              </CardHeader>
              <CardContent>
                {features.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay características disponibles. Agrega características
                    en la sección de administración.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature) => {
                      const isSelected = selectedFeatures.some(
                        (f) => f.featureId === feature.id
                      );
                      const selectedFeature = selectedFeatures.find(
                        (f) => f.featureId === feature.id
                      );

                      return (
                        <div
                          key={feature.id}
                          className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <Checkbox
                            id={`feature-${feature.id}`}
                            checked={isSelected}
                            onCheckedChange={() => toggleFeature(feature.id)}
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <FeatureIcon
                                iconName={feature.icon}
                                className="h-5 w-5 text-muted-foreground"
                                size={20}
                              />
                              <label
                                htmlFor={`feature-${feature.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                onClick={() => toggleFeature(feature.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggleFeature(feature.id);
                                  }
                                }}
                              >
                                {feature.name}
                              </label>
                            </div>
                            {feature.description && (
                              <p className="text-xs text-muted-foreground">
                                {feature.description}
                              </p>
                            )}
                            {isSelected && (
                              <Input
                                placeholder="Valor opcional (ej: 2 duchas)"
                                value={selectedFeature?.value || ""}
                                onChange={(e) =>
                                  updateFeatureValue(feature.id, e.target.value)
                                }
                                className="text-xs"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información Adicional */}
            <Card>
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
                <CardDescription>
                  Detalles adicionales y contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe las características de la cancha..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+51 999 999 999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contacto@ejemplo.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imágenes</FormLabel>
                      <FormControl>
                        <ImageUpload
                          images={imageUrls}
                          onImagesChange={(newImages) => {
                            setImageUrls(newImages);
                            field.onChange(newImages);
                          }}
                          maxImages={10}
                        />
                      </FormControl>
                      <FormDescription>
                        Sube imágenes desde tu dispositivo o agrega URLs de
                        imágenes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
              <Link href="/dashboard/admin/fields">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={createField.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {createField.isPending ? "Creando..." : "Crear Cancha"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
