import RecipeDetailsClient from '@/components/RecipeDetailsClient';
import styles from '@/styles/RecipeViewPage.module.css';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Recipe ${id}`,
    description: 'Tasteorama recipe details.',
  };
}

export default async function RecipePage({ params }) {
  const { id } = await params;
  return (
    <div className={styles.container}>
      <RecipeDetailsClient id={id} />
    </div>
  );
}
