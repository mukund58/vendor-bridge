# vendor odoo hackathon

# Member 1 — Backend + Database + Business Logic

### Responsibilities

#### Authentication & Roles

* Login
* Signup
* JWT/Auth
* RBAC (Admin, Vendor, Manager, Procurement Officer)

#### Database Design

Create all entities:

```text
User
Vendor
RFQ
Quotation
Approval
PurchaseOrder
Invoice
ActivityLog
```

#### APIs

* Vendor CRUD
* RFQ CRUD
* Quotation Submission
* Approval APIs
* PO Generation
* Invoice Generation

#### Business Workflow

```text
RFQ
 ↓
Quotation
 ↓
Approval
 ↓
PO
 ↓
Invoice
```

This is the heart of the project.

#### PDF & Email

* Generate Invoice PDF
* Send invoice email


# Backend Folder Structure

```text
src/
├── Controllers
│   ├── AuthController
│   ├── VendorController
│   ├── RFQController
│   ├── QuotationController
│   ├── ApprovalController
│   ├── PurchaseOrderController
│   ├── InvoiceController
│   ├── ReportController
│   └── ActivityController
│
├── Services
│   ├── AuthService
│   ├── VendorService
│   ├── RFQService
│   ├── QuotationService
│   ├── ApprovalService
│   ├── PurchaseOrderService
│   ├── InvoiceService
│   └── ReportService
│
├── Repositories
├── DTOs
├── Entities
├── Middleware
├── Config
└── Utils
```

---

# Backend Ownership

## Module 1 — Auth

### Tables

```sql
users
```

### APIs

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

### Features

* JWT Authentication
* Password hashing
* RBAC

Roles:

```text
ADMIN
PROCUREMENT_OFFICER
MANAGER
VENDOR
```

---

# Module 2 — Vendor

### Tables

```sql
vendors
```

### Entity

```text
Vendor
 ├─ id
 ├─ company_name
 ├─ gst_number
 ├─ category
 ├─ contact_person
 ├─ email
 ├─ phone
 └─ status
```

### APIs

```http
GET /vendors
GET /vendors/{id}
POST /vendors
PUT /vendors/{id}
PATCH /vendors/{id}/status
```

---

# Module 3 — RFQ

## Tables

```sql
rfqs
rfq_items
rfq_vendors
```

### Relationship

```text
RFQ
 ├─ many items
 └─ many vendors
```

### APIs

```http
POST /rfqs
GET /rfqs
GET /rfqs/{id}
POST /rfqs/{id}/publish
```

---

## RFQ Workflow

```text
Draft
 ↓
Published
 ↓
Quotation Received
 ↓
Under Review
 ↓
Completed
```

Store as enum.

---

# Module 4 — Quotation

### Tables

```sql
quotations
quotation_items
```

### Relationship

```text
RFQ
 └── Quotations

Quotation
 └── QuotationItems
```

### APIs

```http
POST /quotations
GET /quotations/{id}
GET /vendor/quotations
```

### Business Rules

Vendor can:

```text
Create quotation
Edit quotation until deadline
Submit quotation
```

---

# Module 5 — Comparison

### API

```http
GET /rfqs/{id}/comparison
```

Backend should calculate:

```text
Lowest Price
Fastest Delivery
Average Rating
```

Response:

```json
{
  "winnerSuggestion": "Infra Supplies",
  "lowestPrice": true
}
```

---

# Module 6 — Approval Workflow

### Tables

```sql
approvals
```

### Entity

```text
Approval

id
rfq_id
quotation_id
approver_id
level
status
remarks
approved_at
```

### APIs

```http
GET /approvals/pending
POST /approvals/{id}/approve
POST /approvals/{id}/reject
```

---

# Approval State Machine

```text
PENDING
 ↓
L1_APPROVED
 ↓
L2_APPROVED
 ↓
PO_GENERATED
```

or

```text
PENDING
 ↓
REJECTED
```

