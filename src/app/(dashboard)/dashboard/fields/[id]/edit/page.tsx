"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PERU_DEPARTMENTS } from "@/constants/peru";
import { useTranslation } from "@/hooks/useTranslation";
import { FeatureIcon } from "@/lib/feature-icons";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SurfaceType } from "@prisma/client";
import { Save, Tag } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const getUpdateFieldSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("fieldForm.nameRequired")).optional(),
    sport: z
      .enum([
        "FOOTBALL",
        "TENNIS",
        "BASKETBALL",
        "VOLLEYBALL",
        "FUTSAL",
        "PADEL",
        "MULTI_PURPOSE",
        "OTHER",
      ])
      .optional(),
    price: z.number().positive(t("fieldForm.pricePositive")).optional(),
    available: z.boolean().optional(),
    images: z.array(z.string().url(t("fieldForm.invalidImageUrl"))).optional(),
    address: z.string().min(1, t("fieldForm.addressRequired")).optional(),
    department: z.string().optional(),
    province: z.string().optional(),
    district: z.string().optional(),
    surfaceType: z.string().optional(),
    isIndoor: z.boolean().optional(),
    hasLighting: z.boolean().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    googleMapsUrl: z
      .string()
      .url(t("fieldForm.mapsUrlInvalid"))
      .optional()
      .or(z.literal("")),
    description: z.string().optional(),
    phone: z.string().optional(),
    email: z
      .string()
      .email(t("fieldForm.emailInvalid"))
      .optional()
      .or(z.literal("")),
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

type UpdateFieldFormData = z.infer<ReturnType<typeof getUpdateFieldSchema>>;

const SURFACE_TYPES = [
  { value: "NATURAL_GRASS", label: "Césped Natural" },
  { value: "SYNTHETIC_GRASS", label: "Césped Sintético" },
  { value: "CLAY", label: "Arcilla" },
  { value: "HARD_COURT", label: "Cemento (Hard Court)" },
  { value: "CONCRETE", label: "Concreto" },
  { value: "PARQUET", label: "Parquet" },
  { value: "SAND", label: "Arena" },
  { value: "RUBBER", label: "Caucho" },
  { value: "OTHER", label: "Otro" },
];

export default function EditOwnerFieldPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const fieldId = params.id as string;
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const updateFieldSchema = useMemo(() => getUpdateFieldSchema(t), [t]);

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
      department: "Lima",
      province: "",
      district: "",
      surfaceType: "",
      isIndoor: false,
      hasLighting: true,
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
        department:
          ((field as Record<string, unknown>).department as string) || "Lima",
        province: ((field as Record<string, unknown>).province as string) || "",
        district: field.district || "",
        surfaceType:
          ((field as Record<string, unknown>).surfaceType as string) || "",
        isIndoor: !!(field as Record<string, unknown>).isIndoor,
        hasLighting: (field as Record<string, unknown>).hasLighting !== false,
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
      toast.success(t("fieldForm.fieldUpdated"));
      router.push("/dashboard/fields");
    },
    onError: (error) => {
      toast.error(error.message || t("fieldForm.fieldUpdateError"));
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
      surfaceType: (data.surfaceType || undefined) as SurfaceType | undefined,
      features: data.features || [],
    });
  };

  const handleImagesChange = (urls: string[]) => {
    setImageUrls(urls);
    form.setValue("images", urls);
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
        <p>{t("fieldForm.loadingField")}</p>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {t("fieldForm.fieldNotFound")}
          </p>
          <Link href="/dashboard/fields">
            <Button variant="outline">{t("fieldForm.backToList")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("fieldForm.editTitle")}
        description={t("fieldForm.editDesc", { name: field.name })}
        backHref="/dashboard/fields"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle>{t("fieldForm.basicInfo")}</CardTitle>
                <CardDescription>
                  {t("fieldForm.basicInfoDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fieldForm.nameLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fieldForm.namePlaceholder")}
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fieldForm.sportLabel")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("fieldForm.sportPlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FOOTBALL">
                            {t("sports.FOOTBALL")}
                          </SelectItem>
                          <SelectItem value="TENNIS">
                            {t("sports.TENNIS")}
                          </SelectItem>
                          <SelectItem value="BASKETBALL">
                            {t("sports.BASKETBALL")}
                          </SelectItem>
                          <SelectItem value="VOLLEYBALL">
                            {t("sports.VOLLEYBALL")}
                          </SelectItem>
                          <SelectItem value="FUTSAL">
                            {t("sports.FUTSAL")}
                          </SelectItem>
                          <SelectItem value="PADEL">
                            {t("sports.PADEL")}
                          </SelectItem>
                          <SelectItem value="MULTI_PURPOSE">
                            {t("sports.MULTI_PURPOSE")}
                          </SelectItem>
                          <SelectItem value="OTHER">
                            {t("sports.OTHER")}
                          </SelectItem>
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
                      <FormLabel>{t("fieldForm.priceLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder={t("fieldForm.pricePlaceholder")}
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
                  name="surfaceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de superficie</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar superficie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SURFACE_TYPES.map((st) => (
                            <SelectItem key={st.value} value={st.value}>
                              {st.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          {t("fieldForm.availableLabel")}
                        </FormLabel>
                        <FormDescription>
                          {t("fieldForm.availableDesc")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="isIndoor"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="isIndoor"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(!!checked)
                          }
                        />
                        <Label htmlFor="isIndoor">Techada (indoor)</Label>
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasLighting"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="hasLighting"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(!!checked)
                          }
                        />
                        <Label htmlFor="hasLighting">
                          Iluminación artificial
                        </Label>
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card>
              <CardHeader>
                <CardTitle>{t("fieldForm.location")}</CardTitle>
                <CardDescription>{t("fieldForm.locationDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fieldForm.addressLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fieldForm.addressPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar departamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PERU_DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provincia</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese la provincia" {...field} />
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
                      <FormLabel>{t("fieldForm.districtLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fieldForm.districtPlaceholder")}
                          {...field}
                        />
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
                        <FormLabel>{t("fieldForm.latLabel")}</FormLabel>
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
                        <FormLabel>{t("fieldForm.lngLabel")}</FormLabel>
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
                      <FormLabel>{t("fieldForm.mapsUrlLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fieldForm.mapsUrlPlaceholder")}
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
                {t("fieldForm.characteristics")}
              </CardTitle>
              <CardDescription>
                {t("fieldForm.characteristicsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {features.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("fieldForm.noFeatures")}
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
                              placeholder={t(
                                "fieldForm.featureValuePlaceholder"
                              )}
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
              <CardTitle>{t("fieldForm.additionalInfo")}</CardTitle>
              <CardDescription>
                {t("fieldForm.additionalInfoDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fieldForm.descriptionLabel")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("fieldForm.descriptionPlaceholder")}
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
                      <FormLabel>{t("fieldForm.phoneLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fieldForm.phonePlaceholder")}
                          {...field}
                        />
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
                      <FormLabel>{t("fieldForm.emailLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("fieldForm.emailPlaceholder")}
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
                    <FormLabel>{t("fieldForm.imagesLabel")}</FormLabel>
                    <FormControl>
                      <ImageUpload
                        images={imageUrls}
                        onImagesChange={handleImagesChange}
                        scope="field"
                        maxImages={10}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("fieldForm.imagesDesc")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard/fields">
              <Button type="button" variant="outline">
                {t("cancel")}
              </Button>
            </Link>
            <Button type="submit" disabled={updateField.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateField.isPending
                ? t("fieldForm.savingChanges")
                : t("fieldForm.saveChanges")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
