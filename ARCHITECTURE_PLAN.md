# Plan de Arquitectura: Reestructuración Multi-Tenant de Reservo

## 1. Validación de la Idea

### Lo que propones (resumen)

- **SYS_ADMIN** gestiona tenants (empresas) a nivel global.
- Cada tenant tiene un **TENANT_ADMIN** que administra todo dentro de su tenant: centros deportivos, canchas, reservas, usuarios.
- Aislamiento total entre tenants.
- Tres paneles principales: System Admin, Tenant, Cliente.

### Veredicto: La idea es sólida y necesaria

La arquitectura actual ya tiene la base multi-tenant (cada entidad tiene `tenantId`, el RBAC ya filtra por tenant), pero los roles están mezclados conceptualmente. El rol `owner` actual hace de "admin de tenant" y de "dueño de cancha" al mismo tiempo, y el `admin` actual tiene ambigüedad entre admin global y admin de tenant.

**Tu propuesta resuelve esto correctamente** separando las responsabilidades en capas claras.

---

## 2. Mejoras Propuestas a la Idea Original

### 2.1 Roles Redefinidos

```
UserRoleType (enum en Prisma)
├── SYS_ADMIN        → Administrador del sistema global
├── TENANT_ADMIN     → Administrador de un tenant (antes "owner" + "admin")
├── TENANT_STAFF     → Empleado del tenant (recepcionista, operador)
└── CLIENT           → Cliente final que reserva canchas
```

**¿Por qué agregar TENANT_STAFF?**
En un negocio real de canchas deportivas, el dueño (TENANT_ADMIN) no está solo. Tiene recepcionistas o empleados que necesitan:
- Ver reservas y confirmarlas
- Ver la agenda del día
- NO pueden crear/eliminar canchas ni gestionar usuarios

Esto evita que el TENANT_ADMIN tenga que compartir sus credenciales.

### 2.2 Nombre comercial del Tenant

En vez de mostrar "Tenant" al usuario final, el concepto visible debería ser **"Organización"** o **"Empresa"** internamente, pero en la UI pública cada tenant muestra su propia marca (nombre comercial, logo, etc.). El modelo `Tenant` ya tiene `displayName`, `logoUrl`, etc.

**Sugerencia:** En la UI interna (panel SYS_ADMIN) usar "Organización". En la UI del tenant usar su `displayName`. Para el cliente, el tenant es invisible — solo ve la marca del centro deportivo.

### 2.3 Modelo de datos: qué cambia y qué no

| Modelo | Cambio | Detalle |
|--------|--------|---------|
| `UserRoleType` enum | **Reemplazar** | `ADMIN, OWNER, CLIENT` → `SYS_ADMIN, TENANT_ADMIN, TENANT_STAFF, CLIENT` |
| `User` | Sin cambios | Ya tiene `tenantId` |
| `Tenant` | Agregar campos | `slug`, `plan`, `maxFields`, `maxUsers`, `isVerified` |
| `Role` / `Permission` | Refactorizar seed | Nuevos roles con permisos alineados |
| `Field` | Sin cambios | Ya tiene `ownerId` (será el TENANT_ADMIN o cualquier user del tenant) |
| `SportCenter` | Sin cambios | Ya tiene `tenantId` y `ownerId` |
| `Reservation` | Sin cambios | Ya funciona correctamente |

---

## 3. Arquitectura de los Tres Paneles

### 3.1 Panel System Admin (`/system`)

**Acceso:** Solo usuarios con rol `SYS_ADMIN`. No pertenecen a ningún tenant específico (`tenantId = null` o tenant especial "system").

#### Rutas

```
/system
├── /system                          → Dashboard global (KPIs del sistema)
├── /system/organizations            → Lista de tenants/organizaciones
├── /system/organizations/new        → Crear organización
├── /system/organizations/[id]       → Detalle de organización
├── /system/organizations/[id]/edit  → Editar organización
├── /system/users                    → Todos los usuarios del sistema
├── /system/users/[id]               → Detalle de usuario
├── /system/roles                    → Gestión de roles globales
├── /system/settings                 → Configuración global del sistema
└── /system/audit-log                → Log de auditoría (futuro)
```

