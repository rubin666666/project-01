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

export async function getProfileRecipes(type, page = 1) {
  const endpoint = type === 'own' ? 'own' : 'favorite';
  const response = await api.get(`/api/recipes/${endpoint}`, {
    params: { page, perPage: 12 },
  });
  return response.data.data;
}
