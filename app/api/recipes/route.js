import { fail, ok } from '@/lib/api-response';
import {
  CATEGORIES,
  createId,
  filterRecipes,
  getCurrentUser,
  INGREDIENTS,
  paginate,
  readDatabase,
  writeDatabase,
} from '@/lib/server-db';
import {
  ALLOWED_IMAGE_TYPES,
  deleteUploadedImage,
  MAX_IMAGE_SIZE,
  saveUploadedImage,
} from '@/lib/uploads';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const database = await readDatabase();
  const recipes = filterRecipes(database.recipes, {
    title: searchParams.get('title'),
    category: searchParams.get('category'),
    ingredient: searchParams.get('ingredient'),
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
  const photo = formData.get('photo');
  let recipeIngredients;
  try {
    recipeIngredients = JSON.parse(formData.get('ingredients') || '[]');
  } catch {
    return fail('Invalid ingredients');
  }

  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const time = Number(formData.get('time'));
  const caloriesValue = formData.get('calories');
  const calories = caloriesValue ? Number(caloriesValue) : null;
  const category = String(formData.get('category') || '').trim();
  const instructions = String(formData.get('instructions') || '').trim();
  const hasPhoto =
    photo && typeof photo.arrayBuffer === 'function' && photo.size > 0;

  if (title.length < 3 || title.length > 64) {
    return fail('Recipe title must contain 3 to 64 characters');
  }
  if (description.length < 10 || description.length > 200) {
    return fail('Description must contain 10 to 200 characters');
  }
  if (!Number.isFinite(time) || time < 1 || time > 360) {
    return fail('Cooking time must be between 1 and 360 minutes');
  }
  if (
    calories !== null &&
    (!Number.isFinite(calories) || calories < 1 || calories > 10000)
  ) {
    return fail('Calories must be between 1 and 10000');
  }
  if (!CATEGORIES.includes(category)) return fail('Invalid category');
  if (instructions.length < 3 || instructions.length > 1200) {
    return fail('Instructions must contain 3 to 1200 characters');
  }
  if (
    !Array.isArray(recipeIngredients) ||
    recipeIngredients.length === 0 ||
    recipeIngredients.some(
      item =>
        !INGREDIENTS.some(ingredient => ingredient._id === item.id) ||
        !String(item.measure || '').trim()
    )
  ) {
    return fail('Add at least one valid ingredient and amount');
  }
  if (
    new Set(recipeIngredients.map(item => item.id)).size !==
    recipeIngredients.length
  ) {
    return fail('Ingredients must be unique');
  }
  if (
    hasPhoto &&
    (!ALLOWED_IMAGE_TYPES.includes(photo.type) || photo.size > MAX_IMAGE_SIZE)
  ) {
    return fail('Photo must be a JPG, PNG or WEBP image under 2MB');
  }

  const thumb = hasPhoto ? await saveUploadedImage(photo) : '/pg10.png';

  const recipe = {
    _id: createId('recipe'),
    title,
    description,
    time,
    calories,
    category,
    instructions,
    ingredients: recipeIngredients,
    thumb,
    ownerId: user._id,
  };

  database.recipes.unshift(recipe);
  try {
    await writeDatabase(database);
  } catch (error) {
    await deleteUploadedImage(thumb);
    throw error;
  }
  return ok(recipe, 201);
}