#### Sidebar

```
📊 Dashboard
🏢 Organizaciones
👥 Usuarios
🔐 Roles y Permisos
⚙️ Configuración
📋 Auditoría
```

#### Dashboard - KPIs

- Total de organizaciones activas/inactivas
- Total de usuarios en el sistema
- Total de reservas (global)
- Ingresos totales (global)
- Nuevas organizaciones este mes
- Organizaciones más activas (top 5)
- Gráfico de crecimiento mensual

#### Funcionalidades

| Función | Detalle |
|---------|---------|
| CRUD Organizaciones | Crear tenant, asignar TENANT_ADMIN inicial, activar/desactivar, definir límites (plan, maxFields, maxUsers) |
| Ver usuarios globales | Listar todos los usuarios, filtrar por organización, cambiar organización de un usuario |
| Gestión de roles globales | Templates de roles que se copian al crear una organización |
| Configuración del sistema | Variables globales, planes disponibles, features habilitadas |

---

### 3.2 Panel Tenant (`/dashboard`)

**Acceso:** Usuarios con rol `TENANT_ADMIN` o `TENANT_STAFF`, siempre dentro de su tenant.

Este es el panel principal del negocio. El TENANT_ADMIN ve todo; el TENANT_STAFF ve un subconjunto.

#### Rutas

```
/dashboard
├── /dashboard                                → Dashboard principal (métricas del tenant)
│
├── /dashboard/sport-centers                  → Lista de centros deportivos
├── /dashboard/sport-centers/new              → Crear centro deportivo
├── /dashboard/sport-centers/[id]             → Detalle del centro
├── /dashboard/sport-centers/[id]/edit        → Editar centro
│
├── /dashboard/fields                         → Lista de todas las canchas
├── /dashboard/fields/new                     → Crear cancha
├── /dashboard/fields/[id]                    → Detalle de cancha
├── /dashboard/fields/[id]/edit               → Editar cancha
├── /dashboard/fields/[id]/schedule           → Gestionar horarios de cancha
│
├── /dashboard/reservations                   → Lista de reservas
├── /dashboard/reservations/new               → Crear reserva manual
├── /dashboard/reservations/[id]              → Detalle de reserva
├── /dashboard/reservations/calendar          → Vista calendario
│
├── /dashboard/clients                        → Lista de clientes del tenant
├── /dashboard/clients/[id]                   → Detalle de cliente
│
├── /dashboard/staff                          → Gestión de empleados (solo TENANT_ADMIN)
├── /dashboard/staff/new                      → Invitar empleado
├── /dashboard/staff/[id]                     → Detalle de empleado
│
├── /dashboard/payments                       → Pagos y verificaciones
├── /dashboard/payments/[id]                  → Detalle de pago
│
├── /dashboard/metrics                        → Métricas e ingresos
├── /dashboard/metrics/revenue                → Desglose de ingresos
├── /dashboard/metrics/occupancy              → Tasa de ocupación
│
├── /dashboard/settings                       → Configuración del tenant
├── /dashboard/settings/general               → Info general (nombre, logo, contacto)
├── /dashboard/settings/payment-methods       → Métodos de pago aceptados
├── /dashboard/settings/notifications         → Preferencias de notificación
│
├── /dashboard/features                       → Catálogo de características (amenidades)
│
└── /dashboard/profile                        → Perfil del usuario actual
```

#### Sidebar - TENANT_ADMIN

```
📊 Dashboard
🏟️ Centros Deportivos
⚽ Canchas
📅 Reservas
   ├── Lista
   └── Calendario
💰 Pagos
👥 Clientes
🧑‍💼 Equipo
📈 Métricas
   ├── Ingresos
   └── Ocupación
🏷️ Características
⚙️ Configuración
👤 Mi Perfil
```

