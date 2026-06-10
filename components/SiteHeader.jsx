'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsXCircle } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { RxHamburgerMenu } from 'react-icons/rx';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import LogoIcon from '@/src/assets/castom-icons/LogoIcon.svg';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import Modal from './Modal';
import styles from '@/src/components/Header/Header.module.css';
import userStyles from '@/src/components/UserMenu/UserMenu.module.css';

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { user, isLoggedIn, clearSession } = useAuthStore();

  const linkClass = href =>
    clsx(styles.link, pathname === href && styles.active);

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // The specification requires local logout for every backend response.
    } finally {
      clearSession();
      setLogoutOpen(false);
      router.replace('/');
      router.refresh();
      toast.success('You are logged out');
    }
  };

  return (
    <>
      <header className={styles.headerNav}>
        <div className="container">
          <div className={styles.inner}>
            <Link href="/" className={styles.logoLink}>
              <LogoIcon className={styles.logo} />
              <span className={styles.logoText}>Tasteorama</span>
            </Link>
            <button
              type="button"
              className={styles.burgerButton}
              onClick={() => setMenuOpen(value => !value)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <BsXCircle /> : <RxHamburgerMenu />}
            </button>
            <nav
              className={clsx(styles.nav, menuOpen && styles.navMobileOpen)}
              onClick={() => setMenuOpen(false)}
            >
              <Link href="/" className={linkClass('/')}>
                Recipes
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile/own"
                    className={linkClass('/profile/own')}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/add-recipe"
                    className={clsx(styles.linkBtn, styles.activeBtn)}
                  >
                    Add Recipe
                  </Link>
                  <div className={userStyles.userBlock}>
                    <span className={userStyles.userAvatar}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    <span className={userStyles.userName}>{user?.name}</span>
                    <button
                      type="button"
                      className={userStyles.userLogoutBtn}
                      onClick={event => {
                        event.stopPropagation();
                        setLogoutOpen(true);
                      }}
                      aria-label="Log out"
                    >
                      <FiLogOut />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className={linkClass('/auth/login')}>
                    Log in
                  </Link>
                  <Link href="/auth/register" className={styles.linkBtn}>
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <Modal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Are you sure?"
        message="We will miss you!"
        actions={[
          { text: 'Log out', onClick: logout },
          {
            text: 'Cancel',
            type: 'secondary',
            onClick: () => setLogoutOpen(false),
          },
        ]}
      />
    </>
  );
}
