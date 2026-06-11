import AddRecipeClient from '@/components/add-recipe-client';
import { createPageMetadata } from '@/lib/metadata';
import styles from '@/styles/add-recipe-page.module.css';

export function generateMetadata() {
  return createPageMetadata({
    title: 'Add recipe',
    description: 'Publish a new recipe on Tasteorama.',
    path: '/add-recipe',
  });
}

export default function AddRecipePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Recipe</h1>
      <AddRecipeClient />
    </div>
  );
}
