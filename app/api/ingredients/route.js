import { ok } from '@/lib/api-response';
import { INGREDIENTS } from '@/lib/server-db';

export async function GET() {
  return ok(INGREDIENTS);
}