---

# Module 7 — Purchase Order

### Tables

```sql
purchase_orders
purchase_order_items
```

### Generate Automatically

When final approval happens:

```text
Approval Approved
        ↓
Generate PO
```

### APIs

```http
POST /purchase-orders
GET /purchase-orders
GET /purchase-orders/{id}
```

---

### PO Number Generator

```text
PO-2025-0001
PO-2025-0002
PO-2025-0003
```

Create helper service.

---

# Module 8 — Invoice

### Tables

```sql
invoices
invoice_items
```

### Generate Automatically

```text
PO
 ↓
Invoice
```

### APIs

```http
POST /invoices
GET /invoices
GET /invoices/{id}
PATCH /invoices/{id}/mark-paid
```

---

## Invoice Status

```text
DRAFT
SENT
PENDING_PAYMENT
PAID
OVERDUE
```

---

# Module 9 — PDF Service

Used by:

```http
GET /invoices/{id}/pdf
```

Generate:

```text
Vendor Info
Items
GST
Total
PO Number
Invoice Number
```

---

# Module 10 — Email Service

```http
POST /invoices/{id}/email
```

Workflow:

```text
Generate PDF
Attach PDF
Send Email
```

Can use:

```text
SMTP
Mailtrap
SendGrid
```

---

# Module 11 — Activity Logs

### Table

```sql
activity_logs
```

### Entity

```text
id
user_id
action
entity_type
entity_id
created_at
```

Examples:

```text
Vendor Created
RFQ Published
Quotation Submitted
Approval Approved
PO Generated
Invoice Paid
```

### APIs

```http
GET /activities
```

---

# Module 12 — Reports

### APIs

```http
GET /reports/summary
GET /reports/vendors
GET /reports/monthly-trend
GET /reports/export
```


---

# Critical End-to-End Flow To Finish First

```text
Login
 ↓
Create Vendor
 ↓
Create RFQ
 ↓
Assign Vendors
 ↓
Submit Quotation
 ↓
Compare Quotations
 ↓
Approve
 ↓
Generate PO
 ↓
Generate Invoice
 ↓
Download PDF
```




---

# Member 2 — Frontend + Dashboard + UX

### Responsibilities

#### UI Design

* Layout
* Sidebar
* Navbar
* Responsive pages

#### Screens

```text
Login
Dashboard
Vendor Management
RFQ Creation
Quotation Submission
Quotation Comparison
Approval Workflow
PO & Invoice
Reports
```

#### Dashboard

* Analytics cards
* Charts
* Statistics

#### Tables

* Search
* Filter
* Sorting
* Pagination

#### Role-based UI

Show different menus for:

* Admin
* Vendor
* Manager
* Procurement Officer

---

# Integration Points


---

# Base URL

```http
/api/v1
```

---

# 1. Authentication

## Login

```http
POST /auth/login
```

Request

```json
{
  "email": "admin@vendorbridge.com",
  "password": "password123"
}
```

Response

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Admin",
    "role": "ADMIN"
  }
}
```

---

## Register

```http
POST /auth/register
```

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@gmail.com",
  "phone": "9876543210",
  "country": "India",
  "role": "PROCUREMENT_OFFICER",
  "password": "password123"
}
```

---

## Current User

```http
GET /auth/me
```

---

# 2. Dashboard

Matches Screen 3

## Dashboard Summary

```http
GET /dashboard
```

Response

```json
{
  "activeRfqs": 12,
  "pendingApprovals": 5,
  "monthlySpend": 230000,
  "overdueInvoices": 3,
  "recentPurchaseOrders": []
}
```

---

# 3. Vendor Module

Matches Screen 4

## Get Vendors

```http
GET /vendors
```

Filters

```http
GET /vendors?status=ACTIVE
GET /vendors?search=infra
```

Response

