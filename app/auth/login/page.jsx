import AuthForm from '@/components/AuthForm';
import styles from '@/styles/AuthPage.module.css';

export const metadata = { title: 'Log in' };

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <AuthForm mode="login" />
    </div>
  );
}
