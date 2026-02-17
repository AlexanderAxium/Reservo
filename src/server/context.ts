import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DEFAULT_ROLES } from "@/types/rbac";
import { initTRPC } from "@trpc/server";

export interface Context {
  user?: {
    id: string;
    email: string;
    name: string;
    tenantId: string | null;
    /** The user's real tenant (never overridden by impersonation). Use for RBAC lookups. */
    originalTenantId: string | null;
    roles: string[];
    primaryRole: string;
  };
  tenant?: {
    id: string;
    name: string;
    displayName: string;
  };
  rbac?: unknown;
}

export const createContext = async (opts: {
  req: Request;
}): Promise<Context> => {
  try {
    // Get session from Better Auth using cookies
    const session = await auth.api.getSession({
      headers: opts.req.headers,
    });

    if (!session?.user) {
      return {};
    }

    // Get user with tenant information and roles
    const userWithTenant = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        userRoles: {
          where: {
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
          include: {
            role: {
              select: {
                name: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!userWithTenant) {
      return {};
    }

    // Extract active role names
    const roles = userWithTenant.userRoles
      .filter((ur) => ur.role.isActive)
      .map((ur) => ur.role.name);

    // Determine primary role (highest priority)
    const rolePriority = [
      DEFAULT_ROLES.SYS_ADMIN,
      DEFAULT_ROLES.TENANT_ADMIN,
      DEFAULT_ROLES.TENANT_STAFF,
      DEFAULT_ROLES.CLIENT,
    ];
    const primaryRole =
      rolePriority.find((role) => roles.includes(role)) || DEFAULT_ROLES.CLIENT;

    const userData = {
      id: userWithTenant.id,
      email: userWithTenant.email,
      name: userWithTenant.name,
      tenantId: userWithTenant.tenantId,
      originalTenantId: userWithTenant.tenantId,
      roles,
      primaryRole,
    };

    // SYS_ADMIN tenant impersonation via header
    const overrideTenantId = opts.req.headers.get("x-tenant-override");
    if (overrideTenantId && roles.includes(DEFAULT_ROLES.SYS_ADMIN)) {
      const overrideTenant = await prisma.tenant.findUnique({
        where: { id: overrideTenantId },
        select: { id: true, name: true, displayName: true },
      });
      if (overrideTenant) {
        return {
          user: { ...userData, tenantId: overrideTenant.id },
          tenant: overrideTenant,
        };
      }
    }

    return {
      user: userData,
      tenant: userWithTenant.tenant
        ? {
            id: userWithTenant.tenant.id,
            name: userWithTenant.tenant.name,
            displayName: userWithTenant.tenant.displayName,
          }
        : undefined,
    };
  } catch (_error) {
    return {};
  }
};

export const t = initTRPC.context<Context>().create();
