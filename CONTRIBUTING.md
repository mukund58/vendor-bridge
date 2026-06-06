
## Repository Setup

```text
main
│
├── frontend
└── backend
```

---

# Initial Setup (9:00 AM)

You create repo:

```bash
git init
git remote add origin <repo>
```

### First Commit

```bash
git commit -m "chore: initialize vendorbridge project"
git push origin main
```

---

# Branch Strategy

### Backend Guy

```text
backend/dev
```

### Frontend Guy

```text
frontend/dev
```

Create:

```bash
git checkout -b backend/dev
git push -u origin backend/dev

git checkout -b frontend/dev
git push -u origin frontend/dev
```

No one touches `main`.

---

# Stage 1 (9:00 → 11:00)

## Backend

Auth + Database + Vendor

Branch:

```text
backend/dev
```

Commits:

```bash
git commit -m "feat(auth): add jwt authentication"

git commit -m "feat(database): create core entities"

git commit -m "feat(vendor): implement vendor crud"
```

---

## Frontend

Layout + Login + Sidebar

Branch:

```text
frontend/dev
```

Commits:

```bash
git commit -m "feat(ui): setup application layout"

git commit -m "feat(auth): create login page"

git commit -m "feat(nav): add sidebar navigation"
```

---

# Merge Checkpoint #1 (11:00)

Backend:

```bash
git checkout main
git merge backend/dev
git push
```

Frontend:

```bash
git pull origin main
```

Now frontend gets:

```text
API URLs
DTOs
Database contracts
```

---

# Stage 2 (11:00 → 1:00)

## Backend

RFQ + Quotations

```bash
git commit -m "feat(rfq): create rfq management api"

git commit -m "feat(quotation): add quotation submission workflow"
```

---

## Frontend

Vendor Screen + RFQ Screen

```bash
git commit -m "feat(vendor): implement vendor management ui"

git commit -m "feat(rfq): implement rfq creation screen"
```

---

# Merge Checkpoint #2 (1:00 PM)

Backend merges.

Frontend pulls.

Now frontend starts consuming actual APIs.

---

# Stage 3 (1:00 → 3:00)

## Backend

Approval + Comparison

```bash
git commit -m "feat(comparison): implement quotation comparison"

git commit -m "feat(approval): add approval workflow"
```

---

## Frontend

Comparison Screen + Approval Screen

```bash
git commit -m "feat(comparison): create quotation comparison page"

git commit -m "feat(approval): create approval workflow page"
```

---

# Merge Checkpoint #3 (3:00 PM)

Backend merges.

Frontend pulls.

Test:

```text
RFQ
↓
Quotation
↓
Approval
```

---

# Stage 4 (3:00 → 4:30)

## Backend

PO + Invoice + PDF

```bash
git commit -m "feat(po): generate purchase orders"

git commit -m "feat(invoice): implement invoice generation"

git commit -m "feat(pdf): add invoice pdf export"
```

---

## Frontend

Invoice Screen

```bash
git commit -m "feat(invoice): implement invoice view"

git commit -m "feat(invoice): add pdf download action"
```

---

# Final Merge (4:30 PM)

Backend:

```bash
git checkout main
git merge backend/dev
git push
```

Frontend:

```bash
git checkout main
git merge frontend/dev
git push
```

---

# Commit Rules

Never do:

```bash
git commit -m "update"
git commit -m "changes"
git commit -m "fix"
```

Use:

```bash
feat(auth): add login endpoint

feat(vendor): create vendor crud

feat(rfq): implement rfq workflow

fix(invoice): correct gst calculation

refactor(approval): simplify workflow logic
```

---

# Avoid Merge Conflicts

### Backend Guy touches only:

```text
/backend
/docs/api.md
```

### Frontend Guy touches only:

```text
/frontend
```

### Shared File

Create once:

```text
docs/api-contracts.md
```

When API changes:

```bash
git commit -m "docs(api): update quotation contract"
```

---

# Most Important

At **12 PM**, don't wait for real backend.

Frontend should use mock data:

```js
const quotations = [
  {
    vendor: "Infra Supplies",
    amount: 185000
  }
];
```

Then switch to API later.

That way both of you work in parallel and don't block each other. A lot of hackathon teams lose 2–3 hours waiting for APIs to be finished.
