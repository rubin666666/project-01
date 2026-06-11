import RecipeDetailsClient from '@/components/recipe-details-client';
import { notFound } from 'next/navigation';
import { readDatabase } from '@/lib/server-db';
import styles from '@/styles/recipe-view-page.module.css';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const database = await readDatabase();
    const recipe = database.recipes.find(item => item._id === id);
    if (!recipe) throw new Error('Recipe not found');
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
  const database = await readDatabase();
  if (!database.recipes.some(recipe => recipe._id === id)) notFound();

  return (
    <div className={styles.container}>
      <RecipeDetailsClient id={id} />
    </div>
  );
}
