import { fail, ok } from '@/lib/api-response';
import {
  createId,
  getCurrentUser,
  INGREDIENTS,
  paginate,
  readDatabase,
  writeDatabase,
} from '@/lib/server-db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title')?.trim().toLowerCase();
  const category = searchParams.get('category');
  const ingredient = searchParams.get('ingredient');
  const database = await readDatabase();

  const recipes = database.recipes.filter(recipe => {
    const matchesTitle = !title || recipe.title.toLowerCase().includes(title);
    const recipeCategory =
      typeof recipe.category === 'string'
        ? recipe.category
        : recipe.category?.name;
    const matchesCategory = !category || recipeCategory === category;
    const matchesIngredient =
      !ingredient ||
      recipe.ingredients?.some(item => {
        const ingredientData = INGREDIENTS.find(entry => entry._id === item.id);
        return item.id === ingredient || ingredientData?.name === ingredient;
      });
    return matchesTitle && matchesCategory && matchesIngredient;
  });

  return ok(
    paginate(
      recipes,
      searchParams.get('page'),
      searchParams.get('perPage')
    )
  );
}

export async function POST(request) {
  const database = await readDatabase();
  const user = getCurrentUser(database, request);
  if (!user) return fail('Authentication required', 401);

  const formData = await request.formData();
  let recipeIngredients;
  try {
    recipeIngredients = JSON.parse(formData.get('ingredients') || '[]');
  } catch {
    return fail('Invalid ingredients');
  }

  const recipe = {
    _id: createId('recipe'),
    title: String(formData.get('title') || '').trim(),
    description: String(formData.get('description') || '').trim(),
    time: Number(formData.get('time')),
    calories: Number(formData.get('calories')) || null,
    category: String(formData.get('category') || '').trim(),
    instructions: String(formData.get('instructions') || '').trim(),
    ingredients: recipeIngredients,
    thumb: '/pg10.png',
    ownerId: user._id,
  };

  if (
    !recipe.title ||
    !recipe.description ||
    !recipe.time ||
    !recipe.category ||
    !recipe.instructions ||
    recipe.ingredients.length === 0
  ) {
    return fail('Please complete all required recipe fields');
  }

  database.recipes.unshift(recipe);
  await writeDatabase(database);
  return ok(recipe, 201);
}
