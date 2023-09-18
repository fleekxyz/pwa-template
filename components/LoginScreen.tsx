import styles from './LoginScreen.module.css'

export const LoginScreen = ({ login }: { login: () => void }) => {
  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Fleek PWA Template</h1>
      <button className={styles.login} onClick={login}>
        Sign In
      </button>
    </main>
  )
}
