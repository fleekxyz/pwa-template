import { LoginMenu } from '../components/LoginMenu'
import { NavBar } from '../components/NavBar'
import styles from './page.module.css'
import common from '../common.module.css'

export default function Home() {
  return (
    <>
      <NavBar />
      <main className={`${common.center} ${styles.main}`}>
        <h1>Fleek PWA Template</h1>
        <LoginMenu />
      </main>
    </>
  )
}
