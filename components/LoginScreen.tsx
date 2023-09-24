'use client'

import { usePrivy } from '@privy-io/react-auth'
import styles from './LoginScreen.module.css'
import { useRouter } from 'next/navigation'
import { useAccount, useEnsName } from 'wagmi'

export const LoginScreen = (): JSX.Element => {
  const { login, ready, authenticated } = usePrivy()
  const router = useRouter()

  const { address } = useAccount()
  const { data: ens, isError, isLoading } = useEnsName({ address })

  if (!ready) {
    return <></>
  }

  if (ready && authenticated) {
    if (ens || isLoading || isError) {
      if (ens) return router.push(`/${ens}`) as undefined
      if (isLoading) return <p>Loading ENS...</p>
      if (isError) return <p>Error loading ENS</p>
    } else return router.push('/setup') as undefined
  }
  if (ready && !authenticated)
    return (
      <main className={styles.main}>
        <h1 className={styles.h1}>Fleek PWA Template</h1>
        <button
          className={styles.login}
          onClick={() => {
            login()
          }}
        >
          Sign In
        </button>
      </main>
    )
}
