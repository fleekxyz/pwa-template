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
  const { logout, ready, authenticated } = usePrivy()
  const { wallets } = useWallets()

  const router = useRouter()
  const windowWidth = useWindowWidth()
  const isMobile = useMemo(() => windowWidth < 800, [windowWidth])

  if (!currentWallet || !(ready && authenticated))
    return <div style={{ width: 222 }}></div>

  return (
    <Dropdown
      summary={
        <>
          <Avatar address={currentWallet.address} ens={ens} />
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
              try {
                currentWallet.disconnect()
                logout()
              } catch (e) {
                console.error('Error disconnecting: ', e)
              }
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
