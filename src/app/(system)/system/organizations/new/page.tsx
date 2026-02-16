"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/hooks/useTRPC";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const TenantPlan = {
  FREE: "FREE",
  BASIC: "BASIC",
  PROFESSIONAL: "PROFESSIONAL",
  ENTERPRISE: "ENTERPRISE",
} as const;
type TenantPlan = (typeof TenantPlan)[keyof typeof TenantPlan];

type NewOrgFormData = {
  name: string;
  displayName: string;
  slug: string;
  email: string;
  plan: TenantPlan;
  maxFields: number;
  maxUsers: number;
  adminEmail: string;
  adminName: string;
  adminPassword: string;
};

const initialFormData: NewOrgFormData = {
  name: "",
  displayName: "",
  slug: "",
  email: "",
  plan: TenantPlan.FREE,
  maxFields: 10,
  maxUsers: 5,
  adminEmail: "",
  adminName: "",
  adminPassword: "",
};

export default function NewOrganization() {
  const router = useRouter();
  const [formData, setFormData] = useState<NewOrgFormData>(initialFormData);

  const createMutation = trpc.tenant.create.useMutation({
    onSuccess: () => {
      toast.success("Organization created successfully");
      router.push("/system/organizations");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create organization");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      displayName: value,
      slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/system/organizations">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Organization</h1>
          <p className="text-muted-foreground">
            Create a new tenant organization.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Used in URLs and must be unique
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Organization Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Plan *</Label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      plan: value as TenantPlan,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TenantPlan.FREE}>Free</SelectItem>
                    <SelectItem value={TenantPlan.BASIC}>Basic</SelectItem>
                    <SelectItem value={TenantPlan.PROFESSIONAL}>Pro</SelectItem>
                    <SelectItem value={TenantPlan.ENTERPRISE}>
                      Enterprise
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFields">Max Fields</Label>
                <Input
                  id="maxFields"
                  type="number"
                  value={formData.maxFields}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxFields: Number.parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUsers">Max Users</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={formData.maxUsers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxUsers: Number.parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-4">Initial Admin User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Admin Name *</Label>
                  <Input
                    id="adminName"
                    value={formData.adminName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        adminName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        adminEmail: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Admin Password *</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.adminPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        adminPassword: e.target.value,
                      }))
                    }
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Link href="/system/organizations">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending
                  ? "Creating..."
                  : "Create Organization"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
