import AuthForm from '@/components/auth-form';
import styles from '@/styles/auth-page.module.css';

export const metadata = { title: 'Register' };

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <AuthForm mode="register" />
    </div>
  );
}
