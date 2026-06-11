import AddRecipeClient from '@/components/add-recipe-client';
import styles from '@/styles/add-recipe-page.module.css';

export const metadata = {
  title: 'Add recipe',
  description: 'Publish a new recipe on Tasteorama.',
};

export default function AddRecipePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Recipe</h1>
      <AddRecipeClient />
    </div>
  );
}
