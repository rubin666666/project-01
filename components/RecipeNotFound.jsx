import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/NotFoundPage.module.css';

export default function RecipeNotFound() {
  return (
    <section className={styles.container}>
      <Image src="/pg10.png" width={280} height={190} alt="" priority />
      <h1 className={styles.subtitle}>Recipe not found</h1>
      <p className={styles.description}>
        The requested recipe is unavailable or has been removed.
      </p>
      <Link href="/" className={styles.button}>
        Back to Home
      </Link>
    </section>
  );
}
