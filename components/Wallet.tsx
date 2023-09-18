import { usePrivyWagmi } from '@privy-io/wagmi-connector'
import styles from './Wallet.module.css'
import { useEnsAvatar, useEnsName } from 'wagmi'
import jazzicon from '@metamask/jazzicon'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { formatAddress } from '../lib/format'

export const Wallet = () => {
  const { wallet: activeWallet, ready, setActiveWallet } = usePrivyWagmi()
  const { logout } = usePrivy()
  const { wallets } = useWallets()
  const { data: avatar } = useEnsAvatar()
  const { data: ens } = useEnsName()
  const account = activeWallet?.address

  const [fetchable, setFetchable] = useState(true)
  const icon = useMemo(
    () => account && jazzicon(20, parseInt(account.slice(2, 10), 16)),
    [account],
  )
  const iconRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const current = iconRef.current
    if (icon) {
      current?.appendChild(icon)
      return () => {
        try {
          current?.removeChild(icon)
        } catch (e) {
          console.error('Avatar icon not found')
        }
      }
    }
    return
  }, [icon, iconRef])

  const handleError = () => setFetchable(false)

  return (
    <details className={styles.container}>
      <summary className={styles.summary}>
        {avatar && fetchable ? (
          <img
            src={avatar}
            alt="avatar"
            className={styles.avatar || jazzicon(20)}
            onError={handleError}
          />
        ) : (
          <span className={styles.iconRef} ref={iconRef} />
        )}
        <span className={styles.address}>
          {ready && account ? ens || formatAddress(account) : 'Loading...'}
        </span>
        <img
          className={styles.chevron}
          src="/chevron-down.svg"
          alt="chevron-down"
        />
      </summary>
      <ul className={styles.walletList}>
        {wallets
          .filter((w) => w.address !== account)
          .map((wallet) => (
            <li>
              <button
                className={styles.button}
                onClick={() => {
                  setActiveWallet(wallet)
                }}
              >
                {formatAddress(wallet.address, 7)}
              </button>
            </li>
          ))}
        {ready ? (
          <button
            className={styles.button}
            onClick={() => {
              logout()
            }}
          >
            Disconnect
          </button>
        ) : undefined}
      </ul>
    </details>
  )
}
