import { Wallet } from './Wallet'
import styles from './NavBar.module.css'

export const NavBar = () => (
  <nav className={styles.nav}>
    <Wallet />
  </nav>
)
