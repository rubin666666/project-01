import 'server-only';

import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const databaseDirectory = path.join(process.cwd(), '.data');
const databasePath = path.join(databaseDirectory, 'db.json');
const seedPath = path.join(process.cwd(), 'data', 'seed.json');

export const categories = [
  'Appetizer',
  'Breakfast',
  'Dessert',
  'Drink',
  'Meat',
  'Pasta',
  'Salad',
  'Seafood',
  'Soup',
  'Vegetarian',
];

export const ingredients = [
  ['ingredient-avocado', 'Avocado'],
  ['ingredient-banana', 'Banana'],
  ['ingredient-beef', 'Beef'],
  ['ingredient-berries', 'Berries'],
  ['ingredient-bread', 'Bread'],
  ['ingredient-carrot', 'Carrot'],
  ['ingredient-chicken', 'Chicken'],
  ['ingredient-cocoa', 'Cocoa'],
  ['ingredient-cream', 'Cream'],
  ['ingredient-cucumber', 'Cucumber'],
  ['ingredient-egg', 'Egg'],
  ['ingredient-feta', 'Feta'],
  ['ingredient-flour', 'Flour'],
  ['ingredient-garlic', 'Garlic'],
  ['ingredient-lemon', 'Lemon'],
  ['ingredient-mushroom', 'Mushroom'],
  ['ingredient-oats', 'Oats'],
  ['ingredient-onion', 'Onion'],
  ['ingredient-pasta', 'Pasta'],
  ['ingredient-potato', 'Potato'],
  ['ingredient-rice', 'Rice'],
  ['ingredient-salmon', 'Salmon'],
  ['ingredient-spinach', 'Spinach'],
  ['ingredient-tomato', 'Tomato'],
].map(([id, name]) => ({ _id: id, name }));

export async function readDatabase() {
  try {
    return JSON.parse(await readFile(databasePath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const seed = JSON.parse(await readFile(seedPath, 'utf8'));
    await writeDatabase(seed);
    return seed;
  }
}

export async function writeDatabase(database) {
  await mkdir(databaseDirectory, { recursive: true });
  await writeFile(databasePath, `${JSON.stringify(database, null, 2)}\n`);
}

export function paginate(items, page = 1, perPage = 12) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safePerPage = Math.min(Math.max(Number(perPage) || 12, 1), 100);
  const start = (safePage - 1) * safePerPage;
  const data = items.slice(start, start + safePerPage);

  return {
    data,
    page: safePage,
    perPage: safePerPage,
    totalItems: items.length,
    totalPages: Math.ceil(items.length / safePerPage),
    hasNextPage: start + safePerPage < items.length,
  };
}

export function getBearerToken(request) {
  const authorization = request.headers.get('authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
}

export function getCurrentUser(database, request) {
  const token = getBearerToken(request);
  const session = database.sessions.find(item => item.token === token);
  return session
    ? database.users.find(user => user._id === session.userId)
    : null;
}

export function publicUser(user) {
  return { _id: user._id, name: user.name, email: user.email };
}

export function createId(prefix) {
  return `${prefix}-${randomUUID()}`;
}

export function enrichRecipe(recipe) {
  return {
    ...recipe,
    category:
      typeof recipe.category === 'string'
        ? { name: recipe.category }
        : recipe.category,
    ingredients: (recipe.ingredients || []).map(item => ({
      ...item,
      id:
        ingredients.find(ingredient => ingredient._id === item.id) || item.id,
    })),
  };
}
