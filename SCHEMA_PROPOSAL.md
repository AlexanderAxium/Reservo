# Propuesta de Schema Mejorado — Reservo

## Decisiones de diseño

### Geografía de Perú
Reemplazo `city` por `department` + `province` + `district` en SportCenter y Field.
- En Lima la gente busca por **distrito** (Miraflores, Surco, La Molina)
- Fuera de Lima buscan por **departamento** (Arequipa, Cusco, Trujillo)
- `province` es opcional pero útil fuera de Lima

### Multi-deporte
Expando `Sport` con deportes que usan espacios reservables en Perú. Uso `SurfaceType` genérico + `playerCapacity` opcional para cubrir desde fútbol 5 hasta carriles de piscina o canchas de tenis.

### User mínimo
Solo agrego `deletedAt` (soft delete — obligatorio para cumplimiento legal) y `lastLoginAt` (métrica básica de engagement). Nada más.

### Modelos nuevos — solo los imprescindibles
| Modelo | Justificación |
|--------|---------------|
| `FieldPricing` | Sin pricing dinámico no puedes diferenciar hora punta vs valle. Es lo primero que pide cualquier owner. |
| `BlockedSlot` | Los owners necesitan bloquear horarios por mantenimiento o eventos. Sin esto crean reservas falsas. |
| `RecurringReservation` | "Turno fijo" semanal: 30-50% de ingresos de canchas en LATAM. |
| `Favorite` | Retención básica: guardar espacios favoritos. |
| `AuditLog` | Trazabilidad de operaciones, compliance, debugging. |

---

## Schema completo propuesto

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

generator zod {
  provider         = "prisma-zod-generator"
  output           = "../src/lib/zod"
  createInputTypes = true
  writeNullish     = false
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===========================================
// TENANT & AUTH
// ===========================================

model Tenant {
  id              String       @id @default(uuid())
  name            String       @default("My App")
  displayName     String       @default("My Application")
  description     String?
  email           String?
  phone           String?
  whatsapp        String?      // Canal de comunicación #1 en Perú
  address         String?
  department      String?      // Departamento del Perú (Lima, Arequipa, Cusco...)
  province        String?      // Provincia
  district        String?      // Distrito (Miraflores, Surco...)
  country         String?      @default("PE")
  currency        String       @default("PEN") // Moneda principal del tenant
  timezone        String       @default("America/Lima")
  website         String?
  facebookUrl     String?
  twitterUrl      String?
  instagramUrl    String?
  linkedinUrl     String?
  youtubeUrl      String?
  foundedYear     Int?
  logoUrl         String?
  faviconUrl      String?
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  termsUrl        String?
  privacyUrl      String?
  cookiesUrl      String?
  complaintsUrl   String?
  isActive        Boolean      @default(true)
  slug            String       @unique
  plan            TenantPlan   @default(FREE)
  maxFields       Int          @default(5)
  maxUsers        Int          @default(10)
  isVerified      Boolean      @default(false)
  verifiedAt      DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  // Relations
  users           User[]
  permissions     Permission[]
  roles           Role[]
  translations    Translation[]
  sportCenters    SportCenter[]
  fields          Field[]
  reservations    Reservation[]

  @@map("tenants")
}

model User {
  id            String     @id @default(cuid())
  username      String     @unique
  name          String
  email         String     @unique
  emailVerified Boolean    @default(false)
  image         String?
  password      String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  phone         String?
  language      Language   @default(ES)
  theme         Theme      @default(AUTO)
  isActive      Boolean    @default(true)
  lastLoginAt   DateTime?  // Detectar cuentas inactivas, reportes de uso
  deletedAt     DateTime?  // Soft delete: cumplimiento legal, no perder historial de reservas
  tenantId      String?

  // Auth relations
  accounts      Account[]
  sessions      Session[]
  tenant        Tenant?    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userRoles     UserRole[]

  // Reservation system relations
  sportCenters          SportCenter[]          @relation("OwnerSportCenters")
  fields                Field[]                @relation("OwnerFields")
  reservations          Reservation[]
  recurringReservations RecurringReservation[]
  favorites             Favorite[]
  notifications         Notification[]

  @@index([tenantId])
  @@index([email, tenantId])
  @@index([username])
  @@index([isActive])
  @@index([deletedAt])
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                    String    @id @default(cuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([identifier, value])
}

// ===========================================
// RBAC (sin cambios)
// ===========================================

model Role {
  id              String           @id @default(uuid())
  name            String
  displayName     String
  description     String?
  isActive        Boolean          @default(true)
  isSystem        Boolean          @default(false)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  tenantId        String
  rolePermissions RolePermission[]
  tenant          Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userRoles       UserRole[]

  @@unique([name, tenantId])
  @@index([tenantId])
  @@map("roles")
}

model Permission {
  id              String             @id @default(uuid())
  action          PermissionAction
  resource        PermissionResource
  description     String?
  isActive        Boolean            @default(true)
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  tenantId        String
  tenant          Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  rolePermissions RolePermission[]

  @@unique([action, resource, tenantId])
  @@index([tenantId])
  @@map("permissions")
}

model UserRole {
  id         String    @id @default(uuid())
  userId     String
  roleId     String
  assignedAt DateTime  @default(now())
  assignedBy String?
  expiresAt  DateTime?
  role       Role      @relation(fields: [roleId], references: [id], onDelete: Cascade)
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, roleId])
  @@index([userId])
  @@index([roleId])
  @@map("user_roles")
}

