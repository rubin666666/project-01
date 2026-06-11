import RecipeCard from './recipe-card';
import styles from '@/src/components/RecipesList/recipeslist.module.css';

export default function RecipesList({ recipes }) {
  return (
    <ul className={styles.list}>
      {recipes.map(recipe => (
        <li key={recipe._id} className={styles.item}>
          <RecipeCard recipe={recipe} />
        </li>
      ))}
    </ul>
  );
}
