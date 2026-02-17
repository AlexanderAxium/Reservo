"use client";

import GoogleIcon from "@/components/icons/GoogleIcon";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import { authClient } from "@/lib/auth-client";
import { EMAIL_REGEX } from "@/utils/validate";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const { t } = useTranslation("common");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors: _errors },
  } = form;

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    clearErrors();

    if (!EMAIL_REGEX.test(data.email)) {
      setError("email", {
        type: "manual",
        message: t("validEmail"),
      });
      toast.error(t("validEmail"));
      setLoading(false);
      return;
    }

    if (!data.password) {
      setError("password", {
        type: "manual",
        message: t("enterPassword"),
      });
      toast.error(t("enterPassword"));
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/auth/redirect",
        rememberMe: true,
      });

      if (error) {
        toast.error(t("errorSignIn") || "Error al iniciar sesión", {
          description: error.message,
        });
      } else {
        toast.success(t("welcome") || "Bienvenido", {
          description: t("sessionStarted") || "Sesión iniciada correctamente",
        });
        router.push("/auth/redirect");
      }
    } catch (_error) {
      toast.error(t("networkError") || "Error de red o servidor");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/redirect",
        errorCallbackURL: "/signin",
        newUserCallbackURL: "/auth/redirect",
      });
    } catch (_error) {
      toast.error(t("googleRedirectError") || "No se pudo redirigir a Google");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920)",
      }}
    >
      <div className="absolute inset-0 bg-black/50 dark:bg-black/65" />
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-white hover:text-emerald-300 mb-8 transition-colors drop-shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToHome")}
          </Link>

          <div className="mx-auto h-16 w-16 bg-emerald-500 dark:bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">CL</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white drop-shadow-md">
            {t("welcomeTo")} Cancha Libre
          </h2>
          <p className="mt-2 text-sm text-white/90">
            {t("noAccount")}{" "}
            <Link
              href="/signup"
              className="font-medium text-emerald-300 hover:text-emerald-200"
            >
              {t("registerHere")}
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm py-8 px-6 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="email"
                control={control}
                rules={{ required: t("emailRequired") }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">
                      {t("email")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
                        className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{ required: t("passwordRequired") }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">
                      {t("password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("yourPassword") || "Tu contraseña"}
                          {...field}
                          className="w-full pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t("signingIn") : t("signInButton")}
              </button>
            </form>
          </Form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {t("continueWith")}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <GoogleIcon className="w-5 h-5 mr-2" />
                {loading ? t("redirecting") : "Google"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
