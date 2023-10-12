'use client'

import styles from './Wallet.module.css'
import common from '../common.module.css'

import { useMemo } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { formatAddress } from '../lib/formatAddress'
import { useWindowWidth } from '../lib/useWindowWidth'
import { Avatar } from './Avatar'
import { useRouter } from 'next/navigation'
import { Dropdown } from './Dropdown'
import { LoadingIcon } from './LoadingIcon'
import { Address, useAccount, useDisconnect, useEnsName } from 'wagmi'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'

export const Wallet = () => {
  const { logout, ready, authenticated, linkWallet, login } = usePrivy()
  const { wallets } = useWallets()

  const router = useRouter()
  const windowWidth = useWindowWidth()
  const isMobile = useMemo(() => windowWidth < 800, [windowWidth])

  const { setActiveWallet, wallet } = usePrivyWagmi()

  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const { data: ens } = useEnsName({
    address: address || (wallet?.address as Address),
  })

  if (ready && !authenticated)
    return (
      <button className={`${common.button} ${styles.connect}`} onClick={login}>
        Connect
      </button>
    )

  return (
    <Dropdown
      summary={
        <>
          <Avatar address={address} ens={ens} />
          <span className={styles.address}>
            {ens ||
              (address || wallet?.address
                ? formatAddress(address || wallet?.address, isMobile ? 2 : 4)
                : null)}
          </span>
        </>
      }
    >
      {wallet?.isConnected ? (
        <ul className={styles.walletList}>
          {wallets
            .filter((w) => w.address !== address)
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
          <li>
            <button className={styles.button} onClick={linkWallet}>
              Link another wallet
            </button>
          </li>
          <button
            className={styles.button}
            onClick={() => {
              try {
                disconnect()
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