```json
[
  {
    "id": 1,
    "name": "Infra Supplies",
    "gstNumber": "24ABCDE1234",
    "category": "Construction",
    "status": "ACTIVE"
  }
]
```

---

## Vendor Details

```http
GET /vendors/{id}
```

---

## Create Vendor

```http
POST /vendors
```

---

## Update Vendor

```http
PUT /vendors/{id}
```

---

## Block Vendor

```http
PATCH /vendors/{id}/status
```

```json
{
  "status": "BLOCKED"
}
```

---

# 4. RFQ Module

Matches Screen 5

---

## Create RFQ

```http
POST /rfqs
```

```json
{
  "title": "Office Furniture Q2",
  "category": "Furniture",
  "description": "Chairs and desks",
  "deadline": "2025-06-15",
  "vendors": [1,2,3],
  "items": [
    {
      "itemName": "Chair",
      "quantity": 25,
      "unit": "NOS"
    }
  ]
}
```

---

## Get RFQs

```http
GET /rfqs
```

---

## RFQ Details

```http
GET /rfqs/{id}
```

Response

```json
{
  "id": 1,
  "title": "Office Furniture",
  "vendors": [],
  "items": []
}
```

---

## Publish RFQ

```http
POST /rfqs/{id}/publish
```

---

## Draft RFQ

```http
POST /rfqs/{id}/draft
```

---

# 5. Quotation Module

Matches Screen 6

---

## Get RFQs Available To Vendor

```http
GET /vendor/rfqs
```

---

## Submit Quotation

```http
POST /quotations
```

```json
{
  "rfqId": 1,
  "items": [
    {
      "itemId": 1,
      "unitPrice": 3500,
      "deliveryDays": 7
    }
  ],
  "gstPercentage": 18,
  "notes": "Payment within 30 days"
}
```

---

## My Quotations

```http
GET /vendor/quotations
```

---

## Quotation Details

```http
GET /quotations/{id}
```

---

# 6. Quotation Comparison

Matches Screen 7

---

## Compare Quotations

```http
GET /rfqs/{id}/comparison
```

Response

```json
{
  "rfqId": 1,
  "quotations": [
    {
      "quotationId": 1,
      "vendor": "Infra Supplies",
      "amount": 185000,
      "deliveryDays": 10,
      "rating": 4.5
    }
  ]
}
```

---

## Select Winning Quotation

```http
POST /rfqs/{id}/select-quotation
```

```json
{
  "quotationId": 1
}
```

---

# 7. Approval Workflow

Matches Screen 8

---

## Approval Queue

```http
GET /approvals/pending
```

---

## Approval Details

```http
GET /approvals/{id}
```

---

## Approve

```http
POST /approvals/{id}/approve
```

```json
{
  "remarks": "Looks good"
}
```

---

## Reject

```http
POST /approvals/{id}/reject
```

```json
{
  "remarks": "Price too high"
}
```

---

# 8. Purchase Orders

---

## Generate PO

```http
POST /purchase-orders
```

```json
{
  "quotationId": 1
}
```

---

## Get Purchase Orders

```http
GET /purchase-orders
```

---

## Purchase Order Details

```http
GET /purchase-orders/{id}
```

---

# 9. Invoice Module

Matches Screen 9

---

## Generate Invoice

```http
POST /invoices
```

```json
{
  "purchaseOrderId": 1
}
```

---

## Invoice Details

```http
GET /invoices/{id}
```

---

## List Invoices

```http
GET /invoices
```

---

## Mark Invoice Paid

```http
PATCH /invoices/{id}/mark-paid
```

---

## Download PDF

```http
GET /invoices/{id}/pdf
```

Returns PDF.

---

## Email Invoice

```http
POST /invoices/{id}/email
```

---

# 10. Activity Logs

Matches Screen 10

---

## Activity Feed

```http
GET /activities
```

Filters

```http
GET /activities?type=RFQ
GET /activities?type=APPROVAL
```

Response

