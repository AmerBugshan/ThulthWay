# Way Menu | واي منيو

A production-ready bilingual (Arabic + English) diet meal subscription web app. Users choose a subscription type (Cutting / Maintenance / Bulk), select a meal plan, build a 5-day weekly meal schedule, and place an order — all in a premium dark-themed UI.

## Tech Stack

| Layer            | Technology                                         |
| ---------------- | -------------------------------------------------- |
| Frontend         | React 18, Vite, Tailwind CSS, Zustand, React Query |
| Backend          | Node.js 20, Express 4, Prisma ORM                  |
| Database         | PostgreSQL 16                                      |
| Object Storage   | RustFS (S3-compatible)                              |
| DB Admin         | pgAdmin 4                                          |
| Containerization | Docker & Docker Compose                            |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose v2+
- Git

## Quick Start

```bash
# 1. Clone the repo
git clone <repo-url> && cd ThulthWay

# 2. Copy the env file (already provided, review values if needed)
cp .env.example .env

# 3. Start all services (production)
docker compose up --build -d

# 4. Run database migrations and seed
docker exec -it tholth_api sh -c "npx prisma migrate deploy && npx prisma db seed"
```

For **development** with hot-reload:

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

## Services & Ports

| Service       | Container          | URL                          |
| ------------- | ------------------ | ---------------------------- |
| Frontend      | tholth_frontend    | http://localhost:3000         |
| Backend API   | tholth_api         | http://localhost:4000         |
| PostgreSQL    | tholth_db          | localhost:5432                |
| pgAdmin       | tholth_pgadmin     | http://localhost:5050         |
| RustFS Console| tholth_rustfs      | http://localhost:9001         |
| RustFS S3 API | tholth_rustfs      | http://localhost:9000         |

## pgAdmin Setup

1. Open http://localhost:5050
2. Login with:
   - Email: `admin@tholthway.com`
   - Password: `admin1234`
3. Add a new server:
   - **Host**: `db` (Docker service name)
   - **Port**: `5432`
   - **Username**: `tholth`
   - **Password**: `tholth_secure_2024`
   - **Database**: `tholthway`

## RustFS Console

1. Open http://localhost:9001
2. Login with:
   - Access Key: `tholth_admin`
   - Secret Key: `tholth_rustfs_2024`
3. The `meal-images` bucket is created automatically by the API on startup.

## Environment Variables

| Variable                  | Description                          | Default                    |
| ------------------------- | ------------------------------------ | -------------------------- |
| `POSTGRES_USER`           | PostgreSQL username                  | `tholth`                   |
| `POSTGRES_PASSWORD`       | PostgreSQL password                  | `tholth_secure_2024`       |
| `POSTGRES_DB`             | Database name                        | `tholthway`                |
| `POSTGRES_PORT`           | Exposed PostgreSQL port              | `5432`                     |
| `PGADMIN_DEFAULT_EMAIL`   | pgAdmin login email                  | `admin@tholthway.com`      |
| `PGADMIN_DEFAULT_PASSWORD`| pgAdmin login password               | `admin1234`                |
| `PGADMIN_PORT`            | pgAdmin web UI port                  | `5050`                     |
| `RUSTFS_ACCESS_KEY`       | RustFS / S3 access key               | `tholth_admin`             |
| `RUSTFS_SECRET_KEY`       | RustFS / S3 secret key               | `tholth_rustfs_2024`       |
| `RUSTFS_PORT`             | RustFS S3 API port                   | `9000`                     |
| `RUSTFS_CONSOLE_PORT`     | RustFS web console port              | `9001`                     |
| `RUSTFS_ENDPOINT`         | Internal RustFS endpoint             | `http://rustfs:9000`       |
| `RUSTFS_BUCKET`           | S3 bucket for meal images            | `meal-images`              |
| `API_PORT`                | Backend API port                     | `4000`                     |
| `DATABASE_URL`            | Prisma connection string             | (constructed from above)   |
| `NODE_ENV`                | Node environment                     | `production`               |
| `REACT_APP_API_URL`       | API URL for frontend                 | `http://localhost:4000`    |
| `FRONTEND_PORT`           | Frontend port                        | `3000`                     |

