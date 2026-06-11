import { fail, ok } from '@/lib/api-response';
import {
  createId,
  publicUser,
  readDatabase,
  writeDatabase,
} from '@/lib/server-db';

export async function POST(request) {
  const { email, password } = await request.json();
  const normalizedEmail = String(email || '')
    .trim()
    .toLowerCase();
  if (!normalizedEmail || typeof password !== 'string' || !password) {
    return fail('Email and password are required');
  }

  const database = await readDatabase();
  const user = database.users.find(
    item => item.email === normalizedEmail && item.password === password
  );

  if (!user) return fail('Incorrect email or password', 401);

  database.sessions = database.sessions.filter(item => item.userId !== user._id);
  const accessToken = createId('token');
  database.sessions.push({ token: accessToken, userId: user._id });
  await writeDatabase(database);

  return ok({ user: publicUser(user), accessToken });
}
