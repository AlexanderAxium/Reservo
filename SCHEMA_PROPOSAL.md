# Propuesta de Schema — Reservo (Versión Enfocada)

## Decisiones de diseño

### Geografía de Perú
Reemplazo `city` por `department` + `province` + `district` en Tenant, SportCenter y Field.
- En Lima la gente busca por **distrito** (Miraflores, Surco, La Molina)
- Fuera de Lima buscan por **departamento** (Arequipa, Cusco, Trujillo)
- `province` es opcional pero útil fuera de Lima

### Multi-deporte
Expando `Sport` con PADEL, MULTI_PURPOSE y OTHER para cubrir deportes adicionales sin sobre-expandir el enum.

### Características físicas del espacio
Agrego `surfaceType`, `isIndoor` y `hasLighting` a Field — filtros esenciales para búsqueda.

### Limpieza de código muerto
- Eliminar `rating` de SportCenter (no hay sistema de reviews)
- Eliminar `REVIEW` de PermissionResource (no hay modelo Review)
- Eliminar `createdByChatbot` de Reservation (no se usa en ningún router/UI)

---

## Cambios al schema

### Campos modificados en modelos existentes

| Modelo | Cambio | Justificación |
|--------|--------|---------------|
| **Tenant** | `city` → `department`, `+province`, `+district` | Geografía peruana |
| **Tenant** | `+reservations` relation | Acceso directo a reservas del tenant |
| **SportCenter** | `city` → `department`, `+province`, `-rating` | Geografía peruana, eliminar campo muerto |
| **Field** | `city` → `department`, `+province` | Geografía peruana |
| **Field** | `+surfaceType`, `+isIndoor`, `+hasLighting` | Filtros de búsqueda multi-deporte |
| **Reservation** | `-createdByChatbot`, `+tenantId`, `+notes` | Limpieza, reporting denormalizado, comentarios |

### Enums modificados

| Enum | Cambio |
|------|--------|
| `Sport` | +PADEL, +MULTI_PURPOSE, +OTHER |
| `PermissionResource` | -REVIEW |
| `NotificationType` | +RESERVATION_CANCELLED, +RESERVATION_REMINDER, +PAYMENT_CONFIRMED |

### Enums nuevos

| Enum | Valores |
|------|---------|
| `SurfaceType` | NATURAL_GRASS, SYNTHETIC_GRASS, CLAY, HARD_COURT, CONCRETE, PARQUET, SAND, RUBBER, OTHER |

### Lo que NO se tocó
- Session, Account, Verification — modelos de Better Auth
- Role, Permission, UserRole, RolePermission — RBAC está bien
- Locale, Translation — i18n está bien
- Feature, FieldFeature — catálogo de amenidades está bien
- Schedule, OperatingSchedule — horarios semanales están bien
- Payment, PaymentMethod — sistema de pagos está bien
- Notification (excepto enum NotificationType)

### Lo que se descartó de la propuesta original
- **Modelos nuevos**: FieldPricing, BlockedSlot, RecurringReservation, Favorite, AuditLog (se pueden agregar después)
- **User changes**: lastLoginAt, deletedAt (se pueden agregar después)
- **ReservationSource enum** y campos de lifecycle (confirmedAt, cancelledAt, cancelledBy)
- **Payment changes**: verifiedBy, verifiedAt, paidAt, transactionId, currency
- **Field booking rules**: minBookingMinutes, bufferMinutes, advanceBookingDays, cancellationHours, depositPercent
- **Misc**: whatsapp, currency/timezone en Tenant, Notification actionUrl, playerCapacity
