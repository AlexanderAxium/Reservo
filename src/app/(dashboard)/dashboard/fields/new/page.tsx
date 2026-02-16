"use client";

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
import { useTranslation } from "@/hooks/useTranslation";
import { FeatureIcon } from "@/lib/feature-icons";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const getCreateFieldSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("fieldForm.nameRequired")),
    sport: z.enum(["FOOTBALL", "TENNIS", "BASKETBALL", "VOLLEYBALL", "FUTSAL"]),
    price: z.number().positive(t("fieldForm.pricePositive")),
    available: z.boolean().default(true),
    images: z.array(z.string().url(t("fieldForm.invalidImageUrl"))).default([]),
    address: z.string().min(1, t("fieldForm.addressRequired")),
    city: z.string().optional().default("Lima"),
    district: z.string().optional(),
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
      .optional()
      .default([]),
  });

type CreateFieldFormData = z.infer<ReturnType<typeof getCreateFieldSchema>>;

export default function NewOwnerFieldPage() {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const createFieldSchema = useMemo(() => getCreateFieldSchema(t), [t]);

  // Obtener features activas
  const { data: features = [] } = trpc.feature.getActive.useQuery();

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
      features: [],
    },
  });

  const createField = trpc.field.create.useMutation({
    onSuccess: () => {
      toast.success(t("fieldForm.fieldCreated"));
      router.push("/dashboard/fields");
    },
    onError: (error) => {
      toast.error(error.message || t("fieldForm.fieldCreateError"));
    },
  });

  const onSubmit = (data: CreateFieldFormData) => {
    createField.mutate({
      ...data,
      images: imageUrls,
      email: data.email || undefined,
      googleMapsUrl: data.googleMapsUrl || undefined,
      sportCenterId: data.sportCenterId || undefined,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("fieldForm.newTitle")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("fieldForm.newDesc")}
          </p>
        </div>
        <Link href="/dashboard/fields">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("fieldForm.back")}
          </Button>
        </Link>
      </div>

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
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fieldForm.cityLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("fieldForm.cityPlaceholder")}
                          {...field}
                        />
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
            <Button type="submit" disabled={createField.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {createField.isPending
                ? t("fieldForm.creating")
                : t("fieldForm.createField")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
