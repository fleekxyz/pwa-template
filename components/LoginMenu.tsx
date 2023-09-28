'use client'

import { usePrivy } from '@privy-io/react-auth'
import styles from './LoginMenu.module.css'
import common from '../common.module.css'
import { Address, useAccount, useEnsName } from 'wagmi'
import Link from 'next/link'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'

export const LoginMenu = (): JSX.Element => {
  const { login, ready, authenticated } = usePrivy()

  const { wallet } = usePrivyWagmi()

  const {
    data: ens,
    isError,
    isLoading,
  } = useEnsName({
    address: wallet?.address as Address,
    enabled: ready && authenticated,
  })

  if (!ready) {
    return <></>
  }

  if (authenticated) {
    if (isError)
      return (
        <p className={`${styles.link} ${common.button}`}>
          Error fetching ENS profile
        </p>
      )
    if (isLoading)
      return <p className={`${styles.link} ${common.button}`}>Loading...</p>
    if (!ens)
      return (
        <Link href="/setup" className={`${styles.link} ${common.button}`}>
          Setup a new ENS profile
        </Link>
      )
    return (
      <Link className={`${styles.link} ${common.button}`} href={`/${ens}`}>
        Open my ENS profile
      </Link>
    )
  } else {
    return (
      <>
        <button
          className={`${styles.link} ${common.button}`}
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