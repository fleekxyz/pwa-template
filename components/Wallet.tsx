'use client'

import styles from './Wallet.module.css'
import { useEnsAvatar } from 'wagmi'

import { useEffect, useMemo } from 'react'
import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth'
import { formatAddress } from '../lib/formatAddress'
import { useWindowWidth } from '../lib/useWindowWidth'
import { Avatar } from './Avatar'
import { useRouter } from 'next/navigation'
import { Dropdown } from './Dropdown'

export const Wallet = ({
  wallet: currentWallet,
  setActiveWallet,
  ens,
}: {
  wallet: ConnectedWallet
  setActiveWallet: (w: ConnectedWallet) => Promise<void>
  ens: string
}) => {
  const { logout, authenticated, ready } = usePrivy()
  const { wallets } = useWallets()
  const { data: avatar } = useEnsAvatar({ name: ens })

  const router = useRouter()
  const windowWidth = useWindowWidth()
  const isMobile = useMemo(() => windowWidth < 800, [windowWidth])

  useEffect(() => {
    if (ready && !authenticated) router.push('/')
  }, [authenticated, ready])

  if (!currentWallet) return <></>

  return (
    <Dropdown
      summary={
        <>
          <Avatar {...{ avatar }} address={currentWallet.address} />
          <span className={styles.address}>
            {currentWallet.isConnected
              ? ens || formatAddress(currentWallet.address, isMobile ? 2 : 4)
              : 'Loading...'}
          </span>
        </>
      }
    >
      {currentWallet ? (
        <ul className={styles.walletList}>
          {wallets
            .filter((w) => w.address !== currentWallet.address)
            .map((wallet) => (
              <li key={wallet.address}>
                <button
                  className={styles.button}
                  onClick={() => {
                    setActiveWallet(wallet)
                  }}
                >
                  {formatAddress(wallet.address, isMobile ? 3 : 7)}{' '}
                </button>
              </li>
            ))}
          <button
            className={styles.button}
            onClick={() => {
              logout()
              router.push('/')
            }}
          >
            Disconnect
          </button>
        </ul>
      ) : undefined}
    </Dropdown>
  )
}