#### Sidebar - TENANT_STAFF

```
📊 Dashboard
⚽ Canchas (solo lectura)
📅 Reservas
   ├── Lista
   └── Calendario
💰 Pagos (solo verificar)
👥 Clientes (solo lectura)
👤 Mi Perfil
```

#### Dashboard - KPIs del Tenant

- Reservas de hoy / esta semana / este mes
- Ingresos del mes actual vs mes anterior
- Tasa de ocupación promedio
- Reservas pendientes de confirmar
- Pagos pendientes de verificar
- Próximas reservas (lista)
- Cancha más reservada
- Gráfico de reservas por día (últimos 30 días)
- Gráfico de ingresos por cancha

#### Matriz de Permisos Tenant

| Recurso | TENANT_ADMIN | TENANT_STAFF |
|---------|:----------:|:----------:|
| Dashboard (ver) | ✅ | ✅ |
| Centros Deportivos (CRUD) | ✅ | ❌ |
| Canchas (CRUD) | ✅ | ❌ |
| Canchas (ver) | ✅ | ✅ |
| Reservas (ver) | ✅ | ✅ |
| Reservas (crear/editar) | ✅ | ✅ |
| Reservas (cancelar) | ✅ | ✅ |
| Pagos (ver) | ✅ | ✅ |
| Pagos (verificar) | ✅ | ✅ |
| Pagos (reembolsar) | ✅ | ❌ |
| Clientes (ver) | ✅ | ✅ |
| Clientes (editar) | ✅ | ❌ |
| Equipo/Staff (CRUD) | ✅ | ❌ |
| Métricas (ver) | ✅ | ❌ |
| Características (CRUD) | ✅ | ❌ |
| Configuración | ✅ | ❌ |

---

### 3.3 Panel Cliente (`/` y `/my`)

**Acceso:** Usuarios con rol `CLIENT` o usuarios no autenticados (para browsing).

#### Rutas Públicas (sin auth)

```
/
├── /                        → Landing page
├── /canchas                 → Explorar canchas (búsqueda, filtros)
├── /canchas/[id]            → Detalle de cancha + reservar
├── /signin                  → Login
├── /signup                  → Registro
├── /forgot-password         → Recuperar contraseña
├── /reset-password          → Restablecer contraseña
├── /confirm-email           → Verificar email
├── /legal/terms             → Términos
├── /legal/privacy           → Privacidad
├── /legal/cookies           → Cookies
└── /legal/complaints        → Reclamos
```

#### Rutas Autenticadas del Cliente

```
/my
├── /my                      → Dashboard del cliente
├── /my/reservations         → Mis reservas (historial)
├── /my/reservations/[id]    → Detalle de mi reserva
├── /my/favorites            → Canchas favoritas (futuro)
├── /my/profile              → Mi perfil
└── /my/settings             → Mis preferencias (idioma, tema, notificaciones)
```

#### Dashboard del Cliente

- Próximas reservas (tarjetas)
- Historial reciente
- Canchas favoritas / frecuentes
- Estado de pagos pendientes

#### Flujo de Reserva del Cliente

```
/canchas → Explora → /canchas/[id] → Selecciona fecha/hora →
→ Login (si no autenticado) → Confirma → Pago → Comprobante →
→ /my/reservations/[id] (confirmación)
```

---

## 4. Cambios en el Schema de Prisma

### 4.1 Enum `UserRoleType` (reemplazar)

```prisma
enum UserRoleType {
  SYS_ADMIN
  TENANT_ADMIN
  TENANT_STAFF
  CLIENT
}
```

### 4.2 Modelo `Tenant` (agregar campos)

