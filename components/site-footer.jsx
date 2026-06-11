'use client';

import Link from 'next/link';
import { useState } from 'react';
import LogoIcon from '@/src/assets/castom-icons/logo-icon.svg';
import { useAuthStore } from '@/store/auth';
import AuthModal from './auth-modal';
import styles from '@/src/components/Footer/footer.module.css';

export default function SiteFooter() {
  const [authOpen, setAuthOpen] = useState(false);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  return (
    <>
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerWrapper}>
            <Link href="/" className={styles.logoLink}>
              <LogoIcon className={styles.logo} />
              <span className={styles.logoText}>Tasteorama</span>
            </Link>
            <p className={styles.footerTextSettings}>
              &copy; 2025 CookingCompanion. All rights reserved.
            </p>
            <div className={styles.footerRoutesLink}>
              <Link href="/" className={styles.footerLink}>
                Recipes
              </Link>
              {isLoggedIn ? (
                <Link href="/profile/own" className={styles.footerLink}>
                  Account
                </Link>
              ) : (
                <button
                  type="button"
                  className={styles.footerLink}
                  onClick={() => setAuthOpen(true)}
                >
                  Account
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
