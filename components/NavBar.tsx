'use client'

import { Wallet } from './Wallet'
import styles from './NavBar.module.css'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import { Address, useEnsName } from 'wagmi'

export const NavBar = () => {
  const { wallet, setActiveWallet } = usePrivyWagmi()
  const { data: ens } = useEnsName({ address: wallet?.address as Address })

  return (
    <nav className={styles.nav}>
      <Wallet {...{ setActiveWallet, wallet, ens }} />
    </nav>
  )
}
