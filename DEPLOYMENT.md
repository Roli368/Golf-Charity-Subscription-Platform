# Production Deployment Architecture

This guide details the exact steps required to deploy FairwayFund into a production environment, ensuring database integrity and secure financial processing.

## Core Infrastructure
We recommend **Vercel** for the frontend rendering engine, **Supabase** (Managed) for the PostgreSQL database, and **Stripe** for payment processing.

---

### Phase 1: Supabase Configuration (Database & Auth)
1. **Create Project**: Initialize a new project in your Supabase dashboard.
2. **Execute Migrations**: Navigate to the SQL Editor and execute both migration files sequentially:
   - `20260325000000_init_schema.sql` (Creates core tables: profiles, charities, scores, draws, and RLS policies).
   - `20260325000001_auth_trigger.sql` (Initializes the automated function that creates a `public.profiles` entry when a user authenticates).
3. **Configure Providers**: Ensure Email Auth is enabled under Authentication > Providers. Disable "Confirm Email" if you wish to allow instant onboarding during beta.
4. **Seed Database**: The platform requires charity data to render properly. Execute standard `INSERT` rows into the `charities` table via SQL or the Table Editor.

---

### Phase 2: Stripe Configuration (Payments)
1. **Initialize Products**: Inside the Stripe Dashboard, create your subscription product (e.g., "$5/month"). Note the `price_...` ID.
2. **Setup API Keys**: Retrieve your *Publishable Key* and *Secret Key*.
3. **Configure Webhooks**: 
   - Point your webhook to `https://[YOUR_VERCEL_DOMAIN]/api/webhooks/stripe`.
   - Select events: `checkout.session.completed` and `customer.subscription.updated`.
   - Copy the *Webhook Signing Secret*.

---

### Phase 3: Vercel Deployment (Frontend Engine)
1. Push your absolute finalized code to a GitHub repository.
2. Import the project into Vercel. Ensure the framework preset is set to **Next.js**.
3. **Inject Environment Variables**: Add the following securely to your Vercel project configuration:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Required for secure backend overrides, keep this hidden).
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Click **Deploy**. Vercel will auto-compile the TypeScript and Tailwind v4 engine.

---

### Phase 4: Final Validation
- [ ] Authenticate a new test user account at `https://your-domain.com/signup`.
- [ ] Ensure the trigger correctly inserts row data into the Supabase `profiles` table.
- [ ] Run a test transaction using Stripe test-mode credit cards. Verify the `subscription_status` column ticks to `active`.
- [ ] Navigate to the Dashboard overview and verify that all interactive vector animations, counting physics, and background sweep animations maintain 60 FPS on production hardware.