model RolePermission {
  id           String     @id @default(uuid())
  roleId       String
  permissionId String
  createdAt    DateTime   @default(now())
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
  @@index([roleId])
  @@index([permissionId])
  @@map("role_permissions")
}

// ===========================================
// ENUMS BASE
// ===========================================

enum Language {
  ES
  EN
  PT
}

enum Theme {
  LIGHT
  DARK
  AUTO
}

enum PermissionAction {
  CREATE
  READ
  UPDATE
  DELETE
  MANAGE
}

enum PermissionResource {
  USER
  ROLE
  PERMISSION
  DASHBOARD
  ADMIN
  SPORT_CENTER
  FIELD
  RESERVATION
  TENANT
  STAFF
  METRICS
  SETTINGS
  PAYMENT
}

// ===========================================
// i18n MODELS (sin cambios)
// ===========================================

model Locale {
  id             String        @id @default(uuid())
  languageCode   String        @unique
  name           String
  nativeName     String
  locale         String?
  direction      String        @default("ltr")
  currencySymbol String?
  isActive       Boolean       @default(true)
  isDefault      Boolean       @default(false)
  flagUrl        String?
  displayOrder   Int           @default(0)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  translations   Translation[]

  @@index([languageCode])
  @@index([isActive])
  @@map("locales")
}

model Translation {
  id                String            @id @default(uuid())
  translatableType  String
  translatableId    String
  localeId          String
  locale            Locale            @relation(fields: [localeId], references: [id], onDelete: Cascade)
  fieldName         String
  translatedValue   String            @db.Text
  translationStatus TranslationStatus @default(DRAFT)
  translatorNotes   String?           @db.Text
  approvedBy        String?
  approvedAt        DateTime?
  tenantId          String?
  tenant            Tenant?           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  @@unique([translatableType, translatableId, localeId, fieldName, tenantId])
  @@index([translatableType, translatableId, localeId])
  @@index([localeId])
  @@index([translationStatus])
  @@index([tenantId])
  @@map("translations")
}

enum TranslationStatus {
  DRAFT
  REVIEW
  APPROVED
  PUBLISHED
}

// ===========================================
// ENUMS DEL SISTEMA DE RESERVAS
// ===========================================

enum UserRoleType {
  SYS_ADMIN
  TENANT_ADMIN
  TENANT_STAFF
  CLIENT
}

