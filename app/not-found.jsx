import Link from 'next/link';
import styles from '@/styles/NotFoundPage.module.css';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.subtitle}>Page Not Found</p>
      <p className={styles.description}>
        The page you are looking for does not exist.
      </p>
      <Link href="/" className={styles.button}>
        Back to Home
      </Link>
    </section>
  );
}
