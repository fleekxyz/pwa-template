import { Wallet } from './Wallet'
import styles from './NavBar.module.css'
import common from '../common.module.css'
import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const NavBar = ({ children }: { children?: ReactNode }) => {
  return (
    <nav className={`${common.row} ${styles.nav}`}>
      <Wallet />
      <div className={`${common.row} ${styles.buttonRow}`}>
        {children}
        <Link href="/" className={common.button}>
          <Image src="/icons/home.svg" height={32} width={32} alt="Home" />
        </Link>
      </div>
    </nav>
  )
}