enum TenantPlan {
  FREE
  BASIC
  PROFESSIONAL
  ENTERPRISE
}

/// Deportes que usan espacios reservables.
/// Incluye los más comunes en Perú + OTHER como escape para deportes menos frecuentes.
enum Sport {
  FOOTBALL         // Fútbol 11
  FUTSAL           // Fulbito / fútbol sala
  TENNIS
  PADEL            // Crecimiento explosivo en Lima
  BASKETBALL
  VOLLEYBALL
  BEACH_VOLLEYBALL // Canchas de vóley playa
  SWIMMING         // Carriles de piscina
  SQUASH
  BADMINTON
  TABLE_TENNIS     // Ping pong
  GOLF             // Driving ranges, mini golf
  HANDBALL
  BOXING           // Rings reservables
  ATHLETICS        // Pistas de atletismo
  MULTI_PURPOSE    // Espacios polivalentes
  OTHER
}

/// Tipo de superficie — genérico para cubrir múltiples deportes.
enum SurfaceType {
  NATURAL_GRASS    // Fútbol, tenis
  SYNTHETIC_GRASS  // Fútbol, padel
  CLAY             // Tenis
  HARD_COURT       // Tenis, básquet
  CONCRETE         // Básquet, fulbito
  PARQUET          // Básquet indoor, vóley
  SAND             // Vóley playa
  RUBBER           // Atletismo, box
  OTHER
}

enum WeekDay {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}

enum PaymentStatus {
  PENDING
  PAID
  CANCELLED
  REFUNDED
  FAILED
}

