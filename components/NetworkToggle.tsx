'use client'

import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { Dropdown } from './Dropdown'

import styles from './NetworkToggle.module.css'
import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'

export const NetworkToggle = () => {
  const [mounted, setMounted] = useState(false)
  const { ready, authenticated } = usePrivy()
  useEffect(() => setMounted(true), [])
  const { chain } = useNetwork()
  const { isLoading, pendingChainId, switchNetwork, reset, chains } =
    useSwitchNetwork({
      onSettled: () => {
        reset()
      },
    })

  return mounted && ready && authenticated && chain ? (
    <Dropdown className={styles.dropdown} summary={chain.name}>
      <ul>
        {chains
          .filter((x) => x.id !== chain?.id)
          .map((x) => (
            <li key={x.id}>
              {
                <button
                  disabled={!switchNetwork || x.id === chain?.id}
                  key={x.id}
                  onClick={() => switchNetwork?.(x.id)}
                >
                  {x.name}
                  {isLoading && pendingChainId === x.id && ' (switching)'}
                </button>
              }
            </li>
          ))}
      </ul>
    </Dropdown>
  ) : null
}
