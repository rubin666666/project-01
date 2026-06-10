import 'modern-normalize';
import '../src/index.css';
import Providers from '@/components/Providers';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import styles from '@/src/components/Layout/Layout.module.css';

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
      <body>
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
