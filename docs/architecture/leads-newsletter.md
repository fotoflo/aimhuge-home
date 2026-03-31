# Leads & Newsletter System

## Overview

The site captures leads (email or WhatsApp) across all major marketing pages via the `NewsletterCTA` component and a dedicated `/contact` page. Data is stored in Supabase and notifications are sent via Resend.

## Key Files

| File | Purpose |
|------|---------|
| `src/app/actions/subscribe.ts` | Next.js Server Action. Validates input, inserts into Supabase `leads` table, and sends a notification email via Resend API. |
| `src/app/(site)/components/NewsletterCTA.tsx` | Highly interactive client component with dark-mode aesthetic, dynamic email/phone icons, loading spinner, and checkmark success states. |
| `src/app/(site)/contact/page.tsx` | Dedicated hub for the fast-track Calendly link, newsletter signup, email, and social links. |
| `supabase/migrations/*_create_leads_table.sql` | Supabase migration defining the `leads` table with RLS permitting anonymous inserts. |
| `.env.local` | Contains `RESEND_API_KEY` and `RESEND_MAILERS_FROM_EMAIL` used by the server action. |

## Data Flow

1. **User Interaction**: User enters an email or phone number in `NewsletterCTA` on any page (Home, Contact, About, Workshop, etc.).
2. **Component State**: Client component transitions to a loading state and calls the `subscribeAction` server action via React 19 Forms/Server Actions.
3. **Validation**: `subscribeAction` validates the input using basic regex for email and phone numbers.
4. **Storage**: Data is securely inserted into the Supabase `leads` table (tracking `contact_info`, `source_page`, and `created_at`).
5. **Notification**: A `fetch` request is sent to `api.resend.com/emails` to dispatch an email summary to `alex@aimhuge.com`.
6. **Response**: Server action returns `{ success: true }`, prompting the client component to transition to its successful "CheckCircle" pulse state.

## Important Patterns

- **RLS Security**: The `leads` table allows anonymous inserts but restricts reads to authenticated admins only. 
- **Graceful Degradation**: If the Resend API fails, the server action logs the error but still returns `success: true` as long as the Supabase insertion was successful.
