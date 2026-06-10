import { api } from './api';

export async function getRecipes(params = {}) {
  const response = await api.get('/api/recipes', {
    params: {
      title: params.search || undefined,
      category: params.category || undefined,
      ingredient: params.ingredient || undefined,
      page: params.page || 1,
      perPage: params.perPage || 12,
    },
  });
  return response.data.data;
}

export async function getRecipe(id) {
  const response = await api.get(`/api/recipes/${id}`);
  return response.data.data;
}

export async function getCategories() {
  const response = await api.get('/api/categories');
  return response.data.data;
}

export async function getIngredients() {
  const response = await api.get('/api/ingredients');
  return response.data.data;
}

export async function getProfileRecipes(type, page = 1, perPage = 12) {
  const endpoint = type === 'own' ? 'own' : 'favorite';
  const response = await api.get(`/api/recipes/${endpoint}`, {
    params: { page, perPage },
  });
  return response.data.data;
}

export async function getAllFavoriteRecipes() {
  const perPage = 12;
  const firstPage = await getProfileRecipes('favorites', 1, perPage);
  const recipes = [...(firstPage.data || [])];
  const totalItems = firstPage.totalItems || recipes.length;

  for (let page = 2; recipes.length < totalItems; page += 1) {
    const nextPage = await getProfileRecipes('favorites', page, perPage);
    const nextRecipes = nextPage.data || [];
    if (nextRecipes.length === 0) break;
    recipes.push(...nextRecipes);
  }

  return recipes;
}
