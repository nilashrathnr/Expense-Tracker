# Personal Finance & Expense Tracker App

A responsive web application for managing personal finances — track, visualize, and analyze your expenses. Built using modern tools and frameworks:

**Backend:** Supabase (PostgreSQL + Auth)
**Frontend:** Next.js 14 + Shadcn UI (Tailwind-based components)
**Payments (optional):** Stripe Integration (pending)
**Notifications (optional):** Resend
**Hosting:** Vercel (pending)

---

## Features

- ✅ Add, edit, and delete expense entries
- 📊 Visual analytics (pie chart, bar chart)
- 🗓 Monthly and category-wise tracking
- ₹ Indian Rupee formatting using `Intl.NumberFormat`
- 🔒 Supabase auth (sign in/up)
- 🔄 Real-time database sync

---

## Tech Stack

| Tech        | Purpose                |
|-------------|------------------------|
| **Next.js** | Frontend + API Routes  |
| **Supabase**| DB, Auth, Realtime     |
| **Shadcn**  | UI Components (Tailwind)|
| **Stripe**  | (Optional) Payments    |
| **Resend**  | (Optional) Emails      |
| **Vercel**  | Deployment + Analytics |

---
## STEPS TO BE FOLLOWED
1. **Clone the repo**

```
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker  
```
2. Install dependencies
```
npm install
# or
yarn install
```
3.Set up .env.local

Create a .env.local file and add your Supabase project keys:

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key (optional)

4. Run the dev server
```
npm run dev
# or
yarn dev
```
## 5. Downgrade date-fns
Edit your package.json:

"dependencies": {
  "date-fns": "^3.6.0", // or ^2.29.3
  "react-day-picker": "^8.10.1",
  ...
}
Then:
```
rm -rf node_modules package-lock.json
npm install
```