enum SportCenterStatus {
  ACTIVE
  PENDING
  REJECTED
  SUSPENDED
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

/// Fuente de la reserva — saber de dónde vienen es clave para medir ROI de canales.
enum ReservationSource {
  WEB
  CHATBOT
  PHONE    // Reserva por teléfono registrada por staff
  WALKIN   // Cliente llega sin reserva
}

enum NotificationType {
  NEW_RESERVATION
  RESERVATION_CONFIRMED
  RESERVATION_CANCELLED
  RESERVATION_REMINDER
  PAYMENT_TO_VERIFY
  PAYMENT_CONFIRMED
  SYSTEM_ALERT
}

// ===========================================
// MODELOS DEL SISTEMA DE RESERVAS
// ===========================================

/// SportCenter: agrupa múltiples canchas/espacios en una misma ubicación física.
model SportCenter {
  id            String            @id @default(uuid())
  tenantId      String
  name          String
  slug          String            @unique
  address       String
  department    String            // Departamento del Perú (Lima, Arequipa, Cusco...)
  province      String?           // Provincia (Lima, Huancayo, Trujillo...)
  district      String?           // Distrito (Miraflores, Surco, Yanahuara...)
  description   String?           @db.Text
  phone         String?
  whatsapp      String?           // Canal principal de contacto en Perú
  email         String?
  website       String?
  latitude      Decimal?          @db.Decimal(10, 8)
  longitude     Decimal?          @db.Decimal(11, 8)
  googleMapsUrl String?
  status        SportCenterStatus @default(PENDING)
  images        String[]
  ownerId       String
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  // Foreign Keys
  owner   User   @relation("OwnerSportCenters", fields: [ownerId], references: [id], onDelete: Cascade)
  tenant  Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Relations
  fields            Field[]
  operatingSchedule OperatingSchedule[]
  favorites         Favorite[]

  @@index([ownerId])
  @@index([tenantId])
  @@index([status])
  @@index([slug])
  @@index([department])
  @@index([department, district])
  @@index([latitude, longitude])
  @@map("sport_centers")
}

/// Field: espacio reservable individual.
/// Puede pertenecer a un SportCenter o ser independiente.
/// Genérico para cualquier deporte: cancha, court, carril, ring, etc.
model Field {
  id                 String       @id @default(uuid())
  name               String
  slug               String       @unique
  sport              Sport
  price              Decimal      @db.Decimal(10, 2) // Precio base (FieldPricing lo sobreescribe por horario)
  currency           String       @default("PEN")
  available          Boolean      @default(true)
  images             String[]

  // Características físicas del espacio
  surfaceType        SurfaceType? // Césped, arcilla, parquet, etc.
  isIndoor           Boolean      @default(false) // Techado — crítico para días de lluvia
  hasLighting        Boolean      @default(true)  // Iluminación — determina disponibilidad nocturna
  playerCapacity     Int?         // Fútbol 5/7/11, básquet 3v3/5v5, null para piscina/tenis

  // Ubicación (para canchas independientes sin SportCenter)
  address            String
  department         String       // Departamento del Perú
  province           String?
  district           String?
  latitude           Decimal?     @db.Decimal(10, 8)
  longitude          Decimal?     @db.Decimal(11, 8)
  googleMapsUrl      String?

  // Descripción y contacto
  description        String?      @db.Text
  phone              String?
  email              String?

  // Reglas de reserva — configurables por cancha porque cada deporte tiene tiempos distintos
  minBookingMinutes  Int          @default(60)  // Piscina 30min, fútbol 60min, tenis 60min
  bufferMinutes      Int          @default(0)   // Tiempo entre reservas para limpieza/preparación
  advanceBookingDays Int          @default(14)  // Cuántos días adelante se puede reservar
  cancellationHours  Int          @default(24)  // Horas de antelación para cancelar sin penalidad
  depositPercent     Decimal?     @db.Decimal(5, 2) // % de seña requerido (universal en Perú)

  // Ownership
  ownerId            String
  sportCenterId      String?
  tenantId           String?

  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  // Foreign Keys
  owner       User         @relation("OwnerFields", fields: [ownerId], references: [id], onDelete: Cascade)
  sportCenter SportCenter? @relation(fields: [sportCenterId], references: [id], onDelete: SetNull)
  tenant      Tenant?      @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Relations
  schedules             Schedule[]
  reservations          Reservation[]
  fieldFeatures         FieldFeature[]
  pricing               FieldPricing[]
  blockedSlots          BlockedSlot[]
  favorites             Favorite[]
  recurringReservations RecurringReservation[]

  @@index([slug])
  @@index([ownerId])
  @@index([sportCenterId])
  @@index([tenantId])
  @@index([sport])
  @@index([available])
  @@index([department])
  @@index([department, district])
  @@index([latitude, longitude])
  @@map("fields")
}

/// Schedule: horario semanal de disponibilidad por cancha.
model Schedule {
  id        String   @id @default(uuid())
  day       WeekDay
  startHour String   // Format: "HH:mm" (e.g., "08:00")
  endHour   String   // Format: "HH:mm" (e.g., "22:00")
  fieldId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  field Field @relation(fields: [fieldId], references: [id], onDelete: Cascade)

  @@unique([fieldId, day])
  @@index([fieldId])
  @@map("schedules")
}

/// FieldPricing: precios diferenciados por horario y día.
/// Ejemplo: Lun-Vie mañana S/80, tarde S/120, fines de semana S/150.
/// Si no hay FieldPricing para un horario, se usa Field.price como fallback.
model FieldPricing {
  id         String    @id @default(uuid())
  fieldId    String
  dayOfWeek  WeekDay?  // null = aplica todos los días
  startTime  String    // "HH:mm"
  endTime    String    // "HH:mm"
  price      Decimal   @db.Decimal(10, 2)
  label      String?   // "Hora punta", "Happy Hour", "Nocturno"
  isActive   Boolean   @default(true)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  field Field @relation(fields: [fieldId], references: [id], onDelete: Cascade)

  @@index([fieldId])
  @@index([fieldId, dayOfWeek])
  @@map("field_pricing")
}

/// BlockedSlot: bloqueo de horarios por mantenimiento, eventos privados o clima.
model BlockedSlot {
  id        String   @id @default(uuid())
  fieldId   String
  startDate DateTime
  endDate   DateTime
  reason    String?  // "Mantenimiento", "Evento privado", "Lluvia"
  blockedBy String   // userId de quien bloqueó
  createdAt DateTime @default(now())

  field Field @relation(fields: [fieldId], references: [id], onDelete: Cascade)

  @@index([fieldId])
  @@index([fieldId, startDate, endDate])
  @@map("blocked_slots")
}

/// Reservation: reserva de un espacio deportivo.
model Reservation {
  id                     String              @id @default(uuid())
  startDate              DateTime
  endDate                DateTime
  amount                 Decimal             @db.Decimal(10, 2)
  depositAmount          Decimal?            @db.Decimal(10, 2) // Monto de seña pagada
  status                 ReservationStatus   @default(PENDING)
  source                 ReservationSource   @default(WEB)
  notes                  String?             // "Somos 8", "Llevo los petos"

  // Lifecycle
  confirmedAt            DateTime?
  cancelledAt            DateTime?
  cancelledBy            String?             // userId: ¿canceló el cliente o el admin?

  // Guest booking (cuando userId es null)
  userId                 String?
  guestName              String?
  guestEmail             String?
  guestPhone             String?

  // Turno fijo
  recurringReservationId String?

  fieldId                String
  tenantId               String?             // Desnormalizado: reporting por tenant sin join
  createdAt              DateTime            @default(now())
  updatedAt              DateTime            @updatedAt

  // Foreign Keys
  field                  Field                @relation(fields: [fieldId], references: [id], onDelete: Cascade)
  user                   User?                @relation(fields: [userId], references: [id], onDelete: SetNull)
  tenant                 Tenant?              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  recurringReservation   RecurringReservation? @relation(fields: [recurringReservationId], references: [id], onDelete: SetNull)

  // Relations
  payments Payment[]

  @@index([fieldId])
  @@index([userId])
  @@index([status])
  @@index([tenantId])
  @@index([fieldId, startDate, status])
  @@index([startDate, endDate])
  @@index([recurringReservationId])
  @@map("reservations")
}

/// RecurringReservation: "turno fijo" semanal.
/// En LATAM los turnos fijos representan 30-50% de ingresos de una cancha.
model RecurringReservation {
  id         String    @id @default(uuid())
  fieldId    String
  userId     String
  dayOfWeek  WeekDay
  startTime  String    // "HH:mm"
  endTime    String    // "HH:mm"
  startDate  DateTime  // Desde cuándo aplica
  endDate    DateTime? // Hasta cuándo (null = indefinido)
  amount     Decimal   @db.Decimal(10, 2)
  isActive   Boolean   @default(true)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  field        Field         @relation(fields: [fieldId], references: [id], onDelete: Cascade)
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  reservations Reservation[]

  @@index([fieldId])
  @@index([userId])
  @@index([isActive])
  @@map("recurring_reservations")
}

// ===========================================
// MODELOS AUXILIARES
// ===========================================

/// Feature: catálogo global de amenidades/características.
model Feature {
  id            String         @id @default(uuid())
  name          String         @unique
  description   String?        @db.Text
  icon          String?
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  fieldFeatures FieldFeature[]

  @@index([isActive])
  @@map("features")
}

/// FieldFeature: qué amenidades tiene cada cancha.
model FieldFeature {
  id        String   @id @default(uuid())
  value     String?  // "2 duchas", "20 plazas de parking"
  createdAt DateTime @default(now())
  fieldId   String
  field     Field    @relation(fields: [fieldId], references: [id], onDelete: Cascade)
  featureId String
  feature   Feature  @relation(fields: [featureId], references: [id], onDelete: Cascade)

  @@unique([fieldId, featureId])
  @@index([fieldId])
  @@index([featureId])
  @@map("field_features")
}

/// OperatingSchedule: horario de apertura/cierre del centro deportivo.
model OperatingSchedule {
  id            String      @id @default(uuid())
  day           WeekDay
  openTime      String
  closeTime     String
  sportCenterId String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  sportCenter   SportCenter @relation(fields: [sportCenterId], references: [id], onDelete: Cascade)

  @@unique([sportCenterId, day])
  @@index([sportCenterId])
  @@map("operating_schedules")
}

/// Favorite: guardar canchas o centros deportivos favoritos.
model Favorite {
  id            String       @id @default(uuid())
  userId        String
  fieldId       String?
  sportCenterId String?
  createdAt     DateTime     @default(now())

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  field       Field?       @relation(fields: [fieldId], references: [id], onDelete: Cascade)
  sportCenter SportCenter? @relation(fields: [sportCenterId], references: [id], onDelete: Cascade)

  @@unique([userId, fieldId])
  @@unique([userId, sportCenterId])
  @@index([userId])
  @@map("favorites")
}

/// Notification: notificaciones del sistema.
model Notification {
  id        String           @id @default(uuid())
  title     String
  message   String
  type      NotificationType
  isRead    Boolean          @default(false)
  actionUrl String?          // Deep link para navegar desde la notificación
  userId    String
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, isRead])
  @@index([type])
  @@map("notifications")
}

