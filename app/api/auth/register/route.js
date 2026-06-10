import { fail, ok } from '@/lib/api-response';
import {
  createId,
  publicUser,
  readDatabase,
  writeDatabase,
} from '@/lib/server-db';

export async function POST(request) {
  const { name, email, password } = await request.json();
  if (!name?.trim() || !email?.trim() || !password) {
    return fail('Name, email and password are required');
  }

  const database = await readDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  if (database.users.some(user => user.email === normalizedEmail)) {
    return fail('An account with this email already exists', 409);
  }

  const user = {
    _id: createId('user'),
    name: name.trim(),
    email: normalizedEmail,
    password,
  };
  database.users.push(user);
  await writeDatabase(database);
  return ok(publicUser(user), 201);
}
