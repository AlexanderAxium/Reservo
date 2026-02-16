# Guía Completa: Sistema de Roles, Permisos y Usuarios (RBAC)

Documentación técnica del sistema RBAC con fragmentos de código, implementación de páginas y flujos completos.

---

## Índice

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Modelo de Datos](#2-modelo-de-datos)
3. [Roles y Permisos por Defecto](#3-roles-y-permisos-por-defecto)
4. [Flujo de Autenticación y Autorización](#4-flujo-de-autenticación-y-autorización)
5. [Capas de Protección](#5-capas-de-protección)
6. [Implementación en Backend (tRPC)](#6-implementación-en-backend-trpc)
7. [Página de Roles - Implementación Técnica](#7-página-de-roles---implementación-técnica)
8. [Página de Usuarios - Implementación Técnica](#8-página-de-usuarios---implementación-técnica)
9. [Página/Gestión de Permisos - Implementación Técnica](#9-páginagestión-de-permisos---implementación-técnica)
10. [Procedimientos de Inicialización](#10-procedimientos-de-inicialización)
11. [Buenas Prácticas y Seguridad](#11-buenas-prácticas-y-seguridad)

---

## 1. Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE PRESENTACIÓN                           │
├─────────────────────────────────────────────────────────────────────────┤
│  ProtectedRoute  │  RoleBasedRedirect  │  useRBAC  │  useUserRole       │
│  (auth básica)   │  (redirección)      │  (permisos)│  (rol primario)   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE API (tRPC)                             │
├─────────────────────────────────────────────────────────────────────────┤
│  protectedProcedure  │  adminProcedure  │  superAdminProcedure          │
│  (usuario autenticado)│  (admin+)       │  (super_admin solo)           │
│                                                                         │
│  hasPermission(userId, action, resource) en cada procedimiento          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CAPA DE SERVICIO (RBAC)                           │
├─────────────────────────────────────────────────────────────────────────┤
│  rbacService.ts                                                         │
│  - getUserRBACData, hasPermission, hasRole                               │
│  - assignRole, removeRole, createRole                                    │
│  - assignPermissionToRole, getRolePermissions                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE DATOS                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  User  │  Role  │  Permission  │  UserRole  │  RolePermission           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Flujo de Decisión de Acceso

1. **Usuario no autenticado** → Redirigir a login
2. **Usuario autenticado sin rol** → Redirigir según contexto (landing, planes)
3. **Usuario con rol** → Verificar permiso específico para la acción
4. **Permiso denegado** → 403 Forbidden o redirección

---

## 2. Modelo de Datos

### Esquema Prisma (resumen)

```prisma
// Usuario (Better Auth)
model User {
  id            String
  name          String
  email         String   @unique
  emailVerified Boolean
  // ... otros campos
  userRoles     UserRole[]
}

// Rol
model Role {
  id              String
  name            String   @unique      // "super_admin", "admin", "trader", "viewer"
  displayName     String               // "Super Administrador"
  description     String?
  isActive        Boolean  @default(true)
  isSystem        Boolean  @default(false)  // No se puede eliminar
  userRoles       UserRole[]
  rolePermissions RolePermission[]
}

// Permiso (acción + recurso)
model Permission {
  id          String
  action      PermissionAction    // CREATE, READ, UPDATE, DELETE, MANAGE
  resource    PermissionResource  // USER, ROLE, TRADING_ACCOUNT, TRADE, etc.
  description String?
  isActive    Boolean
  rolePermissions RolePermission[]
  @@unique([action, resource])
}

// Asignación Usuario-Rol (N:M)
model UserRole {
  id         String
  userId     String
  roleId     String
  assignedAt DateTime
  assignedBy String?    // Quién asignó
  expiresAt  DateTime?  // Roles temporales
  @@unique([userId, roleId])
}

// Asignación Rol-Permiso (N:M)
model RolePermission {
  id           String
  roleId       String
  permissionId String
  @@unique([roleId, permissionId])
}
```

### Enums

**PermissionAction:** `CREATE`, `READ`, `UPDATE`, `DELETE`, `MANAGE`

**PermissionResource:** `USER`, `ROLE`, `PERMISSION`, `TRADING_ACCOUNT`, `TRADE`, `PROPFIRM`, `BROKER`, `SYMBOL`, `SUBSCRIPTION`, `DASHBOARD`, `ADMIN`

---

## 3. Roles y Permisos por Defecto

### Roles del Seed

| Rol         | Nombre interno | Descripción                          | isSystem |
|------------|----------------|--------------------------------------|----------|
| Super Admin| `super_admin`  | Acceso total, gestiona roles         | true     |
| Admin      | `admin`        | Gestión de usuarios y config         | true     |
| Moderator  | `moderator`    | Lectura y edición limitada           | false    |
| Trader     | `trader`       | Cuentas, trades, dashboard           | true     |
| Viewer     | `viewer`       | Solo lectura                         | true     |

### Jerarquía de Roles (para redirección)

```
super_admin > admin > trader > viewer
```

### Permisos por Rol (resumen)

- **super_admin**: Todos los permisos
- **admin**: Todos excepto `ROLE.MANAGE` (no puede asignar/crear roles de alto nivel)
- **moderator**: USER (sin DELETE), DASHBOARD, TRADE.READ, TRADING_ACCOUNT.READ
- **trader**: DASHBOARD, TRADING_ACCOUNT.*, TRADE.*, PROPFIRM.READ, BROKER.READ, SYMBOL.READ
- **viewer**: Solo READ en DASHBOARD, TRADE, TRADING_ACCOUNT, PROPFIRM, BROKER, SYMBOL

---

## 4. Flujo de Autenticación y Autorización

### 4.1 Autenticación (Better Auth)

- Login con email/password o OAuth (Google)
- Sesión en cookies
- `auth.api.getSession({ headers })` para obtener el usuario actual

### 4.2 Asignación Inicial de Rol

- **Email/Password**: Al registrarse, el usuario no tiene rol hasta verificar email.
- **Google OAuth**: En `auth.ts` callback `signIn`, si el usuario no tiene roles, se asigna `trader` por defecto.
- **Paddle (pago)**: Tras pago exitoso, se asigna rol `trader` si no lo tiene.

### 4.3 Cómo se Resuelve el Rol Primario

En `useUserRole`:

1. Se obtienen los roles del usuario desde `useRBAC` (tRPC `rbac.getRBACContext`)
2. Se aplica jerarquía: `super_admin` > `admin` > `trader` > `viewer`
3. Se devuelve el rol de mayor prioridad como `primaryRole`

---

## 5. Capas de Protección

### 5.1 Capa 1: Rutas Protegidas (Frontend)

**ProtectedRoute** (`src/components/ProtectedRoute.tsx`)

- Verifica solo si el usuario está autenticado
- Si no está autenticado → redirige a `/`
- Uso: envolver páginas que requieren login

```tsx
<ProtectedRoute>
  <MiPaginaProtegida />
</ProtectedRoute>
```

### 5.2 Capa 2: Redirección por Rol (Frontend)

**RoleBasedRedirect** (`src/components/RoleBasedRedirect.tsx`)

- Se usa en el layout principal
- Redirige según `primaryRole` y `pathname`:
  - `/dashboard` → solo `super_admin` y `admin`
  - `/trader` → solo `trader` (y admin/super_admin van a dashboard)
  - Usuarios sin rol → no redirige (pueden estar en landing)

### 5.3 Capa 3: Permisos en UI (Frontend)

**useRBAC** (`src/hooks/useRBAC.ts`)

- `hasPermission(action, resource)` - un permiso específico
- `hasRole(roleName)`, `hasAnyRole(roleNames)`
- `canManageUsers`, `canManageRoles`, `canAccessAdmin`, etc.

Uso en componentes:

```tsx
const { canManageUsers, hasPermission } = useRBAC();

if (canManageUsers) {
  // Mostrar botón de gestión de usuarios
}

if (hasPermission(PermissionAction.DELETE, PermissionResource.TRADE)) {
  // Mostrar botón eliminar trade
}
```

### 5.4 Capa 4: Procedimientos tRPC

- **publicProcedure**: No requiere autenticación
- **protectedProcedure**: Requiere usuario autenticado
- **adminProcedure**: Requiere rol admin o super_admin
- **superAdminProcedure**: Requiere rol super_admin

Además, en cada procedimiento se usa `hasPermission(ctx.user.id, action, resource)` para control fino.

### 5.5 Capa 5: API Routes (Next.js)

Para rutas en `app/api/` se pueden usar los middlewares de `src/middlewares/rbac.ts`:

```ts
import { requireAdmin, requirePermission } from "@/middlewares/rbac";
import { PermissionAction, PermissionResource } from "@/types/rbac";

// Ejemplo: requerir admin
const checkAdmin = requireAdmin();

// Ejemplo: requerir permiso específico
const checkPermission = requirePermission(
  PermissionAction.MANAGE,
  PermissionResource.USER
);
```

---

## 6. Implementación en Backend (tRPC)

### 6.1 Patrón en Routers

Cada procedimiento que opera sobre datos de otros usuarios debe:

1. Verificar que el usuario está autenticado (`protectedProcedure`)
2. Verificar permiso con `hasPermission` o equivalente
3. Si accede a datos de otro usuario, comprobar `canManageUsers` o permiso equivalente

Ejemplo (user router):

```ts
getById: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    // Usuario puede verse a sí mismo, o necesita MANAGE USER
    if (input.id !== ctx.user.id) {
      const canManageUsers = await hasPermission(
        ctx.user.id,
        PermissionAction.MANAGE,
        PermissionResource.USER
      );
      if (!canManageUsers) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver este usuario",
        });
      }
    }
    return await prisma.user.findUnique({ where: { id: input.id } });
  }),
```

### 6.2 Ejemplo Completo: user.getById con Verificación de Permiso

```ts
// src/server/routers/user.ts
getById: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    // Usuario puede verse a sí mismo sin permiso adicional
    if (input.id === ctx.user.id) {
      return await prisma.user.findUnique({
        where: { id: input.id },
        select: { id: true, email: true, name: true, /* ... */ },
      });
    }
    // Ver otro usuario requiere MANAGE USER
    const canManage = await hasPermission(
      ctx.user.id,
      PermissionAction.MANAGE,
      PermissionResource.USER
    );
    if (!canManage) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No tienes permisos para ver este usuario",
      });
    }
    return await prisma.user.findUnique({
      where: { id: input.id },
      select: { id: true, email: true, name: true, /* ... */ },
    });
  }),
```

### 6.3 Routers que Usan RBAC

| Router | Permiso típico | Uso |
|--------|----------------|-----|
| `user.ts` | MANAGE USER | Ver/editar otros usuarios, asignar roles |
| `subscription.ts` | READ/MANAGE USER | Ver suscripciones de otros |
| `payment.ts` | READ/MANAGE USER | Ver pagos de otros |
| `tradingAccount.ts` | READ USER | Ver cuentas de otros |
| `trade.ts` | READ USER | Ver trades de otros |
| `propfirm.ts` | READ/MANAGE PROPFIRM | CRUD propfirms |
| `rbac.ts` | ROLE.MANAGE, PERMISSION.CREATE | Gestión de roles y permisos |

---

## 7. Página de Roles - Implementación Técnica

**Ruta:** `/dashboard/roles`  
**Archivo:** `src/app/(authenticated)/dashboard/roles/page.tsx`

### 7.1 Requisitos de Acceso

- Solo visible para `super_admin` y `admin` (en `DashboardSidebar`)
- Acciones de crear/editar/eliminar requieren `canManageRoles` (permiso `ROLE.MANAGE` o superior)

### 7.2 API tRPC Utilizada

```ts
// Queries
trpc.rbac.getRoles.useQuery()
trpc.rbac.getAllPermissions.useQuery()
trpc.rbac.getRolePermissions.useQuery({ roleId })

// Mutations
trpc.rbac.createRole.useMutation()
trpc.rbac.updateRole.useMutation()
trpc.rbac.deleteRole.useMutation()
trpc.rbac.assignPermissionToRole.useMutation()
trpc.rbac.removePermissionFromRole.useMutation()
```

### 7.3 Schema de Validación (Zod)

```ts
const roleSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  displayName: z.string().min(2, "Nombre de visualización debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  isActive: z.boolean(),
});
```

### 7.4 Configuración de Permisos para UI

```ts
const permissionConfig = {
  CREATE: { label: "Crear", color: "bg-green-100 text-green-800" },
  READ: { label: "Leer", color: "bg-blue-100 text-blue-800" },
  UPDATE: { label: "Actualizar", color: "bg-yellow-100 text-yellow-800" },
  DELETE: { label: "Eliminar", color: "bg-red-100 text-red-800" },
  MANAGE: { label: "Gestionar", color: "bg-purple-100 text-purple-800" },
};

const resourceConfig = {
  USER: { label: "Usuarios", icon: "👤" },
  ROLE: { label: "Roles", icon: "🎭" },
  PERMISSION: { label: "Permisos", icon: "🔐" },
  TRADING_ACCOUNT: { label: "Cuentas", icon: "💼" },
  TRADE: { label: "Trades", icon: "📈" },
  PROPFIRM: { label: "Propfirms", icon: "🏢" },
  BROKER: { label: "Brokers", icon: "🏛️" },
  SYMBOL: { label: "Símbolos", icon: "📊" },
  SUBSCRIPTION: { label: "Suscripciones", icon: "💳" },
  DASHBOARD: { label: "Dashboard", icon: "📊" },
  ADMIN: { label: "Admin", icon: "⚙️" },
};
```

### 7.5 Flujo: Crear Rol

```tsx
const createRole = trpc.rbac.createRole.useMutation({
  onSuccess: () => {
    refetch();
    setIsCreateDialogOpen(false);
    form.reset();
  },
  onError: (error) => console.error(error.message),
});

const onSubmit = (data: RoleFormData) => {
  if (editingRole) {
    updateRole.mutate({ id: editingRole.id, ...data });
  } else {
    createRole.mutate(data);
  }
};
```

### 7.6 Flujo: Asignar Permiso a Rol

```tsx
// 1. Obtener permisos del rol actual
const { data: rolePermissions = [] } = trpc.rbac.getRolePermissions.useQuery(
  { roleId: viewingRole?.id || "" },
  { enabled: !!viewingRole?.id }
);

// 2. Asignar permiso
assignPermission.mutate({
  roleId: viewingRole.id,
  permissionId: permissionId,
});

// 3. Remover permiso
removePermission.mutate({
  roleId: viewingRole.id,
  permissionId: rolePermission.permission.id,
});
```

### 7.7 Estructura de Datos de Rol

```ts
type Role = {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  userRoles?: Array<{ id: string; user: { name: string; email: string } }>;
};
```

### 7.8 Protección de Acciones

```tsx
const { canManageRoles } = useRBAC();

// Botón crear rol
{canManageRoles && (
  <Button onClick={handleCreate}>
    <Plus className="h-4 w-4 mr-1.5" />
    Nuevo Rol
  </Button>
)}

// Deshabilitar eliminar para roles de sistema
disabled: (role: Role) => role.isSystem
```

---

## 8. Página de Usuarios - Implementación Técnica

**Ruta:** `/dashboard/users`  
**Archivo:** `src/app/(authenticated)/dashboard/users/page.tsx`

### 8.1 Requisitos de Acceso

- Visible para admin y viewer (con comportamientos distintos)
- Crear/editar/eliminar requiere `canManageUsers` (permiso `USER.MANAGE`)

### 8.2 API tRPC Utilizada

```ts
// Queries
trpc.user.getAll.useQuery(queryParams)  // Paginado
trpc.user.getById.useQuery({ id })
trpc.user.getUserRoles.useQuery({ userId })
trpc.rbac.getRoles.useQuery()

// Mutations
trpc.user.create.useMutation()
trpc.user.update.useMutation()
trpc.user.delete.useMutation()
trpc.user.assignRole.useMutation()
trpc.user.removeRole.useMutation()
```

### 8.3 Schema de Validación

```ts
const updateUserSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  password: z.string().optional().refine((v) => !v || v.length >= 6, {
    message: "Contraseña debe tener al menos 6 caracteres",
  }),
});

const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  phone: z.string().optional(),
  language: z.enum(["ES", "EN", "PT"]).optional(),
  defaultRiskPercentage: z.number().min(0.01).max(100).optional(),
});
```

### 8.4 Componente: Celda de Roles en Tabla

```tsx
function UserRolesCell({ userId }: { userId: string }) {
  const { data: userRoles, isLoading } = trpc.user.getUserRoles.useQuery(
    { userId },
    { staleTime: 30000, refetchOnWindowFocus: false }
  );

  if (isLoading) return <span className="text-muted-foreground">Cargando...</span>;
  if (!userRoles?.length) return <span className="text-muted-foreground">Sin roles</span>;

  const activeRoles = userRoles.filter((r) => r.isActive);
  return (
    <div className="flex flex-wrap gap-1">
      {activeRoles.slice(0, 2).map((ur) => (
        <Badge key={ur.id} variant="secondary" className="bg-blue-100 text-blue-800">
          {ur.roleDisplayName}
        </Badge>
      ))}
      {activeRoles.length > 2 && (
        <Badge variant="outline">+{activeRoles.length - 2}</Badge>
      )}
    </div>
  );
}
```

### 8.5 Componente: Gestión de Roles en Edición

```tsx
function UserRolesManager({ userId }: { userId: string }) {
  const { data: availableRoles = [] } = trpc.rbac.getRoles.useQuery();
  const { data: userRoles, refetch } = trpc.user.getUserRoles.useQuery(
    { userId },
    { enabled: !!userId }
  );
  const assignRole = trpc.user.assignRole.useMutation({ onSuccess: () => refetch() });
  const removeRole = trpc.user.removeRole.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="space-y-4">
      {/* Roles asignados */}
      {userRoles?.map((ur) => (
        <div key={ur.id} className="flex justify-between p-2 bg-muted rounded">
          <span>{ur.roleDisplayName}</span>
          <Button size="sm" variant="destructive" onClick={() => removeRole.mutate({ userId, roleId: ur.roleId })}>
            <UserX className="h-3 w-3" />
          </Button>
        </div>
      ))}
      {/* Roles disponibles para asignar */}
      {availableRoles
        .filter((r) => r.isActive && !userRoles?.some((ur) => ur.roleId === r.id))
        .map((role) => (
          <Button key={role.id} size="sm" onClick={() => assignRole.mutate({ userId, roleId: role.id })}>
            <UserCheck className="h-3 w-3 mr-1" />
            {role.displayName}
          </Button>
        ))}
    </div>
  );
}
```

### 8.6 Flujo: Crear Usuario con Roles Iniciales

```tsx
const createUser = trpc.user.create.useMutation();
const assignRoleMutation = trpc.user.assignRole.useMutation();

const handleDialogSubmit = async (data) => {
  if (!dialogUser?.id) {
    const newUser = await createUser.mutateAsync(data);
    if (data.selectedRoles?.length) {
      for (const roleId of data.selectedRoles) {
        await assignRoleMutation.mutateAsync({
          userId: newUser.id,
          roleId,
        });
      }
    }
  } else {
    updateUser.mutate(data);
  }
};
```

### 8.7 Protección de Acciones por Usuario

```tsx
const { canManageUsers } = useRBAC();
const { user: currentUser } = useAuthContext();

// Mostrar editar/eliminar solo si: es admin O es el propio usuario
hidden: (user) => !(canManageUsers || user.id === currentUser?.id)
```

---

## 9. Página/Gestión de Permisos - Implementación Técnica

**Nota:** No existe una página independiente de permisos. La gestión se realiza desde la página de Roles (Ver Detalles → Gestionar Permisos).

### 9.1 Ubicación en el Flujo

1. Ir a **Dashboard → Roles y Permisos**
2. Clic en **Ver Detalles** de un rol
3. Sección **Permisos Asignados** → botón **Gestionar**

### 9.2 API para Permisos

```ts
// Listar todos los permisos (agrupados por recurso)
trpc.rbac.getAllPermissions.useQuery()
// Respuesta: { data: Permission[], pagination: {...} }

// Permisos de un rol
trpc.rbac.getRolePermissions.useQuery({ roleId })

// Asignar/remover
trpc.rbac.assignPermissionToRole.useMutation({ roleId, permissionId })
trpc.rbac.removePermissionFromRole.useMutation({ roleId, permissionId })
```

### 9.3 Estructura de Permiso

```ts
type Permission = {
  id: string;
  action: "CREATE" | "READ" | "UPDATE" | "DELETE" | "MANAGE";
  resource: "USER" | "ROLE" | "TRADING_ACCOUNT" | "TRADE" | "PROPFIRM" | "BROKER" | "SYMBOL" | "SUBSCRIPTION" | "DASHBOARD" | "ADMIN";
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

### 9.4 Lógica de Asignación Masiva

```tsx
const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

const handleAssignPermissions = () => {
  if (viewingRole && selectedPermissions.length > 0) {
    selectedPermissions.forEach((permissionId) => {
      assignPermission.mutate({
        roleId: viewingRole.id,
        permissionId,
      });
    });
    setSelectedPermissions([]);
    setIsManagePermissionsOpen(false);
  }
};

const handlePermissionToggle = (permissionId: string) => {
  setSelectedPermissions((prev) =>
    prev.includes(permissionId)
      ? prev.filter((id) => id !== permissionId)
      : [...prev, permissionId]
  );
};
```

### 9.5 Crear Página Independiente de Permisos (Opcional)

Si necesitas una vista de solo lectura de todos los permisos:

```tsx
// src/app/(authenticated)/dashboard/permissions/page.tsx
"use client";

import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/utils/trpc";

export default function PermissionsPage() {
  const { canManageRoles } = useRBAC();
  const { data: response, isLoading } = trpc.rbac.getAllPermissions.useQuery();
  const permissions = response?.data || [];

  // Agrupar por resource
  const grouped = permissions.reduce((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = [];
    acc[p.resource].push(p);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Permisos del Sistema</h1>
      <p className="text-muted-foreground">
        Lista de permisos disponibles. Se asignan a roles desde la página de Roles.
      </p>
      {Object.entries(grouped).map(([resource, perms]) => (
        <div key={resource} className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">{resource}</h3>
          <div className="flex flex-wrap gap-2">
            {perms.map((p) => (
              <Badge key={p.id} variant="secondary">
                {p.action}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

Luego añadir en `DashboardSidebar` (dentro del bloque admin):

```ts
{
  title: "Permisos",
  href: "/dashboard/permissions",
  icon: Shield,
  description: "Ver permisos del sistema",
},
```

### 9.6 Backend: Crear Nuevo Permiso (Solo desde Seed o Admin)

Los permisos se crean típicamente en el seed. Para crearlos dinámicamente:

```ts
// rbacService.ts
export async function createPermission(data: {
  action: PermissionAction;
  resource: PermissionResource;
  description?: string;
}) {
  return await prisma.permission.create({
    data: {
      action: data.action,
      resource: data.resource,
      description: data.description,
    },
  });
}
```

El router `rbac.createPermission` ya existe y requiere `adminProcedure` + permiso `PERMISSION.CREATE`.

---

## 10. Procedimientos de Inicialización

### 10.1 Ejecutar Seed (Roles y Permisos)

```bash
pnpm db:seed
```

Crea: permisos, roles (super_admin, admin, moderator, trader, viewer), asignaciones role-permission, usuarios de prueba.

### 10.2 Verificar

```bash
pnpm db:studio
```

Revisar: `roles`, `permissions`, `role_permissions`, `user_roles`.

### 10.3 Asignar Rol Programáticamente

```ts
import { assignRole } from "@/services/rbacService";

await assignRole(userId, roleId, assignedBy, expiresAt);
```

O vía tRPC: `user.assignRole` (requiere `USER.MANAGE`).

---

## 11. Buenas Prácticas y Seguridad

### 11.1 Principio de Mínimo Privilegio

- Asignar solo los roles necesarios
- Preferir permisos granulares (READ, UPDATE) sobre MANAGE

### 11.2 Nunca Confiar Solo en el Frontend

- Toda verificación de permisos debe repetirse en el backend
- El frontend solo oculta/muestra UI; la autorización real está en tRPC/API

### 11.3 Procedimientos

- `adminProcedure` para rutas solo de admin
- `protectedProcedure` + `hasPermission` para control fino
- Evitar `publicProcedure` para datos sensibles

### 11.4 Roles del Sistema

- No eliminar roles con `isSystem: true`
- Crear roles personalizados con `isSystem: false`

### 11.5 Cache RBAC

- `useRBAC` usa `staleTime: 5 * 60 * 1000`
- Tras asignar/remover rol, invalidar `rbac.getRBACContext`:

```ts
const utils = trpc.useUtils();
utils.rbac.getRBACContext.invalidate();
```

### 11.6 Vulnerabilidad: Procedimientos RBAC Públicos

**Problema:** `getRBACContext`, `getUserRoles` usan `publicProcedure` y permiten consultar roles de cualquier usuario.

**Corrección recomendada en `rbac.ts`:**

```ts
// Antes
getRBACContext: publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(...)

// Después: restringir a propio usuario o requerir MANAGE USER
getRBACContext: protectedProcedure
  .input(z.object({ userId: z.string().optional() }))
  .query(async ({ input, ctx }) => {
    const targetUserId = input.userId ?? ctx.user.id;
    if (targetUserId !== ctx.user.id) {
      const canManage = await hasPermission(ctx.user.id, PermissionAction.MANAGE, PermissionResource.USER);
      if (!canManage) throw new TRPCError({ code: "FORBIDDEN" });
    }
    return await getRBACContext(targetUserId);
  })
```

### 11.7 Validación de userId en Backend

- Siempre validar permiso antes de operar sobre datos de otro usuario
- No confiar en `input.userId` del cliente; verificar con `ctx.user.id` y `hasPermission`

---

## Resumen de Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `prisma/schema.prisma` | Modelo User, Role, Permission, UserRole, RolePermission |
| `src/types/rbac.ts` | Enums PermissionAction, PermissionResource, DEFAULT_ROLES |
| `src/services/rbacService.ts` | hasPermission, hasRole, assignRole, getRolePermissions, etc. |
| `src/hooks/useRBAC.ts` | Hook para permisos en frontend |
| `src/hooks/useUserRole.ts` | Hook para rol primario (primaryRole) |
| `src/components/ProtectedRoute.tsx` | Protección por autenticación |
| `src/components/RoleBasedRedirect.tsx` | Redirección por rol |
| `src/components/ui/scrollable-table.tsx` | Tabla genérica con acciones (Roles, Usuarios) |
| `src/components/dashboard/DashboardSidebar.tsx` | Navegación por rol (admin ve Users, Roles, etc.) |
| `src/server/trpc.ts` | protectedProcedure, adminProcedure, superAdminProcedure |
| `src/server/routers/rbac.ts` | API tRPC roles/permisos |
| `src/server/routers/user.ts` | API tRPC usuarios (getAll, assignRole, removeRole) |
| `src/app/(authenticated)/dashboard/roles/page.tsx` | Página de Roles |
| `src/app/(authenticated)/dashboard/users/page.tsx` | Página de Usuarios |
| `prisma/seed.ts` | Creación de roles, permisos y asignaciones |

---

## Estructura de Rutas Dashboard

```
/dashboard              → Panel principal (AdminDashboard, ViewerDashboard)
/dashboard/users        → Gestión de usuarios
/dashboard/users/[id]   → Detalle de usuario
/dashboard/roles        → Gestión de roles y permisos (permisos dentro del modal de rol)
/dashboard/propfirms    → Propfirms
/dashboard/brokers      → Brokers
/dashboard/symbols      → Símbolos
/dashboard/symbol-configs → Configuraciones
/dashboard/company-info → Información de empresa
```

La entrada **"Roles y Permisos"** en el sidebar apunta a `/dashboard/roles`. La gestión de permisos se hace desde el diálogo de detalle del rol.

---

## Uso de ScrollableTable

```tsx
import { ScrollableTable, type TableColumn, type TableAction } from "@/components/ui/scrollable-table";

const columns: TableColumn<Role>[] = [
  { key: "role", title: "Rol", render: (_, record) => <div>{record.displayName}</div> },
  { key: "status", title: "Estado", render: (_, record) => <Badge>{record.isActive ? "Activo" : "Inactivo"}</Badge> },
];

const actions: TableAction<Role>[] = [
  { label: "Ver", icon: <Eye />, onClick: handleView, variant: "default" },
  { label: "Editar", icon: <Edit />, onClick: handleEdit, variant: "default" },
  { label: "Eliminar", icon: <Trash2 />, onClick: handleDelete, variant: "destructive", disabled: (r) => r.isSystem },
];

<ScrollableTable<Role>
  data={roles}
  columns={columns}
  actions={actions}
  loading={isLoading}
  emptyMessage="No se encontraron roles"
  emptyIcon={<Users />}
/>
```

---

## Checklist de Implementación

- [ ] Ejecutar `pnpm db:seed` para crear roles y permisos
- [ ] Asignar rol inicial a usuarios (Google: trader; Email: tras verificación)
- [ ] Usar `ProtectedRoute` en layout de rutas autenticadas
- [ ] Usar `RoleBasedRedirect` en layout principal
- [ ] Usar `useRBAC` para ocultar/mostrar UI por permiso
- [ ] En cada procedimiento tRPC sensible, llamar `hasPermission`
- [ ] Restringir `getRBACContext` (ver sección 11.6)
- [ ] Proteger acciones de tabla con `canManageUsers`, `canManageRoles`
- [ ] Probar: crear rol → asignar permisos → crear usuario → asignar rol
