# Tasteorama

Tasteorama is an adaptive recipe application where users can browse and filter
recipes, view cooking details, save favorites, publish recipes, and manage
their personal recipe collection.

## Technology

- Next.js 15 App Router
- React 19
- TanStack Query
- Zustand
- Formik and Yup
- Axios
- CSS Modules

## Routes

- `/` - recipe search, filters, cards, and incremental loading
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

2. Create `.env.local`:

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

## Production

```bash
npm run lint
npm run build
npm start
```
