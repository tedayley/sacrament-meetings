This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Sacrament Meeting Planner setup

Install dependencies, then generate a random secret with Node and copy it into `.env.local` as `AUTH_SECRET`:

```sh
npm install
node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("base64url") + "\n")'
```

Add these values to `.env.local`:

- `AUTH_SECRET`: a private random value generated with the Node command above.
- `AUTH_USER_EMAIL`: the email address allowed to manage meetings.
- `AUTH_USER_PASSWORD_HASH`: a bcrypt hash of that user's password. Generate it locally with the installed `bcryptjs` package; never store the plaintext password in this variable or commit it.
- `DATABASE_URL`: the existing Neon database connection string.
- `NEXT_PUBLIC_SITE_URL` (optional): the deployed site's full origin, such as `https://planner.example.com`. Vercel's `VERCEL_URL` is used when this is not set.

In Bash, generate the hash interactively without echoing the password or putting it in shell history:

```sh
read -s -p "Password to hash: " password
printf '\n'
printf '%s' "$password" | node -e 'let value = ""; process.stdin.on("data", (chunk) => value += chunk); process.stdin.on("end", async () => console.log(await require("bcryptjs").hash(value, 12)))'
unset password
```

When copying the bcrypt hash into `.env.local`, escape each `$` as `\$`. Next.js expands dollar signs in environment files; the backslashes keep the hash intact and are removed from the value at runtime.

Authentication uses an Auth.js Credentials provider for a single administrator account. The password is checked against its bcrypt hash, and Auth.js stores the session in its encrypted JWT cookie. The `/meetings/new` and `/meetings/[id]/edit` pages require a session; meeting creation, editing, and deletion Server Actions also verify the session. Public meeting browsing and the existing meeting API remain available without signing in.

Start the app with `npm run dev`. Sign in at `/login` using the configured email and the password used to create the hash. Invalid credentials display an error. Use **Sign Out** on an authenticated meeting-management page to end the session; afterward, attempting to open a protected page redirects to `/login`.

## Metadata

The root layout defines the site title, title template, description, and Open Graph title, description, site name, type, and deployment URL when available. `/meetings` and `/login` provide route-specific titles and descriptions.

There is not yet a suitable social sharing image in the project. Add a 1200 x 630 image named `opengraph-image.png` to `app/` to provide a site-wide Open Graph image; Next.js will include it automatically.
