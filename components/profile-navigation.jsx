import Link from 'next/link';
import styles from '@/src/components/Profile/ProfileNavigation/profilenavigation.module.css';

export default function ProfileNavigation({ type, queryString = '' }) {
  const suffix = queryString ? `?${queryString}` : '';

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>My profile</h1>
      <nav className={styles.tabs} aria-label="Profile sections">
        <Link
          href={`/profile/own${suffix}`}
          className={`${styles.tab} ${type === 'own' ? styles.active : ''}`}
          aria-current={type === 'own' ? 'page' : undefined}
        >
          My recipes
        </Link>
        <Link
          href={`/profile/favorites${suffix}`}
          className={`${styles.tab} ${
            type === 'favorites' ? styles.active : ''
          }`}
          aria-current={type === 'favorites' ? 'page' : undefined}
        >
          Saved recipes
        </Link>
      </nav>
    </div>
  );
}
