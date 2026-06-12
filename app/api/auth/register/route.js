import { fail, ok } from '@/lib/api-response';
import {
  createId,
  hashPassword,
  publicUser,
  readDatabase,
  writeDatabase,
} from '@/lib/server-db';

export async function POST(request) {
  const { name, email, password } = await request.json();
  const normalizedName = String(name || '').trim();
  const normalizedEmail = String(email || '')
    .trim()
    .toLowerCase();
  if (
    !normalizedName ||
    normalizedName.length < 2 ||
    normalizedName.length > 50
  ) {
    return fail('Name must contain 2 to 50 characters');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return fail('Enter a valid email address');
  }
  if (typeof password !== 'string' || password.length < 6) {
    return fail('Password must contain at least 6 characters');
  }

  const database = await readDatabase();
  if (database.users.some(user => user.email === normalizedEmail)) {
    return fail('An account with this email already exists', 409);
  }

  const user = {
    _id: createId('user'),
    name: normalizedName,
    email: normalizedEmail,
    password: await hashPassword(password),
  };
  database.users.push(user);
  const accessToken = createId('token');
  database.sessions.push({ token: accessToken, userId: user._id });
  await writeDatabase(database);
  return ok({ user: publicUser(user), accessToken }, 201);
}
