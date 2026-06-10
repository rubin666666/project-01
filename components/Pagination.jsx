'use client';

import styles from '@/src/components/Pagination/Pagination.module.css';

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const visible = pages.filter(
    page =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 2
  );

  return (
    <nav className={styles.pagination} aria-label="Recipe pages">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.arrow}
        aria-label="Previous page"
      >
        ←
      </button>
      {visible.map((page, index) => (
        <span key={page} className={styles.pageItem}>
          {index > 0 && page - visible[index - 1] > 1 && (
            <span className={styles.dots}>…</span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(page)}
            className={
              `${styles.pageBtn} ${page === currentPage ? styles.active : ''}`
            }
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.arrow}
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
}
