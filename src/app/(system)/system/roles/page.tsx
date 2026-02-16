"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";
import { Shield } from "lucide-react";

export default function RolesAndPermissions() {
  const { data: roles, isLoading } = trpc.rbac.getAllRoles.useQuery();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        <p className="text-muted-foreground">
          Configure system-wide roles and permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles?.data?.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {role.name}
                </CardTitle>
                <Badge variant={role.isActive ? "default" : "secondary"}>
                  {role.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {role.description || "No description"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {role.rolePermissions?.length ?? 0} permissions
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