```prisma
model Tenant {
  // ... campos existentes ...
  slug          String    @unique    // URL-friendly identifier
  plan          TenantPlan @default(FREE)
  maxFields     Int       @default(5)
  maxUsers      Int       @default(10)
  isVerified    Boolean   @default(false)
  verifiedAt    DateTime?
}

enum TenantPlan {
  FREE
  BASIC
  PROFESSIONAL
  ENTERPRISE
}
```

### 4.3 Modelo `User` (sin cambios estructurales)

El campo `tenantId` ya existe. Los SYS_ADMIN tendrán `tenantId = null` (o un tenant especial "system"). Los CLIENT pueden tener `tenantId = null` ya que interactúan con múltiples tenants.

### 4.4 Nuevos PermissionResource (agregar al enum)

```prisma
enum PermissionResource {
  USER
  ROLE
  PERMISSION
  DASHBOARD
  ADMIN
  SPORT_CENTER
  FIELD
  RESERVATION
  REVIEW
  PAYMENT
  TENANT          // Nuevo
  STAFF           // Nuevo
  METRICS         // Nuevo
  SETTINGS        // Nuevo
}
```

---

## 5. Reestructuración de Archivos del Proyecto

### 5.1 Nueva estructura de rutas en `src/app/`

```
src/app/
├── layout.tsx                              (root layout - sin cambios)
├── globals.css
│
├── (public)/                               (rutas públicas - landing, canchas, legal)
│   ├── layout.tsx
│   ├── page.tsx                            (landing)
│   ├── canchas/
│   │   ├── page.tsx                        (explorar canchas)
│   │   └── [id]/
│   │       └── page.tsx                    (detalle cancha)
│   └── legal/
│       ├── terms/page.tsx
│       ├── privacy/page.tsx
│       ├── cookies/page.tsx
│       └── complaints/page.tsx
│
├── (auth)/                                 (renombrar de (signin))
│   ├── layout.tsx
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   ├── confirm-email/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
│
├── (client)/                               (panel del cliente)
│   ├── layout.tsx                          (layout con navbar del cliente)
│   └── my/
│       ├── page.tsx                        (dashboard cliente)
│       ├── reservations/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── profile/page.tsx
│       └── settings/page.tsx
│
├── (dashboard)/                            (panel del tenant)
│   ├── layout.tsx                          (layout con sidebar del tenant)
│   └── dashboard/
│       ├── page.tsx                        (dashboard métricas)
│       ├── sport-centers/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/
│       │       ├── page.tsx
│       │       └── edit/page.tsx
│       ├── fields/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/
│       │       ├── page.tsx
│       │       ├── edit/page.tsx
│       │       └── schedule/page.tsx
│       ├── reservations/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   ├── calendar/page.tsx
│       │   └── [id]/page.tsx
│       ├── clients/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── staff/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/page.tsx
│       ├── payments/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── metrics/
│       │   ├── page.tsx
│       │   ├── revenue/page.tsx
│       │   └── occupancy/page.tsx
│       ├── features/page.tsx
│       ├── settings/
│       │   ├── page.tsx
│       │   ├── general/page.tsx
│       │   ├── payment-methods/page.tsx
│       │   └── notifications/page.tsx
│       └── profile/page.tsx
│
├── (system)/                               (panel system admin)
│   ├── layout.tsx                          (layout con sidebar de system admin)
│   └── system/
│       ├── page.tsx                        (dashboard global)
│       ├── organizations/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/
│       │       ├── page.tsx
│       │       └── edit/page.tsx
│       ├── users/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── roles/page.tsx
│       └── settings/page.tsx
│
└── api/
    ├── trpc/[trpc]/route.ts
    ├── auth/[...all]/route.ts
    └── health/route.ts
```

### 5.2 Componentes a crear/modificar

