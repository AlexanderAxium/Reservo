"use client";

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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateFieldSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  sport: z
    .enum(["FOOTBALL", "TENNIS", "BASKETBALL", "VOLLEYBALL", "FUTSAL"])
    .optional(),
  price: z.number().positive("El precio debe ser mayor a 0").optional(),
  available: z.boolean().optional(),
  images: z.array(z.string().url("URL de imagen inválida")).optional(),
  address: z.string().min(1, "La dirección es requerida").optional(),
  city: z.string().optional(),
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
  features: z
    .array(
      z.object({
        featureId: z.string().uuid(),
        value: z.string().optional(),
      })
    )
    .optional(),
});

type UpdateFieldFormData = z.infer<typeof updateFieldSchema>;

export default function EditOwnerFieldPage() {
  const params = useParams();
  const router = useRouter();
  const fieldId = params.id as string;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Obtener la cancha actual
  const { data: field, isLoading: isLoadingField } =
    trpc.field.getById.useQuery({ id: fieldId }, { enabled: !!fieldId });

  // Obtener features activas
  const { data: features = [] } = trpc.feature.getActive.useQuery();

  const form = useForm<UpdateFieldFormData>({
    resolver: zodResolver(updateFieldSchema),
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
      features: [],
    },
  });

  // Actualizar el formulario cuando se carga la cancha
  useEffect(() => {
    if (field) {
      const fieldFeatures =
        field.fieldFeatures?.map((ff) => ({
          featureId: ff.featureId,
          value: ff.value || undefined,
        })) || [];

      form.reset({
        name: field.name,
        sport: field.sport,
        price: Number(field.price),
        available: field.available,
        images: field.images,
        address: field.address,
        city: field.city || "Lima",
        district: field.district || "",
        latitude: field.latitude ? Number(field.latitude) : undefined,
        longitude: field.longitude ? Number(field.longitude) : undefined,
        googleMapsUrl: field.googleMapsUrl || "",
        description: field.description || "",
        phone: field.phone || "",
        email: field.email || "",
        sportCenterId: field.sportCenterId || undefined,
        features: fieldFeatures,
      });
      setImageUrls(field.images);
    }
  }, [field, form]);

  const updateField = trpc.field.update.useMutation({
    onSuccess: () => {
      toast.success("Cancha actualizada correctamente");
      router.push("/dashboard/owner/fields");
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo actualizar la cancha");
    },
  });

  const onSubmit = (data: UpdateFieldFormData) => {
    updateField.mutate({
      id: fieldId,
      ...data,
      images: imageUrls,
      email: data.email || undefined,
      googleMapsUrl: data.googleMapsUrl || undefined,
      sportCenterId: data.sportCenterId || undefined,
      features: data.features || [],
    });
  };

  const addImageUrl = () => {
    if (newImageUrl && z.string().url().safeParse(newImageUrl).success) {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl("");
      form.setValue("images", [...imageUrls, newImageUrl]);
    } else {
      toast.error("URL de imagen inválida");
    }
  };

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    form.setValue("images", newUrls);
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

  if (isLoadingField) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Cargando cancha...</p>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Cancha no encontrada</p>
          <Link href="/dashboard/owner/fields">
            <Button variant="outline">Volver a la lista</Button>
          </Link>
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
            Editar Cancha
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Modifica la información de la cancha: {field.name}
          </p>
        </div>
        <Link href="/dashboard/owner/fields">
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Cancha Principal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deporte *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un deporte" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FOOTBALL">Fútbol</SelectItem>
                          <SelectItem value="TENNIS">Tenis</SelectItem>
                          <SelectItem value="BASKETBALL">Básquet</SelectItem>
                          <SelectItem value="VOLLEYBALL">Vóley</SelectItem>
                          <SelectItem value="FUTSAL">Futsal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
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
                          value={field.value || ""}
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
                        <FormLabel className="text-base">Disponible</FormLabel>
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
                        <Input placeholder="Ej: Av. Principal 123" {...field} />
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
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number.parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value || ""}
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
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number.parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value || ""}
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
                Selecciona las características disponibles en tu cancha
              </CardDescription>
            </CardHeader>
            <CardContent>
              {features.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay características disponibles. Contacta al administrador
                  para que agregue características al sistema.
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
              <CardDescription>Detalles adicionales y contacto</CardDescription>
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
                render={() => (
                  <FormItem>
                    <FormLabel>Imágenes</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="URL de imagen"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addImageUrl();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addImageUrl}
                          >
                            Agregar
                          </Button>
                        </div>
                        {imageUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {imageUrls.map((url, index) => (
                              <div
                                key={url}
                                className="relative group border rounded p-2"
                              >
                                <img
                                  src={url}
                                  alt={`Imagen ${index + 1}`}
                                  className="h-20 w-20 object-cover rounded"
                                  onError={() => {
                                    toast.error(
                                      `La imagen ${index + 1} no se pudo cargar`
                                    );
                                    removeImageUrl(index);
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImageUrl(index)}
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Agrega URLs de imágenes de la cancha
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard/owner/fields">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={updateField.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateField.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
