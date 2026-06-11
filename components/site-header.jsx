'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsXCircle } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { RxDividerVertical, RxHamburgerMenu } from 'react-icons/rx';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import LogoIcon from '@/src/assets/castom-icons/logo-icon.svg';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import Modal from './modal';
import styles from '@/src/components/Header/header.module.css';
import userStyles from '@/src/components/UserMenu/usermenu.module.css';

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isLoggedIn, clearSession } = useAuthStore();

  const linkClass = href =>
    clsx(styles.link, pathname === href && styles.active);

  useEffect(() => {
    const syncViewport = () => setIsMobile(window.innerWidth < 768);
    const syncScroll = () => setIsScrolled(window.scrollY > 0);
    syncViewport();
    syncScroll();
    window.addEventListener('resize', syncViewport);
    window.addEventListener('scroll', syncScroll);
    return () => {
      window.removeEventListener('resize', syncViewport);
      window.removeEventListener('scroll', syncScroll);
    };
  }, []);

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
      <header
        className={clsx(styles.headerNav, isScrolled && styles.scrolled)}
      >
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
              className={clsx(
                styles.nav,
                menuOpen && styles.navMobileOpen,
                menuOpen && isScrolled && styles.scrolled
              )}
              onClick={() => setMenuOpen(false)}
            >
              <Link href="/" className={linkClass('/')}>
                Recipes
              </Link>
              {isLoggedIn ? (
                <div
                  className={clsx(
                    userStyles.userMenu,
                    isMobile && userStyles.mobileMenu
                  )}
                >
                  <div className={userStyles.navLinks}>
                    <Link
                      href="/profile/own"
                      className={clsx(
                        userStyles.link,
                        pathname.startsWith('/profile') && userStyles.active
                      )}
                    >
                      My Profile
                    </Link>
                    {!isMobile && (
                      <Link
                        href="/add-recipe"
                        className={clsx(userStyles.link, userStyles.addBtn)}
                      >
                        Add Recipe
                      </Link>
                    )}
                  </div>
                  <div className={userStyles.userBlock}>
                    <span className={userStyles.userAvatar}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    <span className={userStyles.userName}>{user?.name}</span>
                    <RxDividerVertical className={userStyles.divider} />
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
                  {isMobile && (
                    <Link
                      href="/add-recipe"
                      className={clsx(
                        userStyles.link,
                        userStyles.addBtn,
                        userStyles.addBtnMobile
                      )}
                    >
                      Add Recipe
                    </Link>
                  )}
                </div>
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
