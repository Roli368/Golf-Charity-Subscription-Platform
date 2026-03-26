# FairwayFund

FairwayFund is a high-density, ultra-premium SaaS platform that bridges competitive amateur golf with automated philanthropic impact. By logging your latest 5 Stableford scores, you generate a unique cryptographic vector that serves as your entry into the monthly, algorithm-driven draw pool.

## Features

- **Extreme Volumetric Glassmorphism**: Built on Tailwind CSS v4, the entire application utilizes deeply integrated physics—inputs glow on focus, buttons utilize complex CSS box-shadow panning, and hover states physically lift containers off the background.
- **Algorithmic Mathematics Engine**: Every financial metric on the dashboard evaluates mathematically on runtime using custom `<CountUp />` physics components, preventing static text renders and maximizing SaaS liveness.
- **Continuous Cursor Tracking**: A global interactive environment watches cursor velocity, emitting dynamic emerald and blue volumetric sweeps beneath the primary DOM structures.
- **Automated Philanthropy**: Intelligent distribution logic allocates a distinct percentage of a user's subscription automatically to the selected verified charity upon subscription processing.

## Tech Stack

- **Frontend Architecture**: Next.js 15 (App Router), React 19, TypeScript
- **Styling Matrix**: Tailwind CSS v4, Lucide React (Vector System)
- **Database & Authentication**: Supabase (PostgreSQL, Row Level Security)
- **Financial Processing**: Stripe (Webhooks, Checkout Sessions)

## Local Development Checklist

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` over to `.env.local` and configure your Supabase local or remote keys.
4. Execute the SQL schema definition located within `supabase/migrations/` inside your database dashboard.
5. Initialize the development server: `npm run dev`
6. Access the engine at `http://localhost:3000`.

*Looking for production deployment instructions? Refer to the `DEPLOYMENT.md` guide.*