```
src/components/
├── layouts/
│   ├── SystemSidebar.tsx          (sidebar del panel SYS_ADMIN)
│   ├── TenantSidebar.tsx          (sidebar del panel tenant - reemplaza AppSidebar.tsx)
│   ├── ClientNavbar.tsx           (navbar del panel cliente)
│   └── PublicNavbar.tsx           (navbar público - ya existe como GlobalNavbar.tsx)
│
├── dashboard/                     (componentes del panel tenant)
│   ├── TenantDashboard.tsx        (reemplaza OwnerDashboard.tsx)
│   ├── StaffDashboard.tsx         (vista reducida para TENANT_STAFF)
│   ├── ReservationCalendar.tsx    (ya existe, mejorar)
│   ├── MetricsCharts.tsx          (ya existe parcialmente)
│   └── ...
│
├── system/                        (componentes del panel SYS_ADMIN)
│   ├── SystemDashboard.tsx
│   ├── OrganizationTable.tsx
│   ├── OrganizationForm.tsx
│   └── GlobalUserTable.tsx
│
├── client/                        (componentes del panel cliente)
│   ├── ClientDashboard.tsx
│   ├── MyReservations.tsx
│   └── ReservationCard.tsx
│
├── fields/                        (ya existe, reutilizar)
├── reservation/                   (ya existe, reutilizar)
└── ui/                            (ya existe, sin cambios)
```

### 5.3 Routers tRPC a modificar

```
src/server/routers/
├── _app.ts              → Agregar nuevos routers
├── tenant.ts            → Ampliar: CRUD completo, stats por tenant
├── field.ts             → Refactorizar: permisos por tenant en vez de por owner
├── reservation.ts       → Refactorizar: "owner" → "tenant admin/staff"
├── user.ts              → Refactorizar: separar gestión de staff vs clientes
├── rbac.ts              → Actualizar roles
├── sportCenter.ts       → NUEVO: CRUD de centros deportivos
├── payment.ts           → NUEVO: gestión de pagos
├── metrics.ts           → NUEVO: métricas separadas del router de reservas
├── feature.ts           → Sin cambios significativos
├── companyInfo.ts       → Sin cambios
└── translation.ts       → Sin cambios
```

---

## 6. Plan de Trabajo (Fases)

### Fase 0: Preparación (estimado: antes de escribir código)

- [ ] Revisar y aprobar este documento
- [ ] Crear branch `feat/multi-tenant-restructure`
- [ ] Backup de la base de datos actual

### Fase 1: Schema y Base de Datos

**Objetivo:** Actualizar el schema de Prisma y la seed data.

1. **Modificar `UserRoleType` enum** → `SYS_ADMIN, TENANT_ADMIN, TENANT_STAFF, CLIENT`
2. **Agregar campos a `Tenant`** → `slug`, `plan`, `maxFields`, `maxUsers`, `isVerified`
3. **Agregar `TenantPlan` enum**
4. **Agregar nuevos `PermissionResource`** → `TENANT`, `STAFF`, `METRICS`, `SETTINGS`
5. **Actualizar `prisma/seed.ts`**:
   - Nuevos roles: `sys_admin`, `tenant_admin`, `tenant_staff`, `client`
   - Nuevas matrices de permisos alineadas a la tabla de la sección 3.2
   - Usuarios de prueba para cada rol
6. **Generar migración** → `pnpm db:generate`
7. **Regenerar Zod schemas** → `prisma generate`

### Fase 2: RBAC Backend

**Objetivo:** Actualizar el sistema de permisos server-side.

1. **Actualizar `src/services/rbacService.ts`**:
   - Renombrar funciones de role-check (`isOwner` → `isTenantAdmin`, etc.)
   - Agregar `isTenantStaff()`, `isClient()`, `isSysAdmin()`
   - Actualizar `canManageUsers` → distinguir entre gestión de staff y clientes
2. **Actualizar `src/server/trpc.ts`**:
   - Renombrar `adminProcedure` → `tenantAdminProcedure`
   - Agregar `tenantStaffProcedure`
   - Agregar `sysAdminProcedure` (reemplaza `superAdminProcedure`)
3. **Actualizar `src/middlewares/`**:
   - Nuevos middleware: `requireTenantAdmin()`, `requireTenantStaff()`, `requireSysAdmin()`
   - Deprecar los anteriores

