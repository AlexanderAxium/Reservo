import {
  NotificationType,
  PaymentStatus,
  PermissionAction,
  PermissionResource,
  PrismaClient,
  ReservationStatus,
  Sport,
  SportCenterStatus,
  WeekDay,
} from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { hashPassword } from "better-auth/crypto";

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

  await prisma.payment.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.fieldFeature.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.operatingSchedule.deleteMany({});
  await prisma.field.deleteMany({});
  await prisma.sportCenter.deleteMany({});
  await prisma.userRole.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.translation.deleteMany({}); // i18n translations
  await prisma.rolePermission.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.tenant.deleteMany({});
  // Note: We don't delete locales, features, or payment methods as they are shared system data

  console.log("✅ All data cleared successfully");

  // ================================
  // 2. CREATE TENANTS
  // ================================
  console.log("🏢 Creating tenants...");

  // Create default tenant
  const defaultTenant = await prisma.tenant.create({
    data: {
      id: "tenant-default-001",
      name: "MyApp",
      displayName: "My Application Platform",
      description:
        "Una plataforma moderna y escalable para gestión de usuarios y contenido",
      email: "info@myapp.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business Street",
      city: "New York",
      country: "USA",
      website: "https://myapp.com",
      facebookUrl: "https://facebook.com/myapp",
      twitterUrl: "https://twitter.com/myapp",
      instagramUrl: "https://instagram.com/myapp",
      linkedinUrl: "https://linkedin.com/company/myapp",
      youtubeUrl: "https://youtube.com/myapp",
      foundedYear: 2024,
      logoUrl: "/images/logo.png",
      faviconUrl: "/favicon.ico",
      metaTitle: "MyApp - Plataforma de Gestión Moderna",
      metaDescription:
        "Gestiona usuarios, contenido y configura tu plataforma de manera eficiente",
      metaKeywords: "gestión, usuarios, plataforma, moderno, escalable",
      termsUrl: "/terms",
      privacyUrl: "/privacy",
      cookiesUrl: "/cookies",
      complaintsUrl: "/complaints",
    },
  });

  // Create demo tenant
  const demoTenant = await prisma.tenant.create({
    data: {
      id: "tenant-demo-002",
      name: "DemoCorp",
      displayName: "Demo Corporation",
      description: "Empresa de demostración para pruebas",
      email: "info@democorp.com",
      phone: "+1 (555) 999-8888",
      address: "456 Demo Avenue",
      city: "San Francisco",
      country: "USA",
      website: "https://democorp.com",
      foundedYear: 2023,
      logoUrl: "/images/demo-logo.png",
      faviconUrl: "/favicon-demo.ico",
      metaTitle: "DemoCorp - Empresa de Demostración",
      metaDescription: "Plataforma de demostración para pruebas y desarrollo",
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

    // Review permissions
    { action: PermissionAction.CREATE, resource: PermissionResource.REVIEW },
    { action: PermissionAction.READ, resource: PermissionResource.REVIEW },
    { action: PermissionAction.UPDATE, resource: PermissionResource.REVIEW },
    { action: PermissionAction.DELETE, resource: PermissionResource.REVIEW },
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
      superAdmin: await prisma.role.create({
        data: {
          name: "super_admin",
          displayName: "Super Admin",
          description: "Full system access with all permissions",
          isSystem: true,
          tenantId: tenant.id,
        },
      }),
      admin: await prisma.role.create({
        data: {
          name: "admin",
          displayName: "Admin",
          description:
            "Administrative access to manage users and system settings",
          isSystem: true,
          tenantId: tenant.id,
        },
      }),
      moderator: await prisma.role.create({
        data: {
          name: "moderator",
          displayName: "Moderator",
          description: "User management and basic system monitoring",
          isSystem: true,
          tenantId: tenant.id,
        },
      }),
      user: await prisma.role.create({
        data: {
          name: "user",
          displayName: "User",
          description: "Standard user with basic access",
          isSystem: true,
          tenantId: tenant.id,
        },
      }),
      owner: await prisma.role.create({
        data: {
          name: "owner",
          displayName: "Owner",
          description:
            "Dueño de canchas deportivas con acceso a gestión de campos y reservas",
          isSystem: true,
          tenantId: tenant.id,
        },
      }),
      viewer: await prisma.role.create({
        data: {
          name: "viewer",
          displayName: "Viewer",
          description: "Read-only access to basic features",
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

    // Super Admin gets all permissions for this tenant
    for (const permission of tenantPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: tenantRoles.superAdmin.id,
          permissionId: permission.id,
        },
      });
    }

    // Admin gets most permissions except role management
    const adminPermissions = tenantPermissions.filter(
      (p) =>
        p.resource !== PermissionResource.ROLE ||
        p.action !== PermissionAction.MANAGE
    );
    for (const permission of adminPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: tenantRoles.admin.id,
          permissionId: permission.id,
        },
      });
    }

    // Moderator gets user read and basic dashboard
    const moderatorPermissions = tenantPermissions.filter(
      (p) =>
        (p.resource === PermissionResource.USER &&
          (p.action === PermissionAction.READ ||
            p.action === PermissionAction.UPDATE)) ||
        p.resource === PermissionResource.DASHBOARD
    );
    for (const permission of moderatorPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: tenantRoles.moderator.id,
          permissionId: permission.id,
        },
      });
    }

    // User gets dashboard access
    const standardUserPermissions = tenantPermissions.filter(
      (p) => p.resource === PermissionResource.DASHBOARD
    );
    for (const permission of standardUserPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: tenantRoles.user.id,
          permissionId: permission.id,
        },
      });
    }

    // Owner gets FIELD and RESERVATION permissions
    const ownerPermissions = tenantPermissions.filter(
      (p) =>
        (p.resource === PermissionResource.FIELD &&
          (p.action === PermissionAction.CREATE ||
            p.action === PermissionAction.READ ||
            p.action === PermissionAction.UPDATE ||
            p.action === PermissionAction.DELETE ||
            p.action === PermissionAction.MANAGE)) ||
        (p.resource === PermissionResource.RESERVATION &&
          (p.action === PermissionAction.READ ||
            p.action === PermissionAction.UPDATE ||
            p.action === PermissionAction.MANAGE)) ||
        (p.resource === PermissionResource.DASHBOARD &&
          p.action === PermissionAction.READ)
    );
    for (const permission of ownerPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: tenantRoles.owner.id,
          permissionId: permission.id,
        },
      });
    }

    // Viewer gets only dashboard read
    const viewerPermissions = tenantPermissions.filter(
      (p) =>
        p.resource === PermissionResource.DASHBOARD &&
        p.action === PermissionAction.READ
    );
    for (const permission of viewerPermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: tenantRoles.viewer.id,
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
    // Default tenant users
    {
      name: "Super Admin",
      email: "superadmin@myapp.com",
      password: "SuperAdmin123!@#",
      phone: "+1 (555) 000-0001",
      language: "EN" as const,
      tenantId: defaultTenant.id,
      roleName: "super_admin",
      username: "superadmin",
    },
    {
      name: "Admin User",
      email: "admin@myapp.com",
      password: "Admin123!@#",
      phone: "+1 (555) 000-0002",
      language: "EN" as const,
      tenantId: defaultTenant.id,
      roleName: "admin",
      username: "admin",
    },
    {
      name: "Moderator User",
      email: "moderator@myapp.com",
      password: "Moderator123!@#",
      phone: "+1 (555) 000-0003",
      language: "ES" as const,
      tenantId: defaultTenant.id,
      roleName: "moderator",
      username: "moderator",
    },
    {
      name: "John Doe",
      email: "user@myapp.com",
      password: "User123!@#",
      phone: "+1 (555) 987-6543",
      language: "EN" as const,
      tenantId: defaultTenant.id,
      roleName: "user",
      username: "johndoe",
    },
    {
      name: "Maria Rodriguez",
      email: "maria@myapp.com",
      password: "Maria123!@#",
      phone: "+1 (555) 123-4567",
      language: "ES" as const,
      tenantId: defaultTenant.id,
      roleName: "user",
      username: "mariarodriguez",
    },
    {
      name: "Carlos Sport Owner",
      email: "owner@myapp.com",
      password: "Owner123!@#",
      phone: "+1 (555) 111-2222",
      language: "ES" as const,
      tenantId: defaultTenant.id,
      roleName: "owner",
      username: "carlosowner",
    },
    {
      name: "María Cancha Owner",
      email: "owner2@myapp.com",
      password: "Owner123!@#",
      phone: "+1 (555) 111-2223",
      language: "ES" as const,
      tenantId: defaultTenant.id,
      roleName: "owner",
      username: "mariacancha",
    },
    {
      name: "Viewer User",
      email: "viewer@myapp.com",
      password: "Viewer123!@#",
      phone: "+1 (555) 000-0004",
      language: "EN" as const,
      tenantId: defaultTenant.id,
      roleName: "viewer",
      username: "viewer",
    },
    // Demo tenant users
    {
      name: "Demo Admin",
      email: "admin@democorp.com",
      password: "DemoAdmin123!@#",
      phone: "+1 (555) 999-0001",
      language: "EN" as const,
      tenantId: demoTenant.id,
      roleName: "admin",
      username: "demoadmin",
    },
    {
      name: "Demo User",
      email: "user@democorp.com",
      password: "DemoUser123!@#",
      phone: "+1 (555) 999-0002",
      language: "EN" as const,
      tenantId: demoTenant.id,
      roleName: "user",
      username: "demouser",
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
        super_admin: "superAdmin",
        admin: "admin",
        moderator: "moderator",
        user: "user",
        owner: "owner",
        viewer: "viewer",
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
  // 8. CREATE FIELDS (Canchas Individuales)
  // ================================
  console.log("⚽ Creating individual fields...");

  // Get owner users
  const ownerUser = createdUsers.find((u) => u.email === "owner@myapp.com");
  const ownerUser2 = createdUsers.find((u) => u.email === "owner2@myapp.com");
  if (!ownerUser || !ownerUser2) {
    console.log("⚠️ Owner users not found, skipping fields");
  } else {
    // Canchas individuales con ubicación completa (Opción 7 - Híbrida)
    const fields = [
      {
        name: "Cancha de Fútbol - San Isidro",
        sport: Sport.FOOTBALL,
        price: 80.0,
        available: true,
        images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
        address: "Av. Javier Prado Este 4200",
        city: "Lima",
        district: "San Isidro",
        latitude: -12.0969,
        longitude: -77.0338,
        googleMapsUrl: "https://maps.google.com/?q=-12.0969,-77.0338",
        description:
          "Cancha de fútbol con césped sintético de última generación. Ideal para partidos y entrenamientos.",
        phone: "+51 987 654 321",
        email: "cancha1@reservo.com",
        ownerId: ownerUser.id,
      },
      {
        name: "Cancha de Futsal - Miraflores",
        sport: Sport.FUTSAL,
        price: 60.0,
        available: true,
        images: [
          "https://sport-12.com/wp-content/uploads/2022/02/Cancha-Chapultepec_cuadrado.jpg",
        ],
        address: "Av. Larco 1234",
        city: "Lima",
        district: "Miraflores",
        latitude: -12.1224,
        longitude: -77.0303,
        googleMapsUrl: "https://maps.google.com/?q=-12.1224,-77.0303",
        description:
          "Cancha de futsal techada con piso de calidad profesional. Iluminación LED.",
        phone: "+51 987 654 322",
        email: "cancha2@reservo.com",
        ownerId: ownerUser2.id,
      },
      {
        name: "Cancha de Fútbol - La Molina",
        sport: Sport.FOOTBALL,
        price: 75.0,
        available: true,
        images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
        address: "Av. La Molina 5678",
        city: "Lima",
        district: "La Molina",
        latitude: -12.0759,
        longitude: -76.9475,
        googleMapsUrl: "https://maps.google.com/?q=-12.0759,-76.9475",
        description:
          "Cancha de fútbol con césped natural. Perfecta para partidos de fin de semana.",
        phone: "+51 987 654 323",
        email: "cancha3@reservo.com",
        ownerId: ownerUser.id,
      },
      {
        name: "Cancha de Tenis - Surco",
        sport: Sport.TENNIS,
        price: 50.0,
        available: true,
        images: [
          "https://sport-12.com/wp-content/uploads/2022/02/Cancha-Chapultepec_cuadrado.jpg",
        ],
        address: "Av. Caminos del Inca 3456",
        city: "Lima",
        district: "Santiago de Surco",
        latitude: -12.1355,
        longitude: -76.9904,
        googleMapsUrl: "https://maps.google.com/?q=-12.1355,-76.9904",
        description:
          "Cancha de tenis con superficie de arcilla. Vestuarios y duchas disponibles.",
        phone: "+51 987 654 324",
        email: "cancha4@reservo.com",
        ownerId: ownerUser2.id,
      },
      {
        name: "Cancha de Básquet - San Borja",
        sport: Sport.BASKETBALL,
        price: 70.0,
        available: true,
        images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
        address: "Av. San Borja Norte 789",
        city: "Lima",
        district: "San Borja",
        latitude: -12.0956,
        longitude: -77.0064,
        googleMapsUrl: "https://maps.google.com/?q=-12.0956,-77.0064",
        description:
          "Cancha de básquet techada con piso de parquet. Iluminación profesional.",
        phone: "+51 987 654 325",
        email: "cancha5@reservo.com",
        ownerId: ownerUser.id,
      },
      {
        name: "Cancha de Fútbol - Barranco",
        sport: Sport.FOOTBALL,
        price: 65.0,
        available: true,
        images: [
          "https://sport-12.com/wp-content/uploads/2022/02/Cancha-Chapultepec_cuadrado.jpg",
        ],
        address: "Jr. 28 de Julio 456",
        city: "Lima",
        district: "Barranco",
        latitude: -12.1442,
        longitude: -77.0206,
        googleMapsUrl: "https://maps.google.com/?q=-12.1442,-77.0206",
        description:
          "Cancha de fútbol con césped sintético. Ubicada cerca del malecón.",
        phone: "+51 987 654 326",
        email: "cancha6@reservo.com",
        ownerId: ownerUser2.id,
      },
      {
        name: "Cancha de Vóley - Chorrillos",
        sport: Sport.VOLLEYBALL,
        price: 55.0,
        available: true,
        images: ["https://donpotrero.com/img/posts/2/medidas_lg.jpg"],
        address: "Av. Defensores del Morro 123",
        city: "Lima",
        district: "Chorrillos",
        latitude: -12.1696,
        longitude: -77.0081,
        googleMapsUrl: "https://maps.google.com/?q=-12.1696,-77.0081",
        description:
          "Cancha de vóley playa y sala. Ideal para entrenamientos y partidos.",
        phone: "+51 987 654 327",
        email: "cancha7@reservo.com",
        ownerId: ownerUser.id,
      },
      {
        name: "Cancha de Futsal - Jesús María",
        sport: Sport.FUTSAL,
        price: 58.0,
        available: true,
        images: [
          "https://sport-12.com/wp-content/uploads/2022/02/Cancha-Chapultepec_cuadrado.jpg",
        ],
        address: "Av. Brasil 2345",
        city: "Lima",
        district: "Jesús María",
        latitude: -12.0833,
        longitude: -77.0333,
        googleMapsUrl: "https://maps.google.com/?q=-12.0833,-77.0333",
        description:
          "Cancha de futsal techada con piso sintético. Estacionamiento disponible.",
        phone: "+51 987 654 328",
        email: "cancha8@reservo.com",
        ownerId: ownerUser2.id,
      },
    ];

    const createdFields = [];
    for (const fieldData of fields) {
      const field = await prisma.field.create({
        data: fieldData,
      });
      createdFields.push(field);
      console.log(`   ✅ Created field: ${field.name} (${field.district})`);
    }
    console.log(`✅ Created ${createdFields.length} individual fields`);

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

    // Verify users and fields exist before creating reservations
    if (clientUser && mariaUser && createdFields.length >= 2) {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0);

      const dayAfter = new Date(now);
      dayAfter.setDate(dayAfter.getDate() + 2);
      dayAfter.setHours(19, 0, 0, 0);

      // Ensure fields exist (TypeScript safety)
      const firstField = createdFields[0];
      const secondField = createdFields[1];

      if (!firstField || !secondField) {
        console.log("⚠️ Not enough fields created, skipping reservations");
      } else {
        const reservations = [
          {
            startDate: tomorrow,
            endDate: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // +2 horas
            amount: 160.0,
            status: ReservationStatus.CONFIRMED,
            createdByChatbot: false,
            userId: clientUser.id,
            fieldId: firstField.id,
          },
          {
            startDate: dayAfter,
            endDate: new Date(dayAfter.getTime() + 1.5 * 60 * 60 * 1000), // +1.5 horas
            amount: 90.0,
            status: ReservationStatus.PENDING,
            createdByChatbot: true,
            userId: mariaUser.id,
            fieldId: secondField.id,
          },
        ];

        const createdReservations = [];
        for (const reservationData of reservations) {
          const reservation = await prisma.reservation.create({
            data: reservationData,
          });
          createdReservations.push(reservation);
        }
        console.log(`✅ Created ${createdReservations.length} reservations`);

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

            for (const paymentData of payments) {
              await prisma.payment.create({
                data: paymentData,
              });
            }
            console.log(`✅ Created ${payments.length} payments`);
          }
        }

        // ================================
        // 15. CREATE NOTIFICATIONS
        // ================================
        console.log("🔔 Creating notifications...");

        const ownerUser = createdUsers.find(
          (u) => u.email === "owner@myapp.com"
        );

        if (ownerUser && clientUser) {
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
              userId: clientUser.id,
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
    } else {
      console.log(
        "⚠️ Missing users or fields, skipping reservations and related data"
      );
    }
  }

  console.log("✅ Multitenant seed finished successfully!");
  console.log(`
📊 Summary:
- Tenants: 2 (MyApp Platform, Demo Corporation)
- Users: ${createdUsers.length} users across both tenants
- Roles: 5 per tenant (super_admin, admin, moderator, user, viewer)
- Permissions: ${createdPermissions.length} permissions
- Features: ${createdFeatures.length} features
- Payment Methods: ${createdPaymentMethods.length} payment methods
- Fields (Individual Canchas): ${await prisma.field.count()} fields with individual locations
- Reservations: ${await prisma.reservation.count()} reservations
- Payments: ${await prisma.payment.count()} payments
- Notifications: ${await prisma.notification.count()} notifications

🔐 Login Credentials:

🏢 MyApp Platform (Default Tenant):
- Super Admin: superadmin@myapp.com / SuperAdmin123!@#
- Admin: admin@myapp.com / Admin123!@#
- Moderator: moderator@myapp.com / Moderator123!@#
- User: user@myapp.com / User123!@#
- User: maria@myapp.com / Maria123!@#
- Owner: owner@myapp.com / Owner123!@#
- Owner 2: owner2@myapp.com / Owner123!@#
- Viewer: viewer@myapp.com / Viewer123!@#

🏢 Demo Corporation (Demo Tenant):
- Admin: admin@democorp.com / DemoAdmin123!@#
- User: user@democorp.com / DemoUser123!@#
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
