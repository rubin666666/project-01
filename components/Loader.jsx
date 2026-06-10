import styles from '@/src/components/Loader/Loader.module.css';

export default function Loader({ fullPage = false }) {
  return (
    <div
      className={`${styles.wrapper} ${fullPage ? styles.fullPage : ''}`}
      role="status"
      aria-label="Loading"
    >
      <span className={styles.spinner} />
    </div>
  );
}
