import {
  NotificationType,
  PaymentStatus,
  PermissionAction,
  PermissionResource,
  PrismaClient,
  ReservationStatus,
  Sport,
  SportCenterStatus,
  type SurfaceType,
  WeekDay,
} from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { hashPassword } from "better-auth/crypto";
import { generateUniqueSlug } from "../src/lib/utils/slug";

const prisma = new PrismaClient();

// Create a better-auth instance for seed that doesn't send emails
const _seedAuth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable email verification for seed
  },
  emailVerification: {
    sendOnSignUp: false, // Don't send emails during seed
    autoSignInAfterVerification: true,
  },
  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  logger: {
    level: "error", // Reduce logging during seed
  },
});

async function main() {
  console.log("🌱 Starting reduced seed process...");

  // Test database connection
  console.log("🔌 Testing database connection...");
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }

  // Test better-auth instance
  console.log("🔐 Testing better-auth instance...");
  try {
    // This will test if the better-auth instance is properly configured
    console.log("✅ Better-auth instance created successfully");
  } catch (error) {
    console.error("❌ Better-auth instance creation failed:", error);
    throw error;
  }

  // ================================
  // 1. CLEAR ALL DATA
  // ================================
  console.log("🗑️ Clearing all existing data...");

  // P2021 = "The table does not exist" - ignorar si la migración no se ha aplicado
  const safeDeleteMany = async (
    name: string,
    fn: () => Promise<unknown>
  ): Promise<void> => {
    try {
      await fn();
    } catch (error: unknown) {
      const prismaError = error as { code?: string };
      if (prismaError?.code === "P2021") {
        console.log(`   ⏭️  Tabla "${name}" no existe, omitiendo...`);
        return;
      }
      throw error;
    }
  };

  await safeDeleteMany("payments", () => prisma.payment.deleteMany({}));
  await safeDeleteMany("reservations", () => prisma.reservation.deleteMany({}));
  await safeDeleteMany("notifications", () =>
    prisma.notification.deleteMany({})
  );
  await safeDeleteMany("field_features", () =>
    prisma.fieldFeature.deleteMany({})
  );
  await safeDeleteMany("schedules", () => prisma.schedule.deleteMany({}));
  await safeDeleteMany("operating_schedules", () =>
    prisma.operatingSchedule.deleteMany({})
  );
  await safeDeleteMany("fields", () => prisma.field.deleteMany({}));
  await safeDeleteMany("sport_centers", () =>
    prisma.sportCenter.deleteMany({})
  );
  await safeDeleteMany("user_roles", () => prisma.userRole.deleteMany({}));
  await safeDeleteMany("sessions", () => prisma.session.deleteMany({}));
  await safeDeleteMany("accounts", () => prisma.account.deleteMany({}));
  await safeDeleteMany("verifications", () =>
    prisma.verification.deleteMany({})
  );
  await safeDeleteMany("users", () => prisma.user.deleteMany({}));
  await safeDeleteMany("translations", () => prisma.translation.deleteMany({}));
  await safeDeleteMany("role_permissions", () =>
    prisma.rolePermission.deleteMany({})
  );
  await safeDeleteMany("roles", () => prisma.role.deleteMany({}));
  await safeDeleteMany("permissions", () => prisma.permission.deleteMany({}));
  await safeDeleteMany("tenants", () => prisma.tenant.deleteMany({}));

  console.log("✅ Limpieza de datos completada");

  // ================================
  // 2. CREATE TENANTS
  // ================================
  console.log("🏢 Creating tenants...");

  // Create default tenant (más info para demo)
  const defaultTenant = await prisma.tenant.create({
    data: {
      id: "tenant-default-001",
      name: "MyApp",
      displayName: "Reservo - Canchas Lima",
      slug: "my-app",
      plan: "PROFESSIONAL",
      maxFields: 50,
      maxUsers: 100,
      isVerified: true,
      verifiedAt: new Date(),
      description:
        "Plataforma líder en reserva de canchas deportivas en Lima. Fútbol, tenis, básquet, vóley y futsal. Césped sintético, horarios flexibles y pagos seguros.",
      email: "reservas@reservo.com",
      phone: "+51 1 234 5678",
      address: "Av. Javier Prado Este 1234, San Isidro",
      department: "Lima",
      province: "Lima",
      district: "San Isidro",
      country: "Peru",
      website: "https://myapp.com",
      facebookUrl: "https://facebook.com/myapp",
      twitterUrl: "https://twitter.com/myapp",
      instagramUrl: "https://instagram.com/myapp",
      linkedinUrl: "https://linkedin.com/company/myapp",
      youtubeUrl: "https://youtube.com/myapp",
      foundedYear: 2024,
      logoUrl: "/images/logo.png",
      faviconUrl: "/favicon.ico",
      metaTitle: "Reservo - Reserva de canchas deportivas en Lima",
      metaDescription:
        "Reserva canchas de fútbol, tenis, básquet y más. Precios por hora, confirmación al instante y múltiples sedes en Lima.",
      metaKeywords:
        "reserva canchas, fútbol Lima, tenis, básquet, vóley, futsal, deportes",
      termsUrl: "/terms",
      privacyUrl: "/privacy",
      cookiesUrl: "/cookies",
      complaintsUrl: "/complaints",
    },
  });

  // Create demo tenant (más info)
  const demoTenant = await prisma.tenant.create({
    data: {
      id: "tenant-demo-002",
      name: "DemoCorp",
      displayName: "Demo Corporation",
      slug: "demo-corp",
      plan: "BASIC",
      maxFields: 10,
      maxUsers: 25,
      isVerified: true,
      verifiedAt: new Date(),
      description:
        "Tenant de demostración con canchas, reservas y pagos de ejemplo para pruebas y desarrollo.",
      email: "info@democorp.com",
      phone: "+1 (555) 999-8888",
      address: "456 Demo Avenue",
      department: "California",
      country: "USA",
      website: "https://democorp.com",
      foundedYear: 2023,
      logoUrl: "/images/demo-logo.png",
      faviconUrl: "/favicon-demo.ico",
      metaTitle: "DemoCorp - Empresa de Demostración",
      metaDescription:
        "Plataforma de demostración para pruebas y desarrollo. Incluye datos de ejemplo.",
      metaKeywords: "demo, pruebas, desarrollo, corporación",
    },
  });

  console.log(
    `✅ Created tenants: ${defaultTenant.displayName} and ${demoTenant.displayName}`
  );

  // ================================
  // 3. ROLES AND PERMISSIONS
  // ================================
  console.log("👥 Creating roles and permissions...");

  // Create all permissions
  const permissions = [
    // Dashboard permissions
    { action: PermissionAction.READ, resource: PermissionResource.DASHBOARD },

    // User management permissions
    { action: PermissionAction.CREATE, resource: PermissionResource.USER },
    { action: PermissionAction.READ, resource: PermissionResource.USER },
    { action: PermissionAction.UPDATE, resource: PermissionResource.USER },
    { action: PermissionAction.DELETE, resource: PermissionResource.USER },
    { action: PermissionAction.MANAGE, resource: PermissionResource.USER },

    // Role management permissions
    { action: PermissionAction.CREATE, resource: PermissionResource.ROLE },
    { action: PermissionAction.READ, resource: PermissionResource.ROLE },
    { action: PermissionAction.UPDATE, resource: PermissionResource.ROLE },
    { action: PermissionAction.DELETE, resource: PermissionResource.ROLE },
    { action: PermissionAction.MANAGE, resource: PermissionResource.ROLE },

    // Permission management
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.PERMISSION,
    },
    { action: PermissionAction.READ, resource: PermissionResource.PERMISSION },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.PERMISSION,
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.PERMISSION,
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.PERMISSION,
    },

    // Admin permissions
    { action: PermissionAction.READ, resource: PermissionResource.ADMIN },
    { action: PermissionAction.UPDATE, resource: PermissionResource.ADMIN },
    { action: PermissionAction.MANAGE, resource: PermissionResource.ADMIN },

    // Sport Center permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.SPORT_CENTER,
    },
    {
      action: PermissionAction.READ,
      resource: PermissionResource.SPORT_CENTER,
    },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.SPORT_CENTER,
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.SPORT_CENTER,
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.SPORT_CENTER,
    },

    // Field permissions
    { action: PermissionAction.CREATE, resource: PermissionResource.FIELD },
    { action: PermissionAction.READ, resource: PermissionResource.FIELD },
    { action: PermissionAction.UPDATE, resource: PermissionResource.FIELD },
    { action: PermissionAction.DELETE, resource: PermissionResource.FIELD },
    { action: PermissionAction.MANAGE, resource: PermissionResource.FIELD },

    // Reservation permissions
    {
      action: PermissionAction.CREATE,
      resource: PermissionResource.RESERVATION,
    },
    { action: PermissionAction.READ, resource: PermissionResource.RESERVATION },
    {
      action: PermissionAction.UPDATE,
      resource: PermissionResource.RESERVATION,
    },
    {
      action: PermissionAction.DELETE,
      resource: PermissionResource.RESERVATION,
    },
    {
      action: PermissionAction.MANAGE,
      resource: PermissionResource.RESERVATION,
    },

    // Tenant permissions
    { action: PermissionAction.CREATE, resource: PermissionResource.TENANT },
    { action: PermissionAction.READ, resource: PermissionResource.TENANT },
    { action: PermissionAction.UPDATE, resource: PermissionResource.TENANT },
    { action: PermissionAction.DELETE, resource: PermissionResource.TENANT },
    { action: PermissionAction.MANAGE, resource: PermissionResource.TENANT },

    // Staff permissions
    { action: PermissionAction.CREATE, resource: PermissionResource.STAFF },
    { action: PermissionAction.READ, resource: PermissionResource.STAFF },
    { action: PermissionAction.UPDATE, resource: PermissionResource.STAFF },
    { action: PermissionAction.DELETE, resource: PermissionResource.STAFF },
    { action: PermissionAction.MANAGE, resource: PermissionResource.STAFF },

    // Metrics permissions
    { action: PermissionAction.READ, resource: PermissionResource.METRICS },
    { action: PermissionAction.MANAGE, resource: PermissionResource.METRICS },

    // Settings permissions
    { action: PermissionAction.READ, resource: PermissionResource.SETTINGS },
    { action: PermissionAction.UPDATE, resource: PermissionResource.SETTINGS },
    { action: PermissionAction.MANAGE, resource: PermissionResource.SETTINGS },

    // Payment permissions
    { action: PermissionAction.CREATE, resource: PermissionResource.PAYMENT },
    { action: PermissionAction.READ, resource: PermissionResource.PAYMENT },
    { action: PermissionAction.UPDATE, resource: PermissionResource.PAYMENT },
    { action: PermissionAction.DELETE, resource: PermissionResource.PAYMENT },
    { action: PermissionAction.MANAGE, resource: PermissionResource.PAYMENT },
  ];

  // Create permissions for each tenant
  const createdPermissions = [];
  for (const tenant of [defaultTenant, demoTenant]) {
    for (const perm of permissions) {
      const permission = await prisma.permission.create({
        data: {
          action: perm.action,
          resource: perm.resource,
          description: `${perm.action} permission for ${perm.resource}`,
          tenantId: tenant.id,
        },
      });
      createdPermissions.push(permission);
    }
  }

  // Create roles for each tenant
  const rolesByTenant = new Map();

  for (const tenant of [defaultTenant, demoTenant]) {
    const tenantRoles = {
      sysAdmin: await prisma.role.create({
        data: {
          name: "sys_admin",
          displayName: "System Administrator",
          description: "Full system access including tenant management",
          isSystem: true,
          tenantId: tenant.id,
        },
      }),
      tenantAdmin: await prisma.role.create({
        data: {
          name: "tenant_admin",
          displayName: "Tenant Administrator",
          description:
            "Full access within tenant: fields, reservations, payments, staff, metrics",
          isSystem: true,
          tenantId: tenant.id,
        },
      }),
      tenantStaff: await prisma.role.create({
        data: {
          name: "tenant_staff",
          displayName: "Tenant Staff",
          description:
            "Limited access: read fields, manage reservations, verify payments",
          isSystem: true,
          tenantId: tenant.id,
        },
      }),
      client: await prisma.role.create({
        data: {
          name: "client",
          displayName: "Client",
          description: "Client access: view and create own reservations",
          isSystem: true,
          tenantId: tenant.id,
        },
      }),
    };
    rolesByTenant.set(tenant.id, tenantRoles);
  }

  // Assign permissions to roles for each tenant
  for (const tenant of [defaultTenant, demoTenant]) {
    const tenantRoles = rolesByTenant.get(tenant.id);
    const tenantPermissions = createdPermissions.filter(
      (p) => p.tenantId === tenant.id
    );

    // System Admin gets all permissions (including TENANT management)
    for (const permission of tenantPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: tenantRoles.sysAdmin.id,
          permissionId: permission.id,
        },
      });
    }

    // Tenant Admin gets: MANAGE on FIELD, SPORT_CENTER, STAFF, SETTINGS, METRICS
    // CREATE/READ/UPDATE/DELETE on RESERVATION, PAYMENT, USER; READ on DASHBOARD
    const tenantAdminPermissions = tenantPermissions.filter(
      (p) =>
        // MANAGE permissions
        ((
          [
            PermissionResource.FIELD,
            PermissionResource.SPORT_CENTER,
            PermissionResource.STAFF,
            PermissionResource.SETTINGS,
            PermissionResource.METRICS,
          ] as PermissionResource[]
        ).includes(p.resource) &&
          p.action === PermissionAction.MANAGE) ||
        // Full CRUD on RESERVATION, PAYMENT, USER
        ((
          [
            PermissionResource.RESERVATION,
            PermissionResource.PAYMENT,
            PermissionResource.USER,
          ] as PermissionResource[]
        ).includes(p.resource) &&
          (
            [
              PermissionAction.CREATE,
              PermissionAction.READ,
              PermissionAction.UPDATE,
              PermissionAction.DELETE,
            ] as PermissionAction[]
          ).includes(p.action)) ||
        // READ on DASHBOARD
        (p.resource === PermissionResource.DASHBOARD &&
          p.action === PermissionAction.READ)
    );
    for (const permission of tenantAdminPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: tenantRoles.tenantAdmin.id,
          permissionId: permission.id,
        },
      });
    }

    // Tenant Staff gets: READ on FIELD, SPORT_CENTER, DASHBOARD, METRICS, USER
    // CREATE/READ/UPDATE on RESERVATION; READ/UPDATE on PAYMENT
    const tenantStaffPermissions = tenantPermissions.filter(
      (p) =>
        // READ permissions on multiple resources
        ((
          [
            PermissionResource.FIELD,
            PermissionResource.SPORT_CENTER,
            PermissionResource.DASHBOARD,
            PermissionResource.METRICS,
            PermissionResource.USER,
          ] as PermissionResource[]
        ).includes(p.resource) &&
          p.action === PermissionAction.READ) ||
        // CREATE/READ/UPDATE on RESERVATION
        (p.resource === PermissionResource.RESERVATION &&
          (
            [
              PermissionAction.CREATE,
              PermissionAction.READ,
              PermissionAction.UPDATE,
            ] as PermissionAction[]
          ).includes(p.action)) ||
        // READ/UPDATE on PAYMENT (verify only)
        (p.resource === PermissionResource.PAYMENT &&
          (
            [
              PermissionAction.READ,
              PermissionAction.UPDATE,
            ] as PermissionAction[]
          ).includes(p.action))
    );
    for (const permission of tenantStaffPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: tenantRoles.tenantStaff.id,
          permissionId: permission.id,
        },
      });
    }

    // Client gets: READ on DASHBOARD; READ/CREATE on RESERVATION
    const clientPermissions = tenantPermissions.filter(
      (p) =>
        (p.resource === PermissionResource.DASHBOARD &&
          p.action === PermissionAction.READ) ||
        (p.resource === PermissionResource.RESERVATION &&
          (
            [
              PermissionAction.READ,
              PermissionAction.CREATE,
            ] as PermissionAction[]
          ).includes(p.action))
    );
    for (const permission of clientPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: tenantRoles.client.id,
          permissionId: permission.id,
        },
      });
    }
  }

  // ================================
  // 4. CREATE LOCALES (i18n)
  // ================================
  console.log("🌍 Creating locales...");

  const locales = [
    {
      languageCode: "es",
      name: "Spanish",
      nativeName: "Español",
      locale: "es_ES",
      direction: "ltr",
      currencySymbol: "$",
      isActive: true,
      isDefault: true,
      displayOrder: 0,
    },
    {
      languageCode: "en",
      name: "English",
      nativeName: "English",
      locale: "en_US",
      direction: "ltr",
      currencySymbol: "$",
      isActive: true,
      isDefault: false,
      displayOrder: 1,
    },
    {
      languageCode: "pt",
      name: "Portuguese",
      nativeName: "Português",
      locale: "pt_BR",
      direction: "ltr",
      currencySymbol: "R$",
      isActive: true,
      isDefault: false,
      displayOrder: 2,
    },
    {
      languageCode: "fr",
      name: "French",
      nativeName: "Français",
      locale: "fr_FR",
      direction: "ltr",
      currencySymbol: "€",
      isActive: true,
      isDefault: false,
      displayOrder: 3,
    },
  ];

  const createdLocales = [];
  for (const localeData of locales) {
    const locale = await prisma.locale.upsert({
      where: { languageCode: localeData.languageCode },
      update: localeData,
      create: localeData,
    });
    createdLocales.push(locale);
    console.log(
      `   ✅ Created/Updated locale: ${locale.nativeName} (${locale.languageCode})`
    );
  }

  console.log(`✅ Created ${createdLocales.length} locales`);

  // ================================
  // 5. USER CREATION (ALL ROLES)
  // ================================
  const users = [
    // System Administrator (no tenant)
    {
      name: "System Administrator",
      email: "sys_admin@reservo.com",
      password: "SysAdmin123!@#",
      phone: "+1 (555) 000-0000",
      language: "EN" as const,
      tenantId: defaultTenant.id, // System admin needs a tenant for role assignment
      roleName: "sys_admin",
      username: "sysadmin",
    },
    // Default tenant (my-app) users
    {
      name: "Tenant Admin - Cancha 1",
      email: "admin@cancha1.com",
      password: "Admin123!@#",
      phone: "+1 (555) 111-0001",
      language: "ES" as const,
      tenantId: defaultTenant.id,
      roleName: "tenant_admin",
      username: "admincancha1",
    },
    {
      name: "Staff Member - Cancha 1",
      email: "staff@cancha1.com",
      password: "Staff123!@#",
      phone: "+1 (555) 111-0002",
      language: "ES" as const,
      tenantId: defaultTenant.id,
      roleName: "tenant_staff",
      username: "staffcancha1",
    },
    {
      name: "Carlos Sport Owner",
      email: "owner@myapp.com",
      password: "Owner123!@#",
      phone: "+1 (555) 111-2222",
      language: "ES" as const,
      tenantId: defaultTenant.id,
      roleName: "tenant_admin",
      username: "carlosowner",
    },
    {
      name: "María Cancha Owner",
      email: "owner2@myapp.com",
      password: "Owner123!@#",
      phone: "+1 (555) 111-2223",
      language: "ES" as const,
      tenantId: defaultTenant.id,
      roleName: "tenant_admin",
      username: "mariacancha",
    },
    {
      name: "Client User",
      email: "cliente@test.com",
      password: "Cliente123!@#",
      phone: "+1 (555) 222-0001",
      language: "ES" as const,
      tenantId: defaultTenant.id,
      roleName: "client",
      username: "cliente",
    },
    {
      name: "John Doe",
      email: "user@myapp.com",
      password: "User123!@#",
      phone: "+1 (555) 987-6543",
      language: "EN" as const,
      tenantId: defaultTenant.id,
      roleName: "client",
      username: "johndoe",
    },
    {
      name: "Maria Rodriguez",
      email: "maria@myapp.com",
      password: "Maria123!@#",
      phone: "+1 (555) 123-4567",
      language: "ES" as const,
      tenantId: defaultTenant.id,
      roleName: "client",
      username: "mariarodriguez",
    },
    // Demo tenant users
    {
      name: "Tenant Admin - Cancha 2",
      email: "admin@cancha2.com",
      password: "Admin123!@#",
      phone: "+1 (555) 222-0001",
      language: "ES" as const,
      tenantId: demoTenant.id,
      roleName: "tenant_admin",
      username: "admincancha2",
    },
    {
      name: "Demo Client",
      email: "user@democorp.com",
      password: "DemoUser123!@#",
      phone: "+1 (555) 999-0002",
      language: "EN" as const,
      tenantId: demoTenant.id,
      roleName: "client",
      username: "democlient",
    },
  ];

  console.log("👥 Creating users...");
  console.log(`📊 Total users to create: ${users.length}`);
  console.log("🔧 Better-auth configuration:", {
    emailAndPasswordEnabled: true,
    emailVerificationRequired: false,
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
  });

  // Verify roles were created correctly
  console.log("🔍 Verifying roles were created...");
  for (const [tenantId, tenantRoles] of rolesByTenant.entries()) {
    console.log(
      `   🏢 Tenant ${tenantId} roles:`,
      Object.keys(tenantRoles).map((roleName) => ({
        name: roleName,
        id: tenantRoles[roleName as keyof typeof tenantRoles].id,
        displayName:
          tenantRoles[roleName as keyof typeof tenantRoles].displayName,
      }))
    );
  }

  const createdUsers = [];

  for (const userData of users) {
    try {
      console.log(`\n🆕 Creating user: ${userData.email}`);
      console.log(`   - Name: ${userData.name}`);
      console.log(`   - Tenant: ${userData.tenantId}`);
      console.log(`   - Role: ${userData.roleName}`);
      console.log(`   - Language: ${userData.language}`);

      // Check if email already exists
      console.log("   🔍 Checking if email already exists...");
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (existingUser) {
        console.log(`   ⚠️ User ${userData.email} already exists, skipping`);
        continue;
      }
      console.log("   ✅ Email is available");

      // Create user directly with Prisma (including username from the start)
      console.log("   🔐 Creating user with Prisma...");
      console.log("   📝 User data:", {
        email: userData.email,
        name: userData.name,
        username: userData.username || userData.email.split("@")[0],
        passwordLength: userData.password.length,
      });

      // Hash password using Better Auth's hashPassword function
      const hashedPassword = await hashPassword(userData.password);

      // Create user directly with all required fields
      // Ensure username is always defined
      const username =
        userData.username ??
        userData.email.split("@")[0] ??
        `user_${Date.now()}`;

      const newUser = await prisma.user.create({
        data: {
          username,
          name: userData.name,
          email: userData.email,
          emailVerified: true, // Mark as verified for seed
          phone: userData.phone,
          language: userData.language || "ES",
          image: "/images/avatars/robert-fox.png",
          tenantId: userData.tenantId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          emailVerified: true,
          image: true,
          phone: true,
          language: true,
          tenantId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      console.log(`   ✅ User created successfully with ID: ${newUser.id}`);
      console.log(`   ✅ User created with tenantId: ${newUser.tenantId}`);

      // Get the role for this tenant
      console.log(`   🎭 Getting role for tenant ${userData.tenantId}...`);
      const tenantRoles = rolesByTenant.get(userData.tenantId);
      if (!tenantRoles) {
        console.error(`   ❌ No roles found for tenant ${userData.tenantId}`);
        continue;
      }

      // Map role names to the correct keys in tenantRoles object
      const roleNameMap: Record<string, keyof typeof tenantRoles> = {
        sys_admin: "sysAdmin",
        tenant_admin: "tenantAdmin",
        tenant_staff: "tenantStaff",
        client: "client",
      };

      const roleKey = roleNameMap[userData.roleName];
      if (!roleKey) {
        console.error(
          `   ❌ Role ${userData.roleName} not found in role mapping`
        );
        console.log("   📋 Available roles:", Object.keys(roleNameMap));
        continue;
      }

      const role = tenantRoles[roleKey];
      if (!role) {
        console.log("   📋 Available roles:", Object.keys(tenantRoles));
        continue;
      }

      console.log(`   ✅ Found role: ${role.name} (ID: ${role.id})`);

      // Assign role
      console.log("   🔗 Assigning role to user...");
      await prisma.userRole.create({
        data: {
          userId: newUser.id,
          roleId: role.id,
          assignedBy: "system",
        },
      });

      console.log("   ✅ Role assigned successfully");

      // Create Account record for better-auth (required for email/password authentication)
      console.log("   🔐 Creating account for better-auth...");
      await prisma.account.create({
        data: {
          userId: newUser.id,
          accountId: newUser.email, // Use email as accountId for credential provider
          providerId: "credential", // Better-auth uses "credential" for email/password
          password: hashedPassword, // Store hashed password in account
        },
      });
      console.log("   ✅ Account created for better-auth");

      createdUsers.push(newUser);
      console.log(
        `   🎉 User ${userData.email} created successfully with role ${userData.roleName} in tenant ${userData.tenantId}`
      );
      console.log(`   🔑 Password: ${userData.password} (use this for login)`);
    } catch (error: unknown) {
      console.error(`\n❌ Error creating user ${userData.email}:`);
      console.error("   📋 Error type:", typeof error);
      console.error(
        "   📋 Error message:",
        error instanceof Error ? error.message : "Unknown error"
      );
      console.error(
        "   📋 Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      );
      console.error("   📋 Full error object:", JSON.stringify(error, null, 2));

      // Log user data that caused the error
      console.error("   📋 User data that caused error:", {
        email: userData.email,
        name: userData.name,
        tenantId: userData.tenantId,
        roleName: userData.roleName,
        language: userData.language,
      });
    }
  }

  // ================================
  // 6. CREATE FEATURES (Características de canchas)
  // ================================
  console.log("🏗️ Creating features...");

  const features = [
    {
      name: "Duchas",
      description: "Duchas disponibles para los jugadores",
      icon: "shower",
      isActive: true,
    },
    {
      name: "Vestidores",
      description: "Vestidores con casilleros",
      icon: "locker",
      isActive: true,
    },
    {
      name: "Estacionamiento",
      description: "Estacionamiento gratuito",
      icon: "parking",
      isActive: true,
    },
    {
      name: "WiFi",
      description: "Conexión WiFi gratuita",
      icon: "wifi",
      isActive: true,
    },
    {
      name: "Iluminación",
      description: "Iluminación para partidos nocturnos",
      icon: "light",
      isActive: true,
    },
    {
      name: "Cafetería",
      description: "Cafetería con snacks y bebidas",
      icon: "coffee",
      isActive: true,
    },
    {
      name: "Césped Sintético",
      description: "Superficie de césped sintético",
      icon: "grass",
      isActive: true,
    },
    {
      name: "Césped Natural",
      description: "Superficie de césped natural",
      icon: "grass",
      isActive: true,
    },
  ];

  const createdFeatures = [];
  for (const featureData of features) {
    const feature = await prisma.feature.upsert({
      where: { name: featureData.name },
      update: featureData,
      create: featureData,
    });
    createdFeatures.push(feature);
  }
  console.log(`✅ Created ${createdFeatures.length} features`);

  // ================================
  // 7. CREATE PAYMENT METHODS
  // ================================
  console.log("💳 Creating payment methods...");

  const paymentMethods = [
    {
      name: "Yape",
      provider: "yape",
      requiresProof: true,
      isActive: true,
    },
    {
      name: "Plin",
      provider: "plin",
      requiresProof: true,
      isActive: true,
    },
    {
      name: "Mercado Pago",
      provider: "mercadopago",
      requiresProof: false,
      isActive: true,
    },
    {
      name: "Qulqi",
      provider: "qulqi",
      requiresProof: false,
      isActive: true,
    },
    {
      name: "Efectivo",
      provider: "cash",
      requiresProof: false,
      isActive: true,
    },
    {
      name: "Transferencia Bancaria",
      provider: "bank_transfer",
      requiresProof: true,
      isActive: true,
    },
  ];

  const createdPaymentMethods = [];
  for (const methodData of paymentMethods) {
    const method = await prisma.paymentMethod.upsert({
      where: { name: methodData.name },
      update: methodData,
      create: methodData,
    });
    createdPaymentMethods.push(method);
  }
  console.log(`✅ Created ${createdPaymentMethods.length} payment methods`);

  // ================================
  // 8. CREATE SPORT CENTERS & FIELDS (lugares reales de Perú)
  // ================================
  console.log("🏟️ Creating sport centers and fields...");

  // Get owner users
  const ownerUser = createdUsers.find((u) => u.email === "owner@myapp.com");
  const ownerUser2 = createdUsers.find((u) => u.email === "owner2@myapp.com");
  if (!ownerUser || !ownerUser2) {
    console.log("⚠️ Owner users not found, skipping sport centers and fields");
  } else {
    // 8a. Centros deportivos reales de Perú
    let palacioJuventud:
      | {
          id: string;
          address: string;
          district: string | null;
          department: string;
        }
      | undefined;
    let videna:
      | {
          id: string;
          address: string;
          district: string | null;
          department: string;
        }
      | undefined;
    let mariaReicheId: string | undefined;

    try {
      const palacio = await prisma.sportCenter.create({
        data: {
          tenantId: defaultTenant.id,
          name: "Palacio de la Juventud",
          slug: "palacio-de-la-juventud",
          address: "Av. del Aire s/n, frente a Videna",
          department: "Lima",
          province: "Lima",
          district: "San Luis",
          description:
            "Complejo deportivo municipal con canchas de tenis, básquet y vóley. Instalaciones modernas, vestuarios y gradas. Ideal para torneos y práctica.",
          phone: "+51 1 265 7890",
          email: "contacto@palaciojuventud.gob.pe",
          website: "https://www.munisanluis.gob.pe",
          latitude: -12.0772,
          longitude: -77.0524,
          googleMapsUrl: "https://maps.google.com/?q=-12.0772,-77.0524",
          status: SportCenterStatus.ACTIVE,
          images: [],
          ownerId: ownerUser.id,
        },
      });
      palacioJuventud = palacio;
      console.log(
        "   ✅ Created sport center: Palacio de la Juventud (San Luis)"
      );

      const videnaCenter = await prisma.sportCenter.create({
        data: {
          tenantId: defaultTenant.id,
          name: "Villa Deportiva Nacional - VIDENA",
          slug: "videna",
          address: "Av. del Aire cdra 1",
          department: "Lima",
          province: "Lima",
          district: "San Luis",
          description:
            "Sede del Instituto Peruano del Deporte. Canchas de fútbol y futsal de nivel competitivo, césped sintético y tribunas.",
          phone: "+51 1 265 1234",
          email: "info@ipd.gob.pe",
          latitude: -12.0785,
          longitude: -77.0518,
          googleMapsUrl: "https://maps.google.com/?q=-12.0785,-77.0518",
          status: SportCenterStatus.ACTIVE,
          images: [],
          ownerId: ownerUser2.id,
        },
      });
      videna = videnaCenter;
      console.log("   ✅ Created sport center: VIDENA (San Luis)");

      const complejoMariaReiche = await prisma.sportCenter.create({
        data: {
          tenantId: defaultTenant.id,
          name: "Complejo Deportivo María Reiche",
          slug: "complejo-maria-reiche",
          address: "Av. El Polo 305, Monterrico",
          department: "Lima",
          province: "Lima",
          district: "Santiago de Surco",
          description:
            "Complejo con canchas de tenis y vóley. Ambiente familiar, estacionamiento y cafetería.",
          phone: "+51 1 437 4567",
          email: "reservas@mariareiche.edu.pe",
          latitude: -12.0842,
          longitude: -76.9765,
          googleMapsUrl: "https://maps.google.com/?q=-12.0842,-76.9765",
          status: SportCenterStatus.ACTIVE,
          images: [],
          ownerId: ownerUser.id,
        },
      });
      mariaReicheId = complejoMariaReiche.id;
      console.log("   ✅ Created sport center: Complejo María Reiche (Surco)");
    } catch (error: unknown) {
      const prismaError = error as { code?: string };
      if (prismaError?.code === "P2021") {
        console.log("⏭️ Tabla sport_centers no existe, omitiendo centros...");
      } else {
        throw error;
      }
    }

    // 8b. Canchas: dentro de centros deportivos + canchas individuales (lugares reales Lima)
    const palacioId = palacioJuventud?.id;
    const videnaId = videna?.id;

    const fields: Array<{
      name: string;
      sport: Sport;
      price: number;
      available: boolean;
      images: string[];
      surfaceType?: SurfaceType;
      isIndoor?: boolean;
      hasLighting?: boolean;
      address: string;
      department: string;
      district: string;
      latitude: number;
      longitude: number;
      googleMapsUrl: string;
      description: string;
      phone: string;
      email: string;
      ownerId: string;
      tenantId: string;
      sportCenterId?: string;
    }> = [];

    // Palacio de la Juventud: tenis, básquet, vóley
    if (palacioId) {
      const baseAddr = "Av. del Aire s/n, San Luis";
      const baseLat = -12.0772;
      const baseLng = -77.0524;
      fields.push(
        {
          name: "Tenis 1 - Palacio de la Juventud",
          sport: Sport.TENNIS,
          price: 55.0,
          available: true,
          images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
          surfaceType: "HARD_COURT",
          hasLighting: true,
          address: baseAddr,
          department: "Lima",
          district: "San Luis",
          latitude: baseLat,
          longitude: baseLng,
          googleMapsUrl: "https://maps.google.com/?q=-12.0772,-77.0524",
          description:
            "Cancha de tenis con superficie de cemento. Iluminación nocturna.",
          phone: "+51 1 265 7890",
          email: "contacto@palaciojuventud.gob.pe",
          ownerId: ownerUser.id,
          tenantId: defaultTenant.id,
          sportCenterId: palacioId,
        },
        {
          name: "Tenis 2 - Palacio de la Juventud",
          sport: Sport.TENNIS,
          price: 55.0,
          available: true,
          images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
          surfaceType: "CLAY",
          hasLighting: true,
          address: baseAddr,
          department: "Lima",
          district: "San Luis",
          latitude: baseLat,
          longitude: baseLng,
          googleMapsUrl: "https://maps.google.com/?q=-12.0772,-77.0524",
          description: "Cancha de tenis arcilla. Vestuarios en el complejo.",
          phone: "+51 1 265 7890",
          email: "contacto@palaciojuventud.gob.pe",
          ownerId: ownerUser.id,
          tenantId: defaultTenant.id,
          sportCenterId: palacioId,
        },
        {
          name: "Básquet - Palacio de la Juventud",
          sport: Sport.BASKETBALL,
          price: 65.0,
          available: true,
          images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
          surfaceType: "PARQUET",
          isIndoor: true,
          hasLighting: true,
          address: baseAddr,
          department: "Lima",
          district: "San Luis",
          latitude: baseLat,
          longitude: baseLng,
          googleMapsUrl: "https://maps.google.com/?q=-12.0772,-77.0524",
          description:
            "Cancha de básquet techada, piso de parquet. Ideal para torneos.",
          phone: "+51 1 265 7890",
          email: "contacto@palaciojuventud.gob.pe",
          ownerId: ownerUser.id,
          tenantId: defaultTenant.id,
          sportCenterId: palacioId,
        },
        {
          name: "Vóley - Palacio de la Juventud",
          sport: Sport.VOLLEYBALL,
          price: 50.0,
          available: true,
          images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
          surfaceType: "PARQUET",
          isIndoor: true,
          hasLighting: true,
          address: baseAddr,
          department: "Lima",
          district: "San Luis",
          latitude: baseLat,
          longitude: baseLng,
          googleMapsUrl: "https://maps.google.com/?q=-12.0772,-77.0524",
          description: "Cancha de vóley sala. Red y líneas reglamentarias.",
          phone: "+51 1 265 7890",
          email: "contacto@palaciojuventud.gob.pe",
          ownerId: ownerUser.id,
          tenantId: defaultTenant.id,
          sportCenterId: palacioId,
        }
      );
    }

    // VIDENA: fútbol y futsal
    if (videnaId) {
      const baseAddr = "Av. del Aire cdra 1, San Luis";
      const baseLat = -12.0785;
      const baseLng = -77.0518;
      fields.push(
        {
          name: "Fútbol 1 - VIDENA",
          sport: Sport.FOOTBALL,
          price: 90.0,
          available: true,
          images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
          surfaceType: "SYNTHETIC_GRASS",
          hasLighting: true,
          address: baseAddr,
          department: "Lima",
          district: "San Luis",
          latitude: baseLat,
          longitude: baseLng,
          googleMapsUrl: "https://maps.google.com/?q=-12.0785,-77.0518",
          description:
            "Cancha de fútbol césped sintético. Nivel competitivo, tribunas.",
          phone: "+51 1 265 1234",
          email: "info@ipd.gob.pe",
          ownerId: ownerUser2.id,
          tenantId: defaultTenant.id,
          sportCenterId: videnaId,
        },
        {
          name: "Futsal - VIDENA",
          sport: Sport.FUTSAL,
          price: 70.0,
          available: true,
          images: [
            "https://sport-12.com/wp-content/uploads/2022/02/Cancha-Chapultepec_cuadrado.jpg",
          ],
          surfaceType: "SYNTHETIC_GRASS",
          isIndoor: true,
          hasLighting: true,
          address: baseAddr,
          department: "Lima",
          district: "San Luis",
          latitude: baseLat,
          longitude: baseLng,
          googleMapsUrl: "https://maps.google.com/?q=-12.0785,-77.0518",
          description: "Cancha de futsal techada. Piso sintético profesional.",
          phone: "+51 1 265 1234",
          email: "info@ipd.gob.pe",
          ownerId: ownerUser2.id,
          tenantId: defaultTenant.id,
          sportCenterId: videnaId,
        }
      );
    }

    // Complejo María Reiche (Surco): tenis y vóley
    if (mariaReicheId) {
      const baseAddr = "Av. El Polo 305, Monterrico";
      const baseLat = -12.0842;
      const baseLng = -76.9765;
      fields.push(
        {
          name: "Tenis - María Reiche",
          sport: Sport.TENNIS,
          price: 50.0,
          available: true,
          images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
          surfaceType: "HARD_COURT",
          hasLighting: true,
          address: baseAddr,
          department: "Lima",
          district: "Santiago de Surco",
          latitude: baseLat,
          longitude: baseLng,
          googleMapsUrl: "https://maps.google.com/?q=-12.0842,-76.9765",
          description:
            "Cancha de tenis en complejo familiar. Estacionamiento disponible.",
          phone: "+51 1 437 4567",
          email: "reservas@mariareiche.edu.pe",
          ownerId: ownerUser.id,
          tenantId: defaultTenant.id,
          sportCenterId: mariaReicheId,
        },
        {
          name: "Vóley - María Reiche",
          sport: Sport.VOLLEYBALL,
          price: 45.0,
          available: true,
          images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
          surfaceType: "CONCRETE",
          address: baseAddr,
          department: "Lima",
          district: "Santiago de Surco",
          latitude: baseLat,
          longitude: baseLng,
          googleMapsUrl: "https://maps.google.com/?q=-12.0842,-76.9765",
          description: "Cancha de vóley al aire libre. Ideal para grupos.",
          phone: "+51 1 437 4567",
          email: "reservas@mariareiche.edu.pe",
          ownerId: ownerUser.id,
          tenantId: defaultTenant.id,
          sportCenterId: mariaReicheId,
        }
      );
    }

    // Canchas individuales (sin centro) - lugares reales de Lima
    fields.push(
      {
        name: "Cancha de Fútbol - San Isidro",
        sport: Sport.FOOTBALL,
        price: 80.0,
        available: true,
        images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
        surfaceType: "SYNTHETIC_GRASS",
        hasLighting: true,
        address: "Av. Javier Prado Este 4200",
        department: "Lima",
        district: "San Isidro",
        latitude: -12.0969,
        longitude: -77.0338,
        googleMapsUrl: "https://maps.google.com/?q=-12.0969,-77.0338",
        description:
          "Cancha de fútbol con césped sintético de última generación. Ideal para partidos y entrenamientos.",
        phone: "+51 987 654 321",
        email: "cancha1@reservo.com",
        ownerId: ownerUser.id,
        tenantId: defaultTenant.id,
      },
      {
        name: "Cancha de Futsal - Miraflores",
        sport: Sport.FUTSAL,
        price: 60.0,
        available: true,
        images: [
          "https://sport-12.com/wp-content/uploads/2022/02/Cancha-Chapultepec_cuadrado.jpg",
        ],
        surfaceType: "SYNTHETIC_GRASS",
        isIndoor: true,
        hasLighting: true,
        address: "Av. Larco 1234",
        department: "Lima",
        district: "Miraflores",
        latitude: -12.1224,
        longitude: -77.0303,
        googleMapsUrl: "https://maps.google.com/?q=-12.1224,-77.0303",
        description:
          "Cancha de futsal techada con piso de calidad profesional. Iluminación LED.",
        phone: "+51 987 654 322",
        email: "cancha2@reservo.com",
        ownerId: ownerUser2.id,
        tenantId: defaultTenant.id,
      },
      {
        name: "Cancha de Fútbol - La Molina",
        sport: Sport.FOOTBALL,
        price: 75.0,
        available: true,
        images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
        surfaceType: "NATURAL_GRASS",
        address: "Av. La Molina 5678",
        department: "Lima",
        district: "La Molina",
        latitude: -12.0759,
        longitude: -76.9475,
        googleMapsUrl: "https://maps.google.com/?q=-12.0759,-76.9475",
        description:
          "Cancha de fútbol con césped natural. Perfecta para partidos de fin de semana.",
        phone: "+51 987 654 323",
        email: "cancha3@reservo.com",
        ownerId: ownerUser.id,
        tenantId: defaultTenant.id,
      },
      {
        name: "Cancha de Fútbol - Barranco",
        sport: Sport.FOOTBALL,
        price: 65.0,
        available: true,
        images: [
          "https://sport-12.com/wp-content/uploads/2022/02/Cancha-Chapultepec_cuadrado.jpg",
        ],
        surfaceType: "SYNTHETIC_GRASS",
        hasLighting: true,
        address: "Jr. 28 de Julio 456",
        department: "Lima",
        district: "Barranco",
        latitude: -12.1442,
        longitude: -77.0206,
        googleMapsUrl: "https://maps.google.com/?q=-12.1442,-77.0206",
        description:
          "Cancha de fútbol con césped sintético. Ubicada cerca del malecón.",
        phone: "+51 987 654 326",
        email: "cancha6@reservo.com",
        ownerId: ownerUser2.id,
        tenantId: defaultTenant.id,
      },
      {
        name: "Cancha de Futsal - Jesús María",
        sport: Sport.FUTSAL,
        price: 58.0,
        available: true,
        images: [
          "https://sport-12.com/wp-content/uploads/2022/02/Cancha-Chapultepec_cuadrado.jpg",
        ],
        surfaceType: "SYNTHETIC_GRASS",
        isIndoor: true,
        hasLighting: true,
        address: "Av. Brasil 2345",
        department: "Lima",
        district: "Jesús María",
        latitude: -12.0833,
        longitude: -77.0333,
        googleMapsUrl: "https://maps.google.com/?q=-12.0833,-77.0333",
        description:
          "Cancha de futsal techada con piso sintético. Estacionamiento disponible.",
        phone: "+51 987 654 328",
        email: "cancha8@reservo.com",
        ownerId: ownerUser2.id,
        tenantId: defaultTenant.id,
      },
      {
        name: "Pádel Club - San Borja",
        sport: Sport.PADEL,
        price: 70.0,
        available: true,
        images: [
          "https://sport-12.com/wp-content/uploads/2022/02/Cancha-Chapultepec_cuadrado.jpg",
        ],
        surfaceType: "SYNTHETIC_GRASS",
        isIndoor: false,
        hasLighting: true,
        address: "Av. San Borja Norte 500",
        department: "Lima",
        district: "San Borja",
        latitude: -12.1005,
        longitude: -77.0036,
        googleMapsUrl: "https://maps.google.com/?q=-12.1005,-77.0036",
        description:
          "Cancha de pádel con césped sintético y cristales. Iluminación LED.",
        phone: "+51 987 654 330",
        email: "padel@reservo.com",
        ownerId: ownerUser.id,
        tenantId: defaultTenant.id,
      },
      {
        name: "Multicancha - Surquillo",
        sport: Sport.MULTI_PURPOSE,
        price: 55.0,
        available: true,
        images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
        surfaceType: "CONCRETE",
        hasLighting: true,
        address: "Av. Tomás Marsano 1200",
        department: "Lima",
        district: "Surquillo",
        latitude: -12.1125,
        longitude: -77.0167,
        googleMapsUrl: "https://maps.google.com/?q=-12.1125,-77.0167",
        description:
          "Espacio polivalente para fútbol, básquet y vóley. Piso de concreto.",
        phone: "+51 987 654 331",
        email: "multi@reservo.com",
        ownerId: ownerUser2.id,
        tenantId: defaultTenant.id,
      }
    );

    const createdFields = [];
    const usedSlugs = new Set<string>();
    try {
      for (const fieldData of fields) {
        const slug = generateUniqueSlug(
          fieldData.name,
          fieldData.sport,
          usedSlugs
        );
        usedSlugs.add(slug);
        const field = await prisma.field.create({
          data: { ...fieldData, slug },
        });
        createdFields.push(field);
        console.log(`   ✅ Created field: ${field.name} (${field.district})`);
      }
      console.log(`✅ Created ${createdFields.length} individual fields`);
    } catch (error: unknown) {
      const prismaError = error as { code?: string };
      if (prismaError?.code === "P2021") {
        console.log("⏭️ Tabla fields no existe, omitiendo canchas...");
      } else {
        throw error;
      }
    }

    // ================================
    // 10. CREATE FIELD FEATURES
    // ================================
    console.log("🔧 Creating field features...");

    // Verify fields exist before creating features
    if (createdFields.length >= 2) {
      const firstField = createdFields[0];
      const secondField = createdFields[1];

      if (firstField && secondField) {
        const cespedFeature = createdFeatures.find(
          (f) => f.name === "Césped Sintético"
        );
        const iluminacionFeature = createdFeatures.find(
          (f) => f.name === "Iluminación"
        );
        const duchasFeature = createdFeatures.find((f) => f.name === "Duchas");
        const estacionamientoFeature = createdFeatures.find(
          (f) => f.name === "Estacionamiento"
        );

        if (
          cespedFeature &&
          iluminacionFeature &&
          duchasFeature &&
          estacionamientoFeature
        ) {
          const fieldFeatures = [
            {
              fieldId: firstField.id,
              featureId: cespedFeature.id,
              value: "Césped sintético de última generación",
            },
            {
              fieldId: firstField.id,
              featureId: iluminacionFeature.id,
              value: "Sí",
            },
            {
              fieldId: firstField.id,
              featureId: duchasFeature.id,
              value: "4 duchas",
            },
            {
              fieldId: firstField.id,
              featureId: estacionamientoFeature.id,
              value: "20 plazas",
            },
            {
              fieldId: secondField.id,
              featureId: cespedFeature.id,
              value: "Césped sintético",
            },
            {
              fieldId: secondField.id,
              featureId: iluminacionFeature.id,
              value: "Sí",
            },
          ];

          for (const featureData of fieldFeatures) {
            await prisma.fieldFeature.create({
              data: featureData,
            });
          }
          console.log(`✅ Created ${fieldFeatures.length} field features`);
        } else {
          console.log("⚠️ Missing required features, skipping field features");
        }
      }
    } else {
      console.log("⚠️ Not enough fields created, skipping field features");
    }

    // ================================
    // 11. CREATE SCHEDULES (Horarios de canchas)
    // ================================
    console.log("⏰ Creating field schedules...");

    const schedules = [];
    for (const field of createdFields) {
      // Horario de lunes a domingo: 8:00 - 22:00
      const days = [
        WeekDay.MONDAY,
        WeekDay.TUESDAY,
        WeekDay.WEDNESDAY,
        WeekDay.THURSDAY,
        WeekDay.FRIDAY,
        WeekDay.SATURDAY,
        WeekDay.SUNDAY,
      ];

      for (const day of days) {
        schedules.push({
          day,
          startHour: "08:00",
          endHour: "22:00",
          fieldId: field.id,
        });
      }
    }

    for (const scheduleData of schedules) {
      await prisma.schedule.create({
        data: scheduleData,
      });
    }
    console.log(`✅ Created ${schedules.length} field schedules`);

    // ================================
    // 12. OPERATING SCHEDULES (Omitido - Solo para SportCenters futuros)
    // ================================
    console.log(
      "⏭️ Skipping operating schedules (only for future SportCenters)"
    );

    // ================================
    // 13. CREATE RESERVATIONS
    // ================================
    console.log("📅 Creating reservations...");

    const clientUser = createdUsers.find((u) => u.email === "user@myapp.com");
    const mariaUser = createdUsers.find((u) => u.email === "maria@myapp.com");
    const clienteUser = createdUsers.find(
      (u) => u.email === "cliente@test.com"
    );
    const johnUser = createdUsers.find((u) => u.email === "user@myapp.com");

    const clientUsers = [clientUser, mariaUser, clienteUser, johnUser].filter(
      (u): u is NonNullable<typeof u> => !!u
    );
    const clientUserForNotif = clientUser ?? mariaUser ?? clientUsers[0];

    if (clientUsers.length === 0 || createdFields.length < 2) {
      console.log("⚠️ Not enough users or fields, skipping reservations");
    } else {
      const firstField = createdFields[0];
      const secondField = createdFields[1];
      const thirdField = createdFields[2];
      const fourthField = createdFields[3];
      const fieldsForRes = [
        firstField,
        secondField,
        thirdField,
        fourthField,
      ].filter((f): f is NonNullable<typeof f> => !!f);

      if (fieldsForRes.length < 2) {
        console.log("⚠️ Not enough fields created, skipping reservations");
      } else {
        const now = new Date();
        const hourMs = 60 * 60 * 1000;

        const statuses: ReservationStatus[] = [
          ReservationStatus.CONFIRMED,
          ReservationStatus.CONFIRMED,
          ReservationStatus.PENDING,
          ReservationStatus.COMPLETED,
          ReservationStatus.CANCELLED,
          ReservationStatus.NO_SHOW,
        ];

        const reservations: Array<{
          startDate: Date;
          endDate: Date;
          amount: number;
          status: ReservationStatus;
          userId: string;
          fieldId: string;
          tenantId: string;
        }> = [];

        // Últimos 14 días: para que los gráficos del dashboard muestren datos
        for (let dayOffset = -14; dayOffset <= 0; dayOffset++) {
          const date = new Date(now);
          date.setDate(date.getDate() + dayOffset);
          date.setHours(0, 0, 0, 0);

          const numSlots = 3 + (Math.abs(dayOffset) % 4);
          for (let s = 0; s < numSlots; s++) {
            const hour = 8 + s * 2 + (dayOffset % 2);
            const startDate = new Date(date);
            startDate.setHours(hour, 0, 0, 0);
            const endDate = new Date(startDate.getTime() + hourMs);

            const user = clientUsers[s % clientUsers.length];
            const field =
              fieldsForRes[(Math.abs(dayOffset) + s) % fieldsForRes.length];
            const status =
              statuses[(Math.abs(dayOffset) + s) % statuses.length];
            if (!user || !field || status == null) continue;
            const price = field.price ?? 80;
            reservations.push({
              startDate,
              endDate,
              amount: Number(price),
              status,
              userId: user.id,
              fieldId: field.id,
              tenantId: defaultTenant.id,
            });
          }
        }

        // Además: 2 semanas hacia adelante (para calendario y variedad)
        for (let weekOffset = 0; weekOffset <= 1; weekOffset++) {
          const weekStart = new Date(now);
          weekStart.setDate(
            weekStart.getDate() - weekStart.getDay() + 1 + weekOffset * 7
          );
          weekStart.setHours(0, 0, 0, 0);

          for (let day = 0; day < 7; day++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + day);

            const numSlots = 2 + (day % 2);
            for (let s = 0; s < numSlots; s++) {
              const hour = 10 + s * 4 + (day % 2);
              const startDate = new Date(date);
              startDate.setHours(hour, 0, 0, 0);
              const endDate = new Date(startDate.getTime() + hourMs);

              const user = clientUsers[s % clientUsers.length];
              const field = fieldsForRes[(day + s) % fieldsForRes.length];
              const status = statuses[(day + s) % statuses.length];
              if (!user || !field || status == null) continue;
              const price = field.price ?? 80;
              reservations.push({
                startDate,
                endDate,
                amount: Number(price),
                status,
                userId: user.id,
                fieldId: field.id,
                tenantId: defaultTenant.id,
              });
            }
          }
        }

        const createdReservations = [];
        try {
          for (const reservationData of reservations) {
            const reservation = await prisma.reservation.create({
              data: reservationData,
            });
            createdReservations.push(reservation);
          }
          console.log(`✅ Created ${createdReservations.length} reservations`);
        } catch (error: unknown) {
          const prismaError = error as { code?: string };
          if (prismaError?.code === "P2021") {
            console.log(
              "⏭️ Tabla reservations no existe, omitiendo reservas..."
            );
          } else {
            throw error;
          }
        }

        // ================================
        // 14. CREATE PAYMENTS
        // ================================
        console.log("💵 Creating payments...");

        const yapeMethod = createdPaymentMethods.find((m) => m.name === "Yape");
        const plinMethod = createdPaymentMethods.find((m) => m.name === "Plin");

        if (!yapeMethod || !plinMethod || createdReservations.length < 2) {
          console.log(
            "⚠️ Missing payment methods or reservations, skipping payments"
          );
        } else {
          const firstReservation = createdReservations[0];
          const secondReservation = createdReservations[1];

          if (!firstReservation || !secondReservation) {
            console.log("⚠️ Reservations not found, skipping payments");
          } else {
            const payments = [
              {
                amount: 160.0,
                status: PaymentStatus.PAID,
                proofImages: [
                  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
                ],
                reservationId: firstReservation.id,
                paymentMethodId: yapeMethod.id,
              },
              {
                amount: 90.0,
                status: PaymentStatus.PENDING,
                proofImages: [],
                reservationId: secondReservation.id,
                paymentMethodId: plinMethod.id,
              },
            ];

            try {
              for (const paymentData of payments) {
                await prisma.payment.create({
                  data: paymentData,
                });
              }
              console.log(`✅ Created ${payments.length} payments`);
            } catch (error: unknown) {
              const prismaError = error as { code?: string };
              if (prismaError?.code === "P2021") {
                console.log("⏭️ Tabla payments no existe, omitiendo pagos...");
              } else {
                throw error;
              }
            }
          }
        }

        // ================================
        // 15. CREATE NOTIFICATIONS
        // ================================
        console.log("🔔 Creating notifications...");

        const ownerUser = createdUsers.find(
          (u) => u.email === "owner@myapp.com"
        );

        if (ownerUser && clientUserForNotif) {
          const notifications = [
            {
              title: "Nueva Reserva Pendiente",
              message:
                "Tienes una nueva reserva pendiente de verificación de pago",
              type: NotificationType.PAYMENT_TO_VERIFY,
              isRead: false,
              userId: ownerUser.id,
            },
            {
              title: "Reserva Confirmada",
              message: "Tu reserva ha sido confirmada exitosamente",
              type: NotificationType.RESERVATION_CONFIRMED,
              isRead: true,
              userId: clientUserForNotif.id,
            },
          ];

          for (const notificationData of notifications) {
            await prisma.notification.create({
              data: notificationData,
            });
          }
          console.log(`✅ Created ${notifications.length} notifications`);
        } else {
          console.log("⚠️ Missing owner or client user, skipping notifications");
        }
      }
    }
  }

  console.log("✅ Multitenant seed finished successfully!");

  const safeCount = async (_name: string, fn: () => Promise<number>) => {
    try {
      return await fn();
    } catch (error: unknown) {
      if ((error as { code?: string })?.code === "P2021") return 0;
      throw error;
    }
  };

  const sportCenterCount = await safeCount("sport_centers", () =>
    prisma.sportCenter.count()
  );
  const fieldCount = await safeCount("fields", () => prisma.field.count());
  const reservationCount = await safeCount("reservations", () =>
    prisma.reservation.count()
  );
  const paymentCount = await safeCount("payments", () =>
    prisma.payment.count()
  );
  const notificationCount = await safeCount("notifications", () =>
    prisma.notification.count()
  );

  console.log(`
📊 Summary:
- Tenants: 2 (MyApp Platform [my-app], Demo Corporation [demo-corp])
- Users: ${createdUsers.length} users across both tenants
- Roles: 4 per tenant (sys_admin, tenant_admin, tenant_staff, client)
- Permissions: ${createdPermissions.length} permissions
- Features: ${createdFeatures.length} features
- Payment Methods: ${createdPaymentMethods.length} payment methods
- Sport Centers: ${sportCenterCount} (Palacio de la Juventud, VIDENA, María Reiche)
- Fields: ${fieldCount} (canchas en centros + individuales)
- Reservations: ${reservationCount} reservations
- Payments: ${paymentCount} payments
- Notifications: ${notificationCount} notifications

🔐 Login Credentials:

🔧 System Level:
- System Admin: sys_admin@reservo.com / SysAdmin123!@#

🏢 MyApp Platform (Tenant: my-app):
- Tenant Admin: admin@cancha1.com / Admin123!@#
- Tenant Staff: staff@cancha1.com / Staff123!@#
- Owner: owner@myapp.com / Owner123!@#
- Owner 2: owner2@myapp.com / Owner123!@#
- Client: cliente@test.com / Cliente123!@#
- Client: user@myapp.com / User123!@#
- Client: maria@myapp.com / Maria123!@#

🏢 Demo Corporation (Tenant: demo-corp):
- Tenant Admin: admin@cancha2.com / Admin123!@#
- Client: user@democorp.com / DemoUser123!@#

${fieldCount === 0 || reservationCount === 0 ? "⚠️ Si faltan canchas o reservas, ejecuta: npx prisma migrate dev" : ""}
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
