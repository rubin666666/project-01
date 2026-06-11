import Link from 'next/link';
import styles from '@/styles/not-found-page.module.css';

export default function RecipeNotFound() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.subtitle}>Recipe not found</p>
      <p className={styles.description}>
        The requested recipe is unavailable or has been removed.
      </p>
      <Link href="/" className={styles.button}>
        Back to Home
      </Link>
    </section>
  );
}