### Fase 3: Routers tRPC

**Objetivo:** Refactorizar routers existentes y crear nuevos.

1. **`tenant.ts`** — Ampliar:
   - `list` → solo SYS_ADMIN
   - `create` → solo SYS_ADMIN (auto-asignar TENANT_ADMIN)
   - `update` → SYS_ADMIN o TENANT_ADMIN (su propio tenant)
   - `getStats` → SYS_ADMIN (stats globales)
   - `getMyTenant` → TENANT_ADMIN/STAFF (info de su tenant)
2. **`field.ts`** — Refactorizar:
   - Reemplazar lógica de `ownerId` por lógica de `tenantId`
   - TENANT_ADMIN y TENANT_STAFF ven todas las canchas del tenant
   - TENANT_ADMIN puede crear/editar/eliminar
   - TENANT_STAFF solo lectura
3. **`reservation.ts`** — Refactorizar:
   - `listForOwner` → `listForTenant` (TENANT_ADMIN + TENANT_STAFF)
   - Mantener métricas, mover a router dedicado
   - Agregar endpoints para cliente (`myReservations`, `createAsClient`)
4. **`user.ts`** — Refactorizar:
   - Separar `getStaff` (TENANT_ADMIN gestiona staff)
   - Separar `getClients` (clientes del tenant)
   - `inviteStaff` → TENANT_ADMIN invita empleados
5. **Crear `sportCenter.ts`**:
   - CRUD completo para TENANT_ADMIN
   - Lectura para TENANT_STAFF
6. **Crear `payment.ts`**:
   - CRUD de pagos
   - Verificación de comprobantes
7. **Crear `metrics.ts`**:
   - Métricas separadas (ingresos, ocupación, tendencias)

### Fase 4: Layouts y Navegación

**Objetivo:** Crear los tres layouts con sus sidebars/navbars.

1. **Crear `(system)/layout.tsx`** + `SystemSidebar.tsx`
   - Verificar rol SYS_ADMIN, redirect si no
2. **Refactorizar `(dashboard)/layout.tsx`** + `TenantSidebar.tsx`
   - Verificar rol TENANT_ADMIN o TENANT_STAFF
   - Sidebar condicional según rol
3. **Crear `(client)/layout.tsx`** + `ClientNavbar.tsx`
   - Verificar autenticación, redirect a login si no
4. **Actualizar `RoleBasedRedirect.tsx`**:
   - SYS_ADMIN → `/system`
   - TENANT_ADMIN / TENANT_STAFF → `/dashboard`
   - CLIENT → `/my`
   - No autenticado → `/` (público)
5. **Actualizar `useUser.ts`**:
   - `primaryRole` ahora devuelve: `sys_admin > tenant_admin > tenant_staff > client`
6. **Actualizar `useRBAC.ts`**:
   - Nuevas flags: `isSysAdmin`, `isTenantAdmin`, `isTenantStaff`, `isClient`

### Fase 5: Panel System Admin

**Objetivo:** Construir las páginas del panel SYS_ADMIN.

1. **`/system` (dashboard)** — KPIs globales (orgs activas, usuarios totales, reservas globales)
2. **`/system/organizations`** — Tabla de tenants con filtros, estado, plan
3. **`/system/organizations/new`** — Form de crear organización + asignar TENANT_ADMIN
4. **`/system/organizations/[id]`** — Detalle: info, usuarios, canchas, métricas del tenant
5. **`/system/organizations/[id]/edit`** — Editar info, plan, límites, activar/desactivar
6. **`/system/users`** — Tabla global de usuarios, filtrar por organización y rol
7. **`/system/users/[id]`** — Detalle de usuario, cambiar organización, cambiar rol
8. **`/system/roles`** — Templates de roles globales
9. **`/system/settings`** — Config global del sistema

### Fase 6: Panel Tenant

