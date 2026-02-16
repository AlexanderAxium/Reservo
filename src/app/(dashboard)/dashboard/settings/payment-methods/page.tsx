"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/hooks/useTranslation";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "reservo_payment_methods";

interface PaymentMethodLocal {
  id: string;
  name: string;
  provider: string;
  requiresProof: boolean;
  isActive: boolean;
}

const defaultMethods: PaymentMethodLocal[] = [
  {
    id: "default-cash",
    name: "Efectivo",
    provider: "cash",
    requiresProof: false,
    isActive: true,
  },
  {
    id: "default-yape",
    name: "Yape",
    provider: "yape",
    requiresProof: true,
    isActive: true,
  },
  {
    id: "default-transfer",
    name: "Transferencia bancaria",
    provider: "bank_transfer",
    requiresProof: true,
    isActive: false,
  },
];

function loadMethods(): PaymentMethodLocal[] {
  if (typeof window === "undefined") return defaultMethods;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PaymentMethodLocal[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignorar errores de parse
  }
  return defaultMethods;
}

export default function SettingsPaymentMethodsPage() {
  const { t } = useTranslation("dashboard");
  const [methods, setMethods] = useState<PaymentMethodLocal[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newProvider, setNewProvider] = useState("");
  const [newRequiresProof, setNewRequiresProof] = useState(false);

  useEffect(() => {
    setMethods(loadMethods());
  }, []);

  const persist = useCallback((updated: PaymentMethodLocal[]) => {
    setMethods(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const handleAdd = () => {
    if (!newName.trim() || !newProvider.trim()) return;
    const method: PaymentMethodLocal = {
      id: `local-${Date.now()}`,
      name: newName.trim(),
      provider: newProvider.trim().toLowerCase(),
      requiresProof: newRequiresProof,
      isActive: true,
    };
    persist([...methods, method]);
    toast.success(t("settingsPaymentMethods.saved"));
    setNewName("");
    setNewProvider("");
    setNewRequiresProof(false);
    setAdding(false);
  };

  const handleToggle = (id: string, field: "isActive" | "requiresProof") => {
    persist(
      methods.map((m) => (m.id === id ? { ...m, [field]: !m[field] } : m))
    );
  };

  const handleDelete = (id: string) => {
    persist(methods.filter((m) => m.id !== id));
    toast.success(t("settingsPaymentMethods.deleted"));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {t("settingsPaymentMethods.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("settingsPaymentMethods.description")}
          </p>
        </div>
        <Button size="sm" onClick={() => setAdding(true)} disabled={adding}>
          <Plus className="h-4 w-4 mr-1" />
          {t("settingsPaymentMethods.addMethod")}
        </Button>
      </div>

      {adding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("settingsPaymentMethods.addMethod")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("settingsPaymentMethods.methodName")}</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t(
                    "settingsPaymentMethods.methodNamePlaceholder"
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("settingsPaymentMethods.provider")}</Label>
                <Input
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  placeholder={t("settingsPaymentMethods.providerPlaceholder")}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={newRequiresProof}
                onCheckedChange={setNewRequiresProof}
              />
              <Label>{t("settingsPaymentMethods.requiresProof")}</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAdding(false);
                  setNewName("");
                  setNewProvider("");
                  setNewRequiresProof(false);
                }}
              >
                {t("settingsPaymentMethods.cancel")}
              </Button>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={!newName.trim() || !newProvider.trim()}
              >
                {t("settingsPaymentMethods.save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {methods.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground text-center py-8">
            {t("settingsPaymentMethods.noMethods")}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <Card key={method.id}>
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{method.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {method.provider}
                      {method.requiresProof && " · Comprobante requerido"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">
                      {t("settingsPaymentMethods.active")}
                    </Label>
                    <Switch
                      checked={method.isActive}
                      onCheckedChange={() =>
                        handleToggle(method.id, "isActive")
                      }
                    />
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("settingsPaymentMethods.deleteConfirm")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("settingsPaymentMethods.deleteDescription")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t("settingsPaymentMethods.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(method.id)}
                        >
                          {t("settingsPaymentMethods.delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
