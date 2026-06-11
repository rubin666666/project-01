import { fail, ok } from '@/lib/api-response';
import {
  filterRecipes,
  getCurrentUser,
  paginate,
  readDatabase,
} from '@/lib/server-db';

export async function GET(request) {
  const database = await readDatabase();
  const user = getCurrentUser(database, request);
  if (!user) return fail('Authentication required', 401);

  const { searchParams } = new URL(request.url);
  const favoriteIds = new Set(
    database.favorites
      .filter(item => item.userId === user._id)
      .map(item => item.recipeId)
  );
  const recipes = filterRecipes(
    database.recipes.filter(recipe => favoriteIds.has(recipe._id)),
    {
      category: searchParams.get('category'),
      ingredient: searchParams.get('ingredient'),
    }
  );
  return ok(
    paginate(
      recipes,
      searchParams.get('page'),
      searchParams.get('perPage')
    )
  );
}