**Objetivo:** Refactorizar las páginas existentes de owner/admin al nuevo modelo.

1. **`/dashboard` (dashboard)** — Refactorizar `OwnerDashboard` → `TenantDashboard`:
   - Reservas de hoy, ingresos del mes, ocupación, pagos pendientes
   - Crear `StaffDashboard` (versión reducida)
2. **`/dashboard/sport-centers`** — CRUD de centros deportivos (nuevo)
3. **`/dashboard/fields`** — Migrar de `/dashboard/owner/fields`:
   - Ya existe la mayoría de la funcionalidad
   - Cambiar filtro de `ownerId` a `tenantId`
4. **`/dashboard/reservations`** — Migrar de `/dashboard/owner/reservations`:
   - Agregar vista calendario
   - Agregar creación manual
5. **`/dashboard/clients`** — Lista de clientes que han reservado en este tenant
6. **`/dashboard/staff`** — Gestión de empleados (solo TENANT_ADMIN):
   - Invitar por email
   - Asignar/revocar rol TENANT_STAFF
7. **`/dashboard/payments`** — Nueva página de gestión de pagos
8. **`/dashboard/metrics`** — Migrar de `/dashboard/owner/metrics`:
   - Agregar ocupación, tendencias
9. **`/dashboard/features`** — Ya existe, minor changes
10. **`/dashboard/settings`** — Migrar de config actual + agregar métodos de pago
11. **`/dashboard/profile`** — Ya existe, sin cambios

### Fase 7: Panel Cliente

**Objetivo:** Construir la experiencia del cliente autenticado.

1. **`/my` (dashboard)** — Próximas reservas, historial reciente, canchas frecuentes
2. **`/my/reservations`** — Mis reservas con filtros (estado, fecha)
3. **`/my/reservations/[id]`** — Detalle de reserva con estado de pago
4. **`/my/profile`** — Perfil del cliente (nombre, teléfono, idioma, tema)
5. **`/my/settings`** — Preferencias de notificación
6. **Mejorar flujo de reserva pública** (`/canchas/[id]`):
   - Si autenticado como CLIENT → reservar directamente
   - Si no autenticado → pedir login/registro o reservar como invitado

### Fase 8: Limpieza y Migración

**Objetivo:** Eliminar código obsoleto y asegurar consistencia.

1. **Eliminar rutas antiguas**:
   - `/dashboard/owner/*` → migrado a `/dashboard/*`
   - `/dashboard/admin/*` → migrado a `/dashboard/*` (TENANT_ADMIN) y `/system/*` (SYS_ADMIN)
2. **Eliminar componentes obsoletos**:
   - `OwnerDashboard.tsx` → reemplazado por `TenantDashboard.tsx`
   - `AppSidebar.tsx` → reemplazado por `TenantSidebar.tsx` y `SystemSidebar.tsx`
3. **Actualizar seed data** con datos de ejemplo realistas
4. **Actualizar CLAUDE.md** con la nueva arquitectura
5. **Actualizar i18n** — nuevas keys para los tres paneles

### Fase 9: Testing y QA

1. Verificar aislamiento entre tenants (un TENANT_ADMIN no puede ver datos de otro tenant)
2. Verificar que TENANT_STAFF no puede acceder a rutas restringidas
3. Verificar que CLIENT no puede acceder a `/dashboard` ni `/system`
4. Verificar que SYS_ADMIN puede ver todos los tenants
5. Verificar flujo completo: crear organización → asignar admin → crear cancha → reservar como cliente
6. Verificar que las rutas antiguas no son accesibles (404 o redirect)

---

## 7. Flujos Clave

### 7.1 Onboarding de una nueva organización

