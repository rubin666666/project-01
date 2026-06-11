import AuthForm from '@/components/auth-form';
import styles from '@/styles/auth-page.module.css';

export const metadata = { title: 'Log in' };

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <AuthForm mode="login" />
    </div>
  );
}
