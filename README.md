## PROJECT DESCRIPTION

This project is a full-stack AI-powered meal planning SaaS application built with Next.js, TypeScript, Tailwind CSS, and Prisma. It features secure user authentication using Clerk, subscription-based access via Stripe, and AI-driven meal plan generation using OpenAI. The app includes a modular UI with reusable components and protected routes managed through Next.js middleware. Users can sign up, manage their profiles, and subscribe to premium plans, with payment processing and billing handled through Stripe. The backend includes robust API routes for managing subscriptions and user data. The core functionality centers around generating personalized meal plans through AI, delivered in a clean, responsive UI. The project was thoroughly tested, debugged, and refined to ensure a smooth, production-ready experience.

## Getting Started



First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# to start the prisma db
npm run prisma init

# to add seed the prisma db
npx prisma migrate dev --name init

acct_1RbNrFCju2XntLDd


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
