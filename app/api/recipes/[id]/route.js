import { fail, ok } from '@/lib/api-response';
import {
  enrichRecipe,
  getCurrentUser,
  readDatabase,
  writeDatabase,
} from '@/lib/server-db';

export async function GET(_request, { params }) {
  const { id } = await params;
  const database = await readDatabase();
  const recipe = database.recipes.find(item => item._id === id);
  return recipe ? ok(enrichRecipe(recipe)) : fail('Recipe not found', 404);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const database = await readDatabase();
  const user = getCurrentUser(database, request);
  if (!user) return fail('Authentication required', 401);

  const recipe = database.recipes.find(item => item._id === id);
  if (!recipe) return fail('Recipe not found', 404);
  if (recipe.ownerId !== user._id) return fail('You cannot delete this recipe', 403);

  database.recipes = database.recipes.filter(item => item._id !== id);
  database.favorites = database.favorites.filter(item => item.recipeId !== id);
  await writeDatabase(database);
  return ok({ message: 'Recipe deleted' });
}
