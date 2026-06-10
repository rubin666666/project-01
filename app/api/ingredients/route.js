import { ok } from '@/lib/api-response';
import { ingredients } from '@/lib/server-db';

export async function GET() {
  return ok(ingredients);
}
