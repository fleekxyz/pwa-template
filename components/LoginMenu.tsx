'use client'

import { usePrivy } from '@privy-io/react-auth'
import styles from './LoginMenu.module.css'
import { useAccount, useEnsName } from 'wagmi'
import Link from 'next/link'

export const LoginMenu = (): JSX.Element => {
  const { login, ready, authenticated } = usePrivy()

  const { address } = useAccount()
  const { data: ens, isError, isLoading } = useEnsName({ address })

  if (!ready) {
    return <></>
  }

  if (authenticated) {
    if (isError)
      return <p className={styles.link}>Error fetching ENS profile</p>
    if (isLoading) return <p className={styles.link}>Loading...</p>
    if (!ens)
      return (
        <Link href="/setup" className={styles.link}>
          Setup a new ENS profile
        </Link>
      )
    return (
      <Link className={styles.link} href={`/${ens}`}>
        Open my ENS profile
      </Link>
    )
  } else {
    return (
      <>
        <button
          className={styles.login}
          onClick={() => {
            login()
          }}
        >
          Sign In
        </button>
      </>
    )
  }
}
