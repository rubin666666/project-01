import styles from '@/src/components/Loader/loader.module.css';

export default function Loader({ fullPage = false, compact = false }) {
  return (
    <div
      className={`${styles.loader} ${fullPage ? styles.fullPage : ''} ${
        compact ? styles.compact : ''
      }`}
      role="status"
      aria-label="Loading"
    >
      <span className={styles.spinner} />
    </div>
  );
}
