import AuthForm from '@/components/AuthForm';
import styles from '@/styles/AuthPage.module.css';

export const metadata = { title: 'Register' };

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <AuthForm mode="register" />
    </div>
  );
}
