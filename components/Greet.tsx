'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Wallet } from './Wallet'

import styles from './Greet.module.css'

export const Greet = () => {
  const { ready, authenticated, login } = usePrivy()

  if (!ready) {
    return <></>
  }

  if (ready && !authenticated) {
    return (
      <button className={styles.login} onClick={login}>
        Login
      </button>
    )
  }

  if (ready && authenticated) {
    return <Wallet />
  }
}
