'use client'

import styles from './Wallet.module.css'
import common from '../common.module.css'

import { useEffect, useMemo, useState } from 'react'
import { WalletWithMetadata, usePrivy, useWallets } from '@privy-io/react-auth'
import { formatAddress } from '../lib/formatAddress'
import { useWindowWidth } from '../lib/useWindowWidth'
import { Avatar } from './Avatar'
import { useRouter } from 'next/navigation'
import { Dropdown } from './Dropdown'
import { Address, useAccount, useDisconnect, useEnsName } from 'wagmi'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import { zeroAddress } from 'viem'
import { useConnected } from '../lib/useConnected'

export const Wallet = () => {
  const {
    logout,
    ready,
    authenticated,
    linkWallet,
    login,
    user,
    connectWallet,
  } = usePrivy()

  const { setActiveWallet, wallet: currentWallet } = usePrivyWagmi()

  const { wallets: connectedWallets } = useWallets()

  const { disconnect } = useDisconnect()

  const { data: ens } = useEnsName({
    address: currentWallet?.address as Address,
  })

  const isConnected = useConnected(currentWallet)

  const wallets = (user?.linkedAccounts.filter((a) => a.type === 'wallet') ||
    []) as WalletWithMetadata[]

  const router = useRouter()
  const windowWidth = useWindowWidth()
  const isMobile = useMemo(() => windowWidth < 800, [windowWidth])

  if (!ready && !authenticated) return <div className={styles.placeholder} />

  if ((ready && !authenticated) || !currentWallet || !isConnected) {
    return (
      <button
        className={`${common.button} ${styles.connect}`}
        onClick={() => {
          if (ready && !authenticated) login()
          else connectWallet()
        }}
      >
        Connect
      </button>
    )
  }

  return (
    <Dropdown
      className={styles.dropdown}
      summary={
        <>
          <Avatar address={currentWallet.address || zeroAddress} ens={ens!} />
          <span className={styles.address}>
            {ens ||
              (currentWallet.address
                ? formatAddress(currentWallet.address, isMobile ? 2 : 4)
                : null)}
          </span>
        </>
      }
    >
      <ul>
        {wallets
          .filter((w) => w.address !== currentWallet?.address)
          .map((wallet) => (
            <li key={wallet.address}>
              <button
                className={styles.button}
                onClick={() => {
                  const connectedWallet = connectedWallets.find(
                    (w) => w.address === wallet.address,
                  )
                  if (!connectedWallet) connectWallet()
                  else setActiveWallet(connectedWallet)
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
    </Dropdown>
  )
}
