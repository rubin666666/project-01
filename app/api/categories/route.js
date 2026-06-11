import { ok } from '@/lib/api-response';
import { CATEGORIES } from '@/lib/server-db';

export async function GET() {
  return ok(
    CATEGORIES.map((name, index) => ({ _id: `category-${index}`, name }))
  );
}
