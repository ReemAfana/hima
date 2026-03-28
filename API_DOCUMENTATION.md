# Hima Backend API Documentation

## Base URL
```
http://127.0.0.1:8000/api
```

## Authentication
All protected routes require:
```
Authorization: Bearer {token}
Accept: application/json
```

---

## Auth Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/register` | No | Register as tenant or host |
| POST | `/login` | No | Login and get token |
| POST | `/logout` | Yes | Logout |
| GET | `/me` | Yes | Get current user + role |

---

## Property Endpoints (Public)
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/properties` | No | Search & filter properties |
| GET | `/properties/{id}` | No | View single property |
| GET | `/properties/{id}/reviews` | No | View property reviews |
| GET | `/users/{id}/reviews` | No | View user reviews |

### Search Filters (query params)
```
type, location, min_price, max_price, rooms,
min_area, max_area, damage_status,
has_water, has_electricity, is_ready
```

---

## Host Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/host/properties` | Yes | List my properties |
| POST | `/host/properties` | Yes | Submit new property |
| GET | `/host/properties/{id}` | Yes | View my property |
| PUT | `/host/properties/{id}` | Yes | Edit property |
| DELETE | `/host/properties/{id}` | Yes | Archive property |
| PATCH | `/host/properties/{id}/availability` | Yes | Toggle availability |
| GET | `/host/bookings` | Yes | List booking requests |
| PATCH | `/host/bookings/{id}/accept` | Yes | Accept booking |
| PATCH | `/host/bookings/{id}/reject` | Yes | Reject booking |

---

## Tenant Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/tenant/bookings` | Yes | List my bookings |
| POST | `/tenant/bookings` | Yes | Submit booking request |
| GET | `/tenant/bookings/{id}` | Yes | View booking |
| PUT | `/tenant/bookings/{id}` | Yes | Edit pending booking |
| DELETE | `/tenant/bookings/{id}` | Yes | Cancel pending booking |

---

## Contract Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/contracts` | Yes | List my contracts |
| GET | `/contracts/{id}` | Yes | View contract |
| PATCH | `/contracts/{id}/cancel` | Yes | Cancel contract |
| DELETE | `/contracts/{id}` | Yes (admin) | Archive contract |

---

## Review Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/reviews` | Yes | Submit review |

---

## Notification Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/notifications` | Yes | List my notifications |
| GET | `/notifications/unread-count` | Yes | Get unread count |
| PATCH | `/notifications/{id}/read` | Yes | Mark as read |
| PATCH | `/notifications/mark-all-read` | Yes | Mark all as read |

---
## Notification Types
| Type | Sent to | Trigger |
|------|---------|---------|
| `new_booking` | Host | Tenant submits booking request |
| `booking_accepted` | Tenant | Host accepts booking |
| `booking_rejected` | Tenant | Host rejects booking |
| `booking_edited` | Host | Tenant edits booking |
| `booking_cancelled` | Host | Tenant cancels booking |
| `contract_cancelled` | Other party | Tenant or host cancels contract |
| `property_approved` | Host | Admin approves property |
| `property_rejected` | Host | Admin rejects property |
| `review_received` | Reviewee | Someone submits a review |

---
## Admin Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/admin/properties` | Yes | List all properties |
| GET | `/admin/properties/pending` | Yes | List pending properties |
| PATCH | `/admin/properties/{id}/accept` | Yes | Accept property |
| PATCH | `/admin/properties/{id}/reject` | Yes | Reject property |
| DELETE | `/admin/properties/{id}` | Yes | Archive property |

---

## Roles
| Role | Access |
|------|--------|
| `admin` | Full platform control |
| `host` | Manage own properties & bookings |
| `tenant` | Search, book, review |

---

## Property Status Flow
```
pending → accepted → (available/booked/not_available)
pending → rejected
```

## Booking Status Flow
```
pending → accepted → (contract created)
pending → rejected
pending → cancelled (by tenant)
```

## Contract Status Flow
```
active → expired (automatic)
active → cancelled (by tenant or host)
```