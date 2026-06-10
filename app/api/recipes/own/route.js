import { fail, ok } from '@/lib/api-response';
import { getCurrentUser, paginate, readDatabase } from '@/lib/server-db';

export async function GET(request) {
  const database = await readDatabase();
  const user = getCurrentUser(database, request);
  if (!user) return fail('Authentication required', 401);

  const { searchParams } = new URL(request.url);
  const recipes = database.recipes.filter(recipe => recipe.ownerId === user._id);
  return ok(
    paginate(
      recipes,
      searchParams.get('page'),
      searchParams.get('perPage')
    )
  );
}
