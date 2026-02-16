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
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function InviteStaffPage() {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const { hasPermission } = useRBAC();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const inviteStaff = trpc.user.inviteStaff.useMutation({
    onSuccess: () => {
      toast.success(t("staffNew.inviteSent"));
      router.push("/dashboard/staff");
    },
    onError: (error) => {
      toast.error(error.message || t("staffNew.inviteError"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error(t("staffNew.fillAllFields"));
      return;
    }
    inviteStaff.mutate({ name: name.trim(), email: email.trim() });
  };

  if (!hasPermission(PermissionAction.CREATE, PermissionResource.STAFF)) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noPermissionSection")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/staff">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("staffNew.back")}
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {t("staffNew.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("staffNew.description")}
          </p>
        </div>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{t("staffNew.cardTitle")}</CardTitle>
          <CardDescription>{t("staffNew.cardDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t("staffNew.nameLabel")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("staffNew.namePlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">{t("staffNew.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("staffNew.emailPlaceholder")}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={inviteStaff.isPending}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {inviteStaff.isPending
                ? t("staffNew.sending")
                : t("staffNew.sendInvite")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
