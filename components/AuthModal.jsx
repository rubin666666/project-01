'use client';

import Link from 'next/link';
import Modal from './Modal';

export default function AuthModal({ open, onOpenChange }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Authorization required"
      message="Log in or register to use this feature."
      actions={[
        { element: <Link href="/auth/login">Log in</Link> },
        { element: <Link href="/auth/register">Register</Link> },
      ]}
    />
  );
}
