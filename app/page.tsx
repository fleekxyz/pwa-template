import Link from 'next/link'
import { LoginMenu } from '../components/LoginMenu'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Fleek PWA Template</h1>

      <LoginMenu />
    </main>
  )
}
