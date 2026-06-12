# Tasteorama

Tasteorama is an adaptive recipe application where users can browse and filter
recipes, view cooking details, save favorites, publish recipes, and manage
their personal recipe collection.

## Technology

- Next.js 15 App Router
- React 19
- Next.js Route Handlers
- TanStack Query
- Zustand
- Formik and Yup
- Axios
- CSS Modules
- `next/image` and `next/font`
- modern-normalize

## Routes

- `/` - recipe search, filters, cards, and pagination
- `/recipes/[id]` - recipe details
- `/auth/login` and `/auth/register` - authentication
- `/add-recipe` - protected recipe creation page
- `/profile/own` - protected personal recipes
- `/profile/favorites` - protected saved recipes

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.template` to `.env.local` and initialize the listed values:

   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Start development mode:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

The local API is included in the Next.js application. Runtime data is stored in
the ignored `.data/db.json` file and initialized from `data/seed.json`, so no
separate backend process or database is required for local development.
Passwords are stored as salted `scrypt` hashes.

## Production

```bash
npm run lint
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` to the public frontend URL before deployment. The
frontend and internal API can be deployed together on a Next.js-compatible
platform. The bundled file adapter is intended for local development. A managed
database and persistent object storage are required for production accounts,
recipes, and uploaded images.

## Quality

- Mobile-first responsive layout: fluid from 320px, mobile layout from 393px,
  tablet from 768px, and desktop from 1440px
- CSS Modules, modern-normalize, and UI Kit hover states
- Server Components by default and Client Components only for interactive UI
- Public and protected routes
- Formik and Yup forms with validation and request error notifications
- Page and request loading indicators powered by TanStack Query state
- Global error and not-found boundaries
- Internal `/api` backend layer
- Per-page `generateMetadata`, Open Graph data, and favicon
- Optimized images through `next/image`
