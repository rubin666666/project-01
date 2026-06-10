import { fail, ok } from '@/lib/api-response';
import {
  getCurrentUser,
  readDatabase,
  writeDatabase,
} from '@/lib/server-db';

export async function POST(request, { params }) {
  const { id } = await params;
  const database = await readDatabase();
  const user = getCurrentUser(database, request);
  if (!user) return fail('Authentication required', 401);
  if (!database.recipes.some(recipe => recipe._id === id)) {
    return fail('Recipe not found', 404);
  }

  const exists = database.favorites.some(
    item => item.userId === user._id && item.recipeId === id
  );
  if (!exists) database.favorites.push({ userId: user._id, recipeId: id });
  await writeDatabase(database);
  return ok({ recipeId: id });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const database = await readDatabase();
  const user = getCurrentUser(database, request);
  if (!user) return fail('Authentication required', 401);

  database.favorites = database.favorites.filter(
    item => !(item.userId === user._id && item.recipeId === id)
  );
  await writeDatabase(database);
  return ok({ recipeId: id });
}