// ===========================================
// PAYMENT SYSTEM
// ===========================================

/// PaymentMethod: métodos de pago disponibles.
model PaymentMethod {
  id            String   @id @default(uuid())
  name          String   @unique
  provider      String
  requiresProof Boolean  @default(false)
  instructions  String?  @db.Text // "Transferir a BCP cuenta 123...", "Yape al 999..."
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  payments      Payment[]

  @@index([isActive])
  @@index([provider])
  @@map("payment_methods")
}

/// Payment: registro de pagos realizados.
model Payment {
  id              String        @id @default(uuid())
  amount          Decimal       @db.Decimal(10, 2)
  currency        String        @default("PEN")
  status          PaymentStatus @default(PENDING)
  proofImages     String[]
  transactionId   String?       // Referencia del gateway (Mercado Pago, Izipay, etc.)
  verifiedBy      String?       // userId del staff que verificó el comprobante
  verifiedAt      DateTime?
  paidAt          DateTime?     // Cuándo se confirmó el pago
  reservationId   String
  paymentMethodId String
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  reservation   Reservation   @relation(fields: [reservationId], references: [id], onDelete: Cascade)
  paymentMethod PaymentMethod @relation(fields: [paymentMethodId], references: [id], onDelete: Restrict)

  @@index([reservationId])
  @@index([paymentMethodId])
  @@index([status])
  @@index([createdAt])
  @@map("payments")
}

