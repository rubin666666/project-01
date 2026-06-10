import RecipeDetailsClient from '@/components/RecipeDetailsClient';
import { getRecipe } from '@/lib/queries';
import styles from '@/styles/RecipeViewPage.module.css';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const recipe = await getRecipe(id);
    const description =
      recipe.description || `Learn how to prepare ${recipe.title}.`;
    const image = recipe.thumb || recipe.photo || '/pg10.png';

    return {
      title: recipe.title,
      description,
      openGraph: {
        title: recipe.title,
        description,
        type: 'article',
        images: [image],
      },
    };
  } catch {
    return {
      title: 'Recipe not found',
      description: 'The requested Tasteorama recipe is unavailable.',
    };
  }
}

export default async function RecipePage({ params }) {
  const { id } = await params;
  return (
    <div className={styles.container}>
      <RecipeDetailsClient id={id} />
    </div>
  );
}
