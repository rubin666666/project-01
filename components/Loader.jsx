import styles from '@/src/components/Loader/Loader.module.css';

export default function Loader({ fullPage = false }) {
  return (
    <div
      className={styles.loaderWrapper}
      style={fullPage ? { minHeight: '60vh' } : undefined}
      role="status"
      aria-label="Loading"
    >
      <span className={styles.loader} />
    </div>
  );
}