// ===========================================
// AUDIT LOG
// ===========================================

/// AuditLog: registro de acciones importantes del sistema.
/// Sin FK intencionales — almacena IDs como strings para no perder logs si la entidad se elimina.
model AuditLog {
  id         String   @id @default(uuid())
  action     String   // "reservation.created", "payment.verified", "field.updated"
  entityType String   // "Reservation", "Payment", "Field"
  entityId   String
  userId     String?  // null = acción del sistema
  oldValues  Json?
  newValues  Json?
  ipAddress  String?
  tenantId   String?
  createdAt  DateTime @default(now())

  @@index([entityType, entityId])
  @@index([userId])
  @@index([tenantId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## Resumen de cambios vs schema actual

### Campos modificados en modelos existentes

| Modelo | Cambio | Justificación |
|--------|--------|---------------|
| **Tenant** | `+whatsapp`, `+department/province/district` (reemplazan `city`), `+currency`, `+timezone` | Geografía peruana, canal de contacto #1, soporte multi-moneda |
| **Tenant** | `+reservations` relation | Acceso directo a reservas del tenant sin join |
| **User** | `+lastLoginAt`, `+deletedAt` | Engagement metric, soft delete legal |
| **User** | `+favorites`, `+recurringReservations` relations | Relaciones con modelos nuevos |
| **SportCenter** | `department/province/district` (reemplazan `city`), `+whatsapp` | Geografía peruana, contacto |
| **SportCenter** | Eliminados `rating` y `reviewCount` | Sin sistema de reviews |
| **Field** | `department/province/district` (reemplazan `city`) | Geografía peruana |
| **Field** | `+surfaceType`, `+isIndoor`, `+hasLighting`, `+playerCapacity` | Filtros esenciales multi-deporte |
| **Field** | `+minBookingMinutes`, `+bufferMinutes`, `+advanceBookingDays`, `+cancellationHours`, `+depositPercent`, `+currency` | Reglas de reserva configurables por deporte |
| **Reservation** | `+source`, `+notes`, `+confirmedAt`, `+cancelledAt`, `+cancelledBy`, `+depositAmount`, `+recurringReservationId`, `+tenantId` | Lifecycle, analytics, turno fijo, reporting |
| **Payment** | `+currency`, `+transactionId`, `+verifiedBy`, `+verifiedAt`, `+paidAt` | Trazabilidad de pagos |
| **PaymentMethod** | `+instructions` | Indicaciones de pago para Yape/transferencia |
| **Notification** | `+actionUrl` | Navegación desde notificación |

### Enums modificados

| Enum | Cambio |
|------|--------|
| `Sport` | +12 deportes: PADEL, BEACH_VOLLEYBALL, SWIMMING, SQUASH, BADMINTON, TABLE_TENNIS, GOLF, HANDBALL, BOXING, ATHLETICS, MULTI_PURPOSE, OTHER |
| `PermissionResource` | -REVIEW (eliminado) |
| `NotificationType` | +RESERVATION_CANCELLED, +RESERVATION_REMINDER, +PAYMENT_CONFIRMED |

### Enums nuevos

| Enum | Justificación |
|------|---------------|
| `SurfaceType` | Filtro de búsqueda clave en multi-deporte |
| `ReservationSource` | Analytics: de dónde vienen las reservas |

### Modelos nuevos

| Modelo | Justificación |
|--------|---------------|
| `FieldPricing` | Hora punta S/120, hora valle S/80. Sin esto solo tienes un precio fijo. |
| `BlockedSlot` | Mantenimiento, eventos privados. Sin esto owners crean reservas falsas. |
| `RecurringReservation` | "Turno fijo": 30-50% de ingresos en canchas LATAM. |
| `Favorite` | Retención: guardar espacios favoritos. |
| `AuditLog` | Compliance, debugging, historial de cambios. |

### Lo que se eliminó
- Modelo `Review` y todas sus relaciones
- `REVIEW` de `PermissionResource`
- `REVIEW_REQUEST` de `NotificationType`
- `rating` y `reviewCount` de SportCenter
- `dimensions` de Field (informativo, no crítico)
- `maxBookingMinutes` de Field (el slot se define por `minBookingMinutes`)
- `cancellationReason` de Reservation (simplificado: `cancelledAt` + `cancelledBy` es suficiente)
- `validFrom`/`validUntil` de FieldPricing (simplificado: si no es activo, se desactiva)
- `refundAmount`, `refundReason`, `refundedAt` de Payment (simplificado: status REFUNDED es suficiente)
- `PARTIALLY_REFUNDED` de PaymentStatus
- `readAt`, `entityType`, `entityId` de Notification (simplificado: `actionUrl` es suficiente)
- `CARPET` de SurfaceType (redundante con OTHER)

### Lo que NO se tocó
- Session, Account, Verification — modelos de Better Auth
- Role, Permission, UserRole, RolePermission — RBAC está bien
- Locale, Translation — i18n está bien
- Feature, FieldFeature — catálogo de amenidades está bien
- Schedule, OperatingSchedule — horarios semanales están bien
