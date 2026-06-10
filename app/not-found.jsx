import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/NotFoundPage.module.css';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className={styles.container}>
      <Image src="/pg10.png" width={280} height={190} alt="" priority />
      <h1 className={styles.subtitle}>404 Page Not Found</h1>
      <p className={styles.description}>
        The page you are looking for does not exist.
      </p>
      <Link href="/" className={styles.button}>
        Back to Home
      </Link>
    </section>
  );
}
