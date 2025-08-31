#  FinanceAI – Smart Money Management

A modern **Next.js 14** landing page for a finance tracking app.
Built with **Tailwind CSS, shadcn/ui, Radix UI, and Framer Motion** for a beautiful, responsive, and performant user experience.

<img width="1898" height="910" alt="image" src="https://github.com/user-attachments/assets/b8d273c0-a642-44a4-9d66-b4e6dcffc61a" />


##  Features

* **Next.js 14 + App Router** – SEO-friendly, fast rendering
* **shadcn/ui + Tailwind CSS** – Clean, consistent design system
* **Interactive Demo Section** – Showcases real-time financial tracking flow
* **Animated Stats** – Powered by `NumberTicker` for smooth counters
* **Google Sign-in CTA** – Example authentication button ready to integrate
* **Responsive Layout** – Works seamlessly on desktop & mobile
* **Dark Mode Support** – Uses Tailwind’s dark theme utilities


##  Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/financeai-landing.git
cd financeai-landing
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the dev server

```bash
npm run dev
```

Then visit  `http://localhost:3000`



##  Project Structure

```
src/
 ├─ app/                  # Next.js app router pages
 ├─ components/
 │   ├─ ui/               # shadcn/ui wrapped components
 │   ├─ landing/          # Landing-specific components (CTA, Demo, etc.)
 │   └─ magicui/          # Animated widgets (NumberTicker, etc.)
 ├─ styles/               # Tailwind styles & globals
 └─ lib/                  # Utilities & helpers
```

---

## UI & Libraries Used

* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/) (Radix-based components)
* [Framer Motion](https://www.framer.com/motion/) – animations
* [Lucide Icons](https://lucide.dev/) – modern icon set



## Preview

### Demo Section

* **Step-based flow** (`Type → Confirm → View insights`)
* Card with income/expense breakdown
* Category distribution with colored dots

### CTA Section

* Gradient headline with **NumberTicker animated stats**
* Google Sign-in + Demo button
* Trust signals (`No credit card required • Free forever`)



## Environment Setup

For Google sign-in (optional), configure an **OAuth client** and set your env vars:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-client-secret
```



##  License

MIT – Free to use, modify, and distribute.


