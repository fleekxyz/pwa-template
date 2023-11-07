'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import styles from './LoginMenu.module.css'
import common from '../common.module.css'
import { Address, useAccount, useEnsName, useNetwork } from 'wagmi'
import Link from 'next/link'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import { useConnected } from '../lib/useConnected'

const SetupLink = () => (
  <Link href="/setup" className={`${styles.link} ${common.button}`}>
    Set up an ENS profile
  </Link>
)

export const LoginMenu = (): JSX.Element => {
  const { login, ready, authenticated, connectWallet } = usePrivy()

  const { chain } = useNetwork()
  const { wallet, } = usePrivyWagmi()

  const {
    data: ens,
    isError,
    isLoading,
  } = useEnsName({
    address: wallet?.address as Address,
    enabled: ready && authenticated && !!wallet,
    chainId: chain?.id,
  })

  const isConnected = useConnected(wallet)

  if (!ready) {
    return <></>
  }

  if (authenticated && isConnected) {
    if (isError)
      return (
        <p className={`${styles.link} ${common.error}`}>
          Error fetching ENS profile
        </p>
      )
    if (isLoading)
      return <p className={`${styles.link} ${common.button}`}>Loading...</p>
    if (!ens) return <SetupLink />
    return (
      <>
        <Link className={`${styles.link} ${common.button}`} href={`/${ens}`}>
          Open my ENS profile
        </Link>
        <SetupLink />
      </>
    )
  } else {
    return (
      <>
        <button
          className={`${styles.link} ${common.button}`}
          onClick={() => {
            if (ready && !authenticated) login()
            else connectWallet()
          }}
        >
          Sign In
        </button>
      </>
    )
  }
}