## Database Migrations & Seeding

```bash
# Run migrations
docker exec -it tholth_api npx prisma migrate deploy

# Seed the database with subscription types, plans, and meals
docker exec -it tholth_api npx prisma db seed

# Open Prisma Studio (in dev)
docker exec -it tholth_api_dev npx prisma studio
```

## API Endpoints

### Public

| Method | Endpoint               | Description                                    |
| ------ | ---------------------- | ---------------------------------------------- |
| GET    | `/api/health`          | Health check                                   |
| GET    | `/api/subscriptions`   | All subscription types with plans and prices   |
| GET    | `/api/meals`           | All meals (optional `?type=BREAKFAST` or `MAIN`)|
| GET    | `/api/meals/:id`       | Single meal with presigned image URL           |
| GET    | `/api/categories`      | All food categories                            |
| POST   | `/api/orders`          | Create order with weekly meal selections       |
| GET    | `/api/orders/:id`      | Retrieve order with meals and nutrition totals |

### Admin

| Method | Endpoint                              | Description                     |
| ------ | ------------------------------------- | ------------------------------- |
| GET    | `/api/admin/dashboard/stats`          | Dashboard analytics             |
| GET    | `/api/admin/subscriptions`            | List subscriptions              |
| POST   | `/api/admin/subscriptions`            | Create subscription type        |
| PUT    | `/api/admin/subscriptions/:id`        | Update subscription type        |
| DELETE | `/api/admin/subscriptions/:id`        | Delete subscription type        |
| POST   | `/api/admin/subscriptions/:subId/plans`| Create plan                    |
| PUT    | `/api/admin/plans/:id`                | Update plan                     |
| DELETE | `/api/admin/plans/:id`                | Delete plan                     |
| GET    | `/api/admin/categories`               | List categories                 |
| POST   | `/api/admin/categories`               | Create category                 |
| PUT    | `/api/admin/categories/:id`           | Update category                 |
| DELETE | `/api/admin/categories/:id`           | Delete category                 |
| GET    | `/api/admin/meals`                    | List all meals                  |
| POST   | `/api/admin/meals`                    | Create meal (multipart/form-data)|
| PUT    | `/api/admin/meals/:id`                | Update meal                     |
| DELETE | `/api/admin/meals/:id`                | Delete meal                     |
| GET    | `/api/admin/orders`                   | List orders with filters        |

## Project Structure

```
ThulthWay/
├── .env                        # Environment variables
├── .env.example                # Documented env template
├── docker-compose.yml          # Production Docker setup
├── docker-compose.dev.yml      # Development with hot-reload
├── backend/
│   ├── Dockerfile              # Production image
│   ├── Dockerfile.dev          # Dev image with nodemon
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.js             # Seed data
│   │   └── migrations/         # SQL migrations
│   └── src/
│       ├── index.js            # Express app entry
│       ├── s3.js               # RustFS S3 client
│       ├── middleware.js        # Error handling, multer
│       ├── controllers/        # Request handlers
│       ├── services/           # Business logic
│       ├── data-access/        # Prisma repositories
│       ├── models/             # Validation & parsing
│       └── routes/             # API route definitions
└── frontend/
    ├── Dockerfile              # Production (nginx)
    ├── Dockerfile.dev          # Dev (Vite HMR)
    ├── nginx.conf              # Nginx reverse proxy config
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx            # React entry point
        ├── App.jsx             # Root component
        ├── index.css           # Tailwind imports
        ├── lib/
        │   ├── api.js          # Axios API client
        │   └── i18n.js         # AR/EN translations
        ├── store/
        │   ├── useLanguageStore.js  # Language toggle (Zustand)
        │   └── useOrderStore.js     # Order state (Zustand)
        └── components/
            ├── Navbar.jsx
            ├── ProgressBar.jsx
            ├── NutritionBar.jsx
            ├── MealPickerModal.jsx
            ├── StepSubscription.jsx
            ├── StepPlan.jsx
            ├── StepWeek.jsx
            └── StepSummary.jsx
```