```json
[
  {
    "id": 1,
    "action": "RFQ Published",
    "timestamp": "2025-05-22T10:30:00"
  }
]
```

---

# 11. Reports

Matches Screen 11

---

## Procurement Analytics

```http
GET /reports/summary
```

Response

```json
{
  "totalSpend": 1240000,
  "activeVendors": 28,
  "poFulfillment": 94,
  "overdueInvoices": 3
}
```

---

## Vendor Analytics

```http
GET /reports/vendors
```

---

## Monthly Trend

```http
GET /reports/monthly-trend
```

---

## Export Report

```http
GET /reports/export?format=pdf
```

or

```http
GET /reports/export?format=excel
```

---

# Minimum Tables Needed

```text
users
vendors

rfqs
rfq_items
rfq_vendors

quotations
quotation_items

approvals

purchase_orders
purchase_order_items

invoices
invoice_items

activity_logs
```





## Database Relationship Diagram

```mermaid
erDiagram

    USERS {
        int id PK
        string name
        string email
        string password_hash
        string role
        datetime created_at
    }

    VENDORS {
        int id PK
        string company_name
        string gst_number
        string category
        string status
        string contact_person
        string email
        string phone
    }

    RFQS {
        int id PK
        string title
        text description
        datetime deadline
        string status
        int created_by FK
    }

    RFQ_VENDORS {
        int id PK
        int rfq_id FK
        int vendor_id FK
    }

    QUOTATIONS {
        int id PK
        int rfq_id FK
        int vendor_id FK
        decimal total_price
        int delivery_days
        text notes
        string status
        datetime submitted_at
    }

    APPROVALS {
        int id PK
        int quotation_id FK
        int approver_id FK
        string status
        text remarks
        datetime approved_at
    }

    PURCHASE_ORDERS {
        int id PK
        string po_number
        int quotation_id FK
        datetime created_at
        string status
    }

    INVOICES {
        int id PK
        string invoice_number
        int purchase_order_id FK
        decimal subtotal
        decimal tax_amount
        decimal total_amount
        string status
        datetime created_at
    }

    ACTIVITY_LOGS {
        int id PK
        int user_id FK
        string action
        string entity_type
        int entity_id
        datetime created_at
    }

    USERS ||--o{ RFQS : creates
    USERS ||--o{ APPROVALS : approves
    USERS ||--o{ ACTIVITY_LOGS : performs

    RFQS ||--o{ RFQ_VENDORS : assigned_to
    VENDORS ||--o{ RFQ_VENDORS : invited

    RFQS ||--o{ QUOTATIONS : receives
    VENDORS ||--o{ QUOTATIONS : submits

    QUOTATIONS ||--|| APPROVALS : reviewed
    QUOTATIONS ||--|| PURCHASE_ORDERS : generates
    PURCHASE_ORDERS ||--|| INVOICES : creates
```


---

## Workflow Diagram (Also GitHub Compatible)


```mermaid
flowchart LR

A[Procurement Officer]
--> B[Create RFQ]

B --> C[Invite Vendors]

C --> D[Vendor Submit Quotations]

D --> E[Compare Quotations]

E --> F[Manager Approval]

F -->|Approved| G[Generate Purchase Order]

G --> H[Generate Invoice]

H --> I[Print PDF]

H --> J[Send Email]

J --> K[Reports & Analytics]
I --> K
```


---

## Simplified Domain Model

This is the mental model judges will care about:

```text
User
 │
 ├── Creates RFQ
 │
RFQ
 │
 ├── Assigned to Vendors
 │
 └── Receives Quotations
          │
          ▼
      Quotation
          │
          ▼
      Approval
          │
          ▼
   Purchase Order
          │
          ▼
       Invoice
```

### Division

**Member 1**

* Users
* RFQs
* Quotations
* Approvals
* Database

**Member 2**

* Vendors
* Purchase Orders
* Invoices
* Dashboard
* Reports/UI

