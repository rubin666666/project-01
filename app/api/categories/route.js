import { ok } from '@/lib/api-response';
import { categories } from '@/lib/server-db';

export async function GET() {
  return ok(categories.map((name, index) => ({ _id: `category-${index}`, name })));
}
