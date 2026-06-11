import 'modern-normalize';
import '../src/index.css';
import { Montserrat } from 'next/font/google';
import Providers from '@/components/providers';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import styles from '@/src/components/Layout/layout.module.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'Tasteorama',
    template: '%s | Tasteorama',
  },
  description:
    'Discover, save, and share recipes with the Tasteorama community.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Tasteorama',
    description: 'Discover, save, and share recipes.',
    type: 'website',
    images: ['/pg10.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <Providers>
          <div className={styles.wrapper}>
            <SiteHeader />
            <main className={styles.main}>{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
