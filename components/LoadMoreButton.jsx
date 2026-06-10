'use client';

import Loader from './Loader';
import buttonStyles from '@/src/components/Button/Button.module.css';

export default function LoadMoreButton({
  onClick,
  loading = false,
  className = '',
}) {
  return (
    <button
      type="button"
      className={`${buttonStyles.baseStyle} ${className}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Loader compact /> : 'Load more'}
    </button>
  );
}
