'use client'

import { Wallet } from './Wallet'
import styles from './NavBar.module.css'
import common from '../common.module.css'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import { Address, useEnsName } from 'wagmi'
import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePrivy } from '@privy-io/react-auth'

export const NavBar = ({ children }: { children?: ReactNode }) => {
  const { wallet, setActiveWallet } = usePrivyWagmi()
  const { data: ens } = useEnsName({
    address: wallet?.address as Address,
  })

  return (
    <nav className={styles.nav}>
      <Wallet {...{ setActiveWallet, wallet, ens }} />
      <div>
        {children}
        <Link
          href="/"
          className={`${common.center} ${common.button} ${styles.home}`}
        >
          <Image src="/icons/home.svg" height={32} width={32} alt="Home" />
        </Link>
      </div>
    </nav>
  )
}
