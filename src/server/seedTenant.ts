import { prisma } from "@/lib/db";
import type { PermissionAction, PermissionResource } from "@prisma/client";

const PERMISSIONS: {
  action: PermissionAction;
  resource: PermissionResource;
}[] = [
  { action: "READ", resource: "DASHBOARD" },
  { action: "CREATE", resource: "USER" },
  { action: "READ", resource: "USER" },
  { action: "UPDATE", resource: "USER" },
  { action: "DELETE", resource: "USER" },
  { action: "MANAGE", resource: "USER" },
  { action: "CREATE", resource: "ROLE" },
  { action: "READ", resource: "ROLE" },
  { action: "UPDATE", resource: "ROLE" },
  { action: "DELETE", resource: "ROLE" },
  { action: "MANAGE", resource: "ROLE" },
  { action: "CREATE", resource: "PERMISSION" },
  { action: "READ", resource: "PERMISSION" },
  { action: "UPDATE", resource: "PERMISSION" },
  { action: "DELETE", resource: "PERMISSION" },
  { action: "MANAGE", resource: "PERMISSION" },
  { action: "READ", resource: "ADMIN" },
  { action: "UPDATE", resource: "ADMIN" },
  { action: "MANAGE", resource: "ADMIN" },
  { action: "CREATE", resource: "SPORT_CENTER" },
  { action: "READ", resource: "SPORT_CENTER" },
  { action: "UPDATE", resource: "SPORT_CENTER" },
  { action: "DELETE", resource: "SPORT_CENTER" },
  { action: "MANAGE", resource: "SPORT_CENTER" },
  { action: "CREATE", resource: "FIELD" },
  { action: "READ", resource: "FIELD" },
  { action: "UPDATE", resource: "FIELD" },
  { action: "DELETE", resource: "FIELD" },
  { action: "MANAGE", resource: "FIELD" },
  { action: "CREATE", resource: "RESERVATION" },
  { action: "READ", resource: "RESERVATION" },
  { action: "UPDATE", resource: "RESERVATION" },
  { action: "DELETE", resource: "RESERVATION" },
  { action: "MANAGE", resource: "RESERVATION" },
  { action: "CREATE", resource: "REVIEW" },
  { action: "READ", resource: "REVIEW" },
  { action: "UPDATE", resource: "REVIEW" },
  { action: "DELETE", resource: "REVIEW" },
  { action: "CREATE", resource: "STAFF" },
  { action: "READ", resource: "STAFF" },
  { action: "UPDATE", resource: "STAFF" },
  { action: "DELETE", resource: "STAFF" },
  { action: "MANAGE", resource: "STAFF" },
  { action: "READ", resource: "METRICS" },
  { action: "MANAGE", resource: "METRICS" },
  { action: "READ", resource: "SETTINGS" },
  { action: "UPDATE", resource: "SETTINGS" },
  { action: "MANAGE", resource: "SETTINGS" },
  { action: "CREATE", resource: "PAYMENT" },
  { action: "READ", resource: "PAYMENT" },
  { action: "UPDATE", resource: "PAYMENT" },
  { action: "DELETE", resource: "PAYMENT" },
  { action: "MANAGE", resource: "PAYMENT" },
  { action: "READ", resource: "TENANT" },
  { action: "UPDATE", resource: "TENANT" },
  { action: "MANAGE", resource: "TENANT" },
];

const ROLES = [
  {
    name: "super_admin",
    displayName: "Super Admin",
    description: "Acceso total al sistema",
  },
  {
    name: "admin",
    displayName: "Admin",
    description: "Acceso administrativo a usuarios y configuración",
  },
  {
    name: "moderator",
    displayName: "Moderator",
    description: "Gestión de usuarios y monitoreo básico",
  },
  {
    name: "user",
    displayName: "User",
    description: "Usuario estándar con acceso básico",
  },
  {
    name: "owner",
    displayName: "Owner",
    description: "Dueño de canchas con gestión de campos y reservas",
  },
  {
    name: "viewer",
    displayName: "Viewer",
    description: "Solo lectura",
  },
] as const;

/**
 * Crea permisos, roles y role_permissions por defecto para un tenant (nueva empresa).
 * Debe llamarse después de crear el Tenant.
 */
export async function seedTenantRolesAndPermissions(
  tenantId: string
): Promise<void> {
  const permissions = await Promise.all(
    PERMISSIONS.map((p) =>
      prisma.permission.create({
        data: {
          tenantId,
          action: p.action as PermissionAction,
          resource: p.resource as PermissionResource,
          description: `${p.action} permission for ${p.resource}`,
        },
      })
    )
  );

  const roles = await Promise.all(
    ROLES.map((r) =>
      prisma.role.create({
        data: {
          tenantId,
          name: r.name,
          displayName: r.displayName,
          description: r.description,
          isSystem: true,
        },
      })
    )
  );

  const superAdminRole = roles[0];
  const adminRole = roles[1];
  const moderatorRole = roles[2];
  const userRole = roles[3];
  const ownerRole = roles[4];
  const viewerRole = roles[5];

  if (
    !superAdminRole ||
    !adminRole ||
    !moderatorRole ||
    !userRole ||
    !ownerRole ||
    !viewerRole
  ) {
    throw new Error("Missing required roles");
  }

  for (const perm of permissions) {
    await prisma.rolePermission.create({
      data: { roleId: superAdminRole.id, permissionId: perm.id },
    });
  }

  const adminPerms = permissions.filter(
    (p) => !(p.resource === "ROLE" && p.action === "MANAGE")
  );
  for (const perm of adminPerms) {
    await prisma.rolePermission.create({
      data: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  const moderatorPerms = permissions.filter(
    (p) =>
      (p.resource === "USER" &&
        (p.action === "READ" || p.action === "UPDATE")) ||
      p.resource === "DASHBOARD"
  );
  for (const perm of moderatorPerms) {
    await prisma.rolePermission.create({
      data: { roleId: moderatorRole.id, permissionId: perm.id },
    });
  }

  const userPerms = permissions.filter(
    (p) => p.resource === "DASHBOARD" && p.action === "READ"
  );
  for (const perm of userPerms) {
    await prisma.rolePermission.create({
      data: { roleId: userRole.id, permissionId: perm.id },
    });
  }

  const ownerPerms = permissions.filter(
    (p) =>
      (p.resource === "FIELD" &&
        ["CREATE", "READ", "UPDATE", "DELETE", "MANAGE"].includes(p.action)) ||
      (p.resource === "RESERVATION" &&
        ["READ", "UPDATE", "MANAGE"].includes(p.action)) ||
      (p.resource === "DASHBOARD" && p.action === "READ") ||
      (p.resource === "STAFF" && ["READ", "CREATE"].includes(p.action)) ||
      (p.resource === "METRICS" && p.action === "READ") ||
      (p.resource === "SETTINGS" && p.action === "READ") ||
      (p.resource === "PAYMENT" && ["READ", "UPDATE"].includes(p.action))
  );
  for (const perm of ownerPerms) {
    await prisma.rolePermission.create({
      data: { roleId: ownerRole.id, permissionId: perm.id },
    });
  }

  const viewerPerms = permissions.filter(
    (p) => p.resource === "DASHBOARD" && p.action === "READ"
  );
  for (const perm of viewerPerms) {
    await prisma.rolePermission.create({
      data: { roleId: viewerRole.id, permissionId: perm.id },
    });
  }
}
