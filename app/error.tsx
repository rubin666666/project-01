'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="statusPage">
      <h1>Something went wrong</h1>
      <p>{error?.message || 'Please try again.'}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
