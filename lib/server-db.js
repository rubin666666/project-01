import 'server-only';

import {
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const DATABASE_DIRECTORY = path.join(process.cwd(), '.data');
const DATABASE_PATH = path.join(DATABASE_DIRECTORY, 'db.json');
const SEED_PATH = path.join(process.cwd(), 'data', 'seed.json');
const scrypt = promisify(scryptCallback);

export const CATEGORIES = [
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

export const INGREDIENTS = [
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
    return JSON.parse(await readFile(DATABASE_PATH, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const seed = JSON.parse(await readFile(SEED_PATH, 'utf8'));
    await writeDatabase(seed);
    return seed;
  }
}

export async function writeDatabase(database) {
  await mkdir(DATABASE_DIRECTORY, { recursive: true });
  await writeFile(DATABASE_PATH, `${JSON.stringify(database, null, 2)}\n`);
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

export function filterRecipes(recipes, { title, category, ingredient } = {}) {
  const normalizedTitle = title?.trim().toLowerCase();
  const categoryIndex = Number(category?.replace('category-', ''));
  const categoryName =
    category?.startsWith('category-') && CATEGORIES[categoryIndex]
      ? CATEGORIES[categoryIndex]
      : category;

  return recipes.filter(recipe => {
    const recipeCategory =
      typeof recipe.category === 'string'
        ? recipe.category
        : recipe.category?.name;
    const matchesTitle =
      !normalizedTitle ||
      recipe.title.toLowerCase().includes(normalizedTitle);
    const matchesCategory =
      !categoryName || recipeCategory === categoryName;
    const matchesIngredient =
      !ingredient ||
      recipe.ingredients?.some(item => {
        const ingredientData = INGREDIENTS.find(entry => entry._id === item.id);
        return item.id === ingredient || ingredientData?.name === ingredient;
      });

    return matchesTitle && matchesCategory && matchesIngredient;
  });
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

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${Buffer.from(derivedKey).toString('hex')}`;
}

export async function verifyPassword(password, storedPassword) {
  if (!storedPassword?.startsWith('scrypt:')) {
    return password === storedPassword;
  }

  const [, salt, storedKey] = storedPassword.split(':');
  if (!salt || !storedKey) return false;

  const derivedKey = Buffer.from(await scrypt(password, salt, 64));
  const expectedKey = Buffer.from(storedKey, 'hex');
  return (
    derivedKey.length === expectedKey.length &&
    timingSafeEqual(derivedKey, expectedKey)
  );
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
        INGREDIENTS.find(ingredient => ingredient._id === item.id) || item.id,
    })),
  };
}
