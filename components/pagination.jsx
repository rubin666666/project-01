'use client';

import { Fragment } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from '@/src/components/Pagination/pagination.module.css';

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

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
        <FiChevronLeft aria-hidden="true" />
      </button>
      {visible.map((page, index) => (
        <Fragment key={page}>
          {index > 0 && page - visible[index - 1] > 1 && (
            <span className={styles.dots}>...</span>
          )}
          <span className={styles.pageItem}>
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={`${styles.pageBtn} ${
                page === currentPage ? styles.active : ''
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          </span>
        </Fragment>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.arrow}
        aria-label="Next page"
      >
        <FiChevronRight aria-hidden="true" />
      </button>
    </nav>
  );
}