```
SYS_ADMIN:
1. Va a /system/organizations/new
2. Llena: nombre, email de contacto, plan
3. Ingresa email del TENANT_ADMIN inicial
4. Sistema:
   a. Crea el Tenant
   b. Crea (o busca) el usuario con ese email
   c. Asigna rol TENANT_ADMIN
   d. Seedea permisos base del tenant
   e. Envía email de bienvenida al TENANT_ADMIN

TENANT_ADMIN:
1. Recibe email → login/registro
2. Es redirigido a /dashboard
3. Completa su perfil y la info del tenant en /dashboard/settings/general
4. Crea su primer centro deportivo
5. Crea sus canchas con horarios y precios
6. Listo para recibir reservas
```

### 7.2 Flujo de reserva (cliente)

```
CLIENTE (no autenticado):
1. Entra a / (landing)
2. Explora /canchas → filtra por deporte, zona
3. Selecciona /canchas/[id]
4. Ve horarios disponibles para una fecha
5. Selecciona hora → se le pide login/registro o continuar como invitado
6. Confirma reserva
7. Realiza pago (si aplica)
8. Recibe confirmación por email

CLIENTE (autenticado):
1. Mismo flujo pero sin pedir login
2. Reserva aparece en /my/reservations
3. Puede ver estado del pago
4. Puede cancelar (según política)
```

### 7.3 Gestión diaria del tenant

```
TENANT_STAFF (recepcionista):
1. Login → /dashboard
2. Ve reservas de hoy
3. Confirma llegadas → marca como COMPLETED
4. Marca no-shows → NO_SHOW
5. Crea reservas manuales para clientes presenciales
6. Verifica comprobantes de pago

TENANT_ADMIN:
1. Login → /dashboard
2. Ve métricas del mes
3. Gestiona canchas (precios, horarios)
4. Revisa métricas de ingresos y ocupación
5. Gestiona su equipo (invitar/remover staff)
6. Configura métodos de pago
```

---

## 8. Consideraciones Técnicas

### 8.1 Middleware de protección de rutas

Cada route group necesita un middleware o layout guard:

```typescript
// (system)/layout.tsx
// → Verificar: user.role incluye SYS_ADMIN, redirect a / si no

// (dashboard)/layout.tsx
// → Verificar: user tiene tenantId Y role incluye TENANT_ADMIN o TENANT_STAFF
// → Redirect a / si no

// (client)/layout.tsx
// → Verificar: user autenticado, redirect a /signin si no
```

### 8.2 Contexto tRPC

Actualizar `src/server/context.ts` para incluir el `primaryRole` del usuario:

```typescript
interface Context {
  user?: {
    id: string;
    email: string;
    name: string;
    tenantId: string | null;
    roles: string[];           // Nuevo: lista de roles
    primaryRole: string;       // Nuevo: rol principal
  };
  tenant?: { ... };
}
```

### 8.3 Multi-tenant para CLIENT

Los clientes no pertenecen a un solo tenant. Un cliente puede reservar en cualquier cancha de cualquier tenant. Opciones:

**Opción recomendada:** El CLIENT tiene `tenantId = null`. Las reservas se vinculan al campo (que pertenece a un tenant). El cliente no necesita pertenecer al tenant.

### 8.4 Slug del Tenant

Permite URLs públicas como `/org/cancha-deportiva-lima/canchas` en el futuro. Por ahora, el slug se usa internamente para identificación.

---

## 9. Resumen de Prioridades

| Prioridad | Fase | Descripción |
|:---------:|------|-------------|
| 🔴 P0 | Fase 1 | Schema + migraciones (todo depende de esto) |
| 🔴 P0 | Fase 2 | RBAC backend (seguridad) |
| 🟠 P1 | Fase 3 | Routers tRPC (API funcional) |
| 🟠 P1 | Fase 4 | Layouts y navegación (estructura visual) |
| 🟡 P2 | Fase 6 | Panel Tenant (funcionalidad core del negocio) |
| 🟡 P2 | Fase 5 | Panel System Admin |
| 🟢 P3 | Fase 7 | Panel Cliente |
| 🟢 P3 | Fase 8 | Limpieza |
| 🔵 P4 | Fase 9 | Testing |
