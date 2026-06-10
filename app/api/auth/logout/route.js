import { ok } from '@/lib/api-response';
import {
  getBearerToken,
  readDatabase,
  writeDatabase,
} from '@/lib/server-db';

export async function POST(request) {
  const token = getBearerToken(request);
  const database = await readDatabase();
  database.sessions = database.sessions.filter(item => item.token !== token);
  await writeDatabase(database);
  return ok({ message: 'Logged out' });
}
