# Car Rental — Server Action (Next.js + Prisma + MySQL)

A small Next.js app implementing a server action to process car rental returns:
- Accepts return data from client (staff only)
- Updates Rental and related Car via Prisma (transaction)
- Notifies the customer: "Your rental has been processed."

## Tech
- Next.js 13+ (App Router, Server Actions)
- TypeScript
- Prisma ORM (MySQL)
- Zod (validation)
- Jest (unit tests)

## Folder Structure
car-rental/
├─ app/
│  ├─ actions/rentals/
│  │  ├─ common.ts
│  │  ├─ types.ts
│  │  ├─ returnCar.ts            # "use server" — main action
│  │  ├─ route.ts                # POST API wrapper
│  │  └─ __tests__/returnCar.test.ts
│  ├─ (dashboard)/rentals/page.tsx
│  ├─ layout.tsx
│  ├─ globals.css
│  └─ page.tsx
├─ lib/
│  ├─ prisma.ts
│  ├─ auth.ts
│  └─ notifications.ts
├─ prisma/
│  └─ schema.prisma
├─ jest.config.js
├─ package.json
├─ tsconfig.json
└─ .env.example

## Prerequisites
- Node 18+
- Yarn
- MySQL (WAMP)

## Setup

1) Install deps
```bash
yarn install
```

2) Environment
- Create a database (phpMyAdmin or MySQL console):
```sql
CREATE DATABASE IF NOT EXISTS car_rental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
- Copy .env.example to .env and update DATABASE_URL.
  - If root has no password:
    DATABASE_URL="mysql://root@127.0.0.1:3306/car_rental"
  - If using a password, URL‑encode special chars (@ → %40, ! → %21).

3) Prisma
```bash
yarn prisma generate
yarn prisma migrate dev --name init
```

4) Run
```bash
yarn dev
```
App: http://localhost:3000

## Server Action
- app/actions/rentals/returnCar.ts
- Validates input (Zod), checks auth (mock), updates Rental + Car in a transaction, and calls notifyCustomer with "Your rental has been processed."

## API Endpoint
- POST /app/actions/rentals/route.ts (App Router)
Example:
```bash
curl -X POST http://localhost:3000/app/actions/rentals \
  -H "Content-Type: application/json" \
  -d '{
    "rentalId": "550e8400-e29b-41d4-a716-446655440000",
    "odometerEnd": 1000
  }'
```

## Tests
```bash
yarn jest
```

## Type Check
```bash
yarn tsc --noEmit
```

## Troubleshooting (MySQL auth P1000)
- Try 127.0.0.1 instead of localhost in DATABASE_URL.
- Confirm credentials via phpMyAdmin.
- If needed, create a dedicated user:
```sql
CREATE USER 'car_user'@'localhost' IDENTIFIED BY 'StrongP@ss!';
GRANT ALL PRIVILEGES ON car_rental.* TO 'car_user'@'localhost';
FLUSH PRIVILEGES;
```
Then:
DATABASE_URL="mysql://car_user:StrongP%40ss%21@127.0.0.1:3306/car_rental"

## Notes
- notifyCustomer and auth are mocked for the test task.
- The code compiles with TypeScript and uses Prisma enums on MySQL.