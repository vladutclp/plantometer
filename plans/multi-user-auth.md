# Multi-User Auth Plan — Plantometer

## Context

Plantometer is currently single-user. The goal is to support multiple users where:
- The **plant catalog is shared** — any user can add plants, all users see them
- **Intake logs are private** — each user only sees their own diary
- Auth is built with **NextAuth.js Credentials provider** (email + password) as a learning exercise, with a clear upgrade path to Google OAuth later

Existing intakes (no userId) are left nullable for now. After the user's first sign-up, a one-time SQL command assigns all orphaned intakes to their account.

---

## Database Changes

**File:** `prisma/schema.prisma`

Add `User` model. Add nullable `userId` to `PlantIntake`. Plant is unchanged.

```prisma
model User {
  id        String        @id @default(cuid())
  email     String        @unique
  name      String?
  password  String        // bcrypt hash, never plain text
  createdAt DateTime      @default(now())
  intakes   PlantIntake[]
}

model PlantIntake {
  id      Int      @id @default(autoincrement())
  plantId Int
  userId  String?  // nullable for backward compat with existing rows
  plant   Plant    @relation(fields: [plantId], references: [id])
  user    User?    @relation(fields: [userId], references: [id])
  date    DateTime @db.Date
}
```

Run: `npx prisma migrate dev --name add_user_auth`

---

## New Dependencies

```bash
npm install next-auth@beta bcryptjs
npm install --save-dev @types/bcryptjs
```

---

## New Files

### `auth.ts` — root of project

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id; // only on first sign-in
      return token;
    },
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
```

### `app/api/auth/[...nextauth]/route.ts`

```ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

### `types/next-auth.d.ts`

```ts
import "next-auth";
declare module "next-auth" {
  interface Session {
    user: { id: string; name?: string | null; email?: string | null; image?: string | null };
  }
}
```

### `middleware.ts` — root of project

```ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  const isPublic = pathname === "/login" || pathname === "/signup" || pathname.startsWith("/api/auth");
  if (isPublic) return NextResponse.next();
  if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### `app/signup/page.tsx` — create account

Server component with inline server action:
- Fields: name, email, password, confirm password
- Hash password with `bcrypt.hash(password, 12)` before storing
- `prisma.user.create(...)` — catch P2002 for duplicate email
- On success: redirect to `/login`
- Show error inline if email taken or passwords don't match

### `app/login/page.tsx` — sign in

Server component with inline server action:
- Fields: email, password
- Calls `signIn("credentials", { email, password, redirectTo: "/" })`
- On failure: show "Invalid email or password"

---

## Changes to Existing Files

### `app/intake-actions.ts`

Add at top of each action:
```ts
const session = await auth();
if (!session?.user?.id) throw new Error("Not authenticated");
const userId = session.user.id;
```

- `logMultipleIntakes`: add `userId` to each `createMany` data object
- `removeIntake`: fetch intake first, verify `intake.userId === userId`, then delete

### `app/log/actions.ts`

Add auth check + ownership verification:
```ts
const session = await auth();
const userId = session!.user.id;
const intake = await prisma.plantIntake.findUnique({ where: { id: intakeId } });
if (!intake || intake.userId !== userId) throw new Error("Forbidden");
```

### `app/page.tsx`

```ts
const session = await auth();
const userId = session!.user.id;
// add `where: { userId, date: ... }` to plantIntake query
```

### `app/log/page.tsx`

```ts
const session = await auth();
const userId = session!.user.id;
// add `where: { userId }` to plantIntake query
```

### `app/plants/page.tsx` — no changes needed

Plant queries are global. Middleware guarantees auth.

### `app/plant-actions.ts` — no changes needed

Plant mutations are shared. Middleware guarantees auth.

### `app/components/nav-bar.tsx` — split into server + client

**`nav-bar.tsx`** becomes a server component:
```ts
import { auth } from "@/auth";
import { NavBarClient } from "./nav-bar-client";
export async function NavBar() {
  const session = await auth();
  return <NavBarClient user={session?.user ?? null} />;
}
```

**`nav-bar-client.tsx`** — current NavBar content + user display:
- Show `user.name` or email initial in top right
- Sign out button: `signOut({ callbackUrl: "/login" })` from `next-auth/react`

### `app/layout.tsx`

- Import `NavBar` from `./components/nav-bar` (same import, new implementation)
- No other changes needed

---

## Environment Variables

`.env` (local):
```
AUTH_SECRET=<generate with: npx auth secret>
DATABASE_URL=<existing>
```

Vercel dashboard → Settings → Environment Variables:
- `AUTH_SECRET` — same value as local

---

## Implementation Order

1. `npm install next-auth@beta bcryptjs` + `npm install -D @types/bcryptjs`
2. Update `prisma/schema.prisma` (add User, add userId to PlantIntake)
3. `npx prisma migrate dev --name add_user_auth`
4. `npx prisma generate`
5. Create `auth.ts`
6. Create `app/api/auth/[...nextauth]/route.ts`
7. Create `types/next-auth.d.ts`
8. Create `middleware.ts`
9. Create `app/signup/page.tsx`
10. Create `app/login/page.tsx`
11. Update `app/intake-actions.ts`
12. Update `app/log/actions.ts`
13. Update `app/page.tsx`
14. Update `app/log/page.tsx`
15. Split `nav-bar.tsx` → `nav-bar.tsx` (server) + `nav-bar-client.tsx` (client)
16. Generate `AUTH_SECRET`: `npx auth secret`, add to `.env` and Vercel

---

## Existing Data Migration (one-time, after first sign-up)

After you create your account at `/signup` and log in for the first time:

1. Find your user ID — run this in the terminal:
   ```bash
   npx prisma studio
   ```
   Open the `User` table, copy your `id` (looks like `clxyz123abc...`)

2. Run this SQL to claim all existing intakes:
   ```bash
   npx prisma db execute --stdin <<< "UPDATE \"PlantIntake\" SET \"userId\" = '<paste-your-id-here>' WHERE \"userId\" IS NULL;"
   ```

3. Refresh the app — your full history is now visible under your account.

This runs once and is never needed again.

---

## Verification

1. `npm run dev` — app redirects to `/login` when not authenticated
2. Sign up at `/signup` — account created, redirected to `/login`
3. Log in — redirected to home, NavBar shows your name
4. Log some intakes — verify they appear only for your account
5. Open incognito, sign up as a different user — no intakes visible, but same plant catalog
6. Try accessing `/` without being logged in — redirected to `/login`
7. `npm run build` — must pass with no TypeScript errors

---

## Upgrade Path to Google OAuth (future)

In `auth.ts`, add one import and one provider:
```ts
import Google from "next-auth/providers/google";
// ...
providers: [
  Credentials({ ... }),  // keep existing
  Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
]
```
Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to env. Done.
