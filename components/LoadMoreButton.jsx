'use client';

import Loader from './Loader';
import styles from '@/styles/LoadMoreButton.module.css';

export default function LoadMoreButton({ onClick, loading = false }) {
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={onClick}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader />
            <span>Loading recipes...</span>
          </>
        ) : (
          'Load more'
        )}
      </button>
    </div>
  );
}
