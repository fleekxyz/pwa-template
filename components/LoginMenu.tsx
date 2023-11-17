'use client'

import styles from './LoginMenu.module.css'
import common from '../common.module.css'
import { Address, useEnsName, useNetwork } from 'wagmi'
import Link from 'next/link'
import { useDynamicContext } from '../lib/dynamic'
import { LoadingIcon } from './LoadingIcon'

const SetupLink = () => (
  <Link href="/setup" className={`${styles.link} ${common.button}`}>
    Set up an ENS profile
  </Link>
)

export const LoginMenu = (): JSX.Element => {
  const { primaryWallet, user, setShowAuthFlow, showAuthFlow } =
    useDynamicContext()

  const {
    data: ens,
    isError,
    isLoading,
  } = useEnsName({
    address: primaryWallet?.address as Address,
    enabled: !!user && !!primaryWallet,
  })

  if (user && primaryWallet) {
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
        <Link
          className={`${styles.link} ${common.button}`}
          href={`/profile?name=${ens}`}
        >
          Open my ENS profile
        </Link>
        <SetupLink />
      </>
    )
  } else {
    return (
      <button
        disabled={showAuthFlow}
        className={`${styles.link} ${common.button}`}
        onClick={() => {
          setShowAuthFlow(true)
        }}
      >
        {showAuthFlow ? <LoadingIcon /> : 'Sign In'}
      </button>
    )
  }
}
