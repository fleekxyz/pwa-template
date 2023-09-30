'use client'

import { usePrivy } from '@privy-io/react-auth'
import { use, useMemo, useState } from 'react'
import { labelhash, zeroAddress } from 'viem'
import { useContractRead, useEnsResolver } from 'wagmi'
import styles from './page.module.css'
import common from '../../common.module.css'
import { Fragment_Mono } from 'next/font/google'
import { useDebounce } from 'use-debounce'
import Image from 'next/image'
import { LoadingIcon } from '../../components/LoadingIcon'

const fragmentMono = Fragment_Mono({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  adjustFontFallback: false,
})

const ensRegistrarContract = {
  abi: [
    {
      constant: true,
      inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
      name: 'available',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],
  address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
} as const

export default function SetupPage() {
  const { ready, authenticated } = usePrivy()

  const [name, setName] = useState<string>('')

  const [debouncedName] = useDebounce(name, 500)

  const enabled = ready && authenticated && !!debouncedName

  const { data: isAvailable, isLoading } = useContractRead({
    ...ensRegistrarContract,
    functionName: 'available',
    args: [BigInt(labelhash(debouncedName))],
    enabled,
  })

  return (
    <main className={`${styles.main} ${common.center}`}>
      <h1>Pick a name</h1>
      <div className={`${common.row} ${styles.searchBar}`}>
        <span className={styles.name}>
          <input
            className={`${common.input} ${fragmentMono.className} ${styles.nameInput}`}
            value={name}
            style={{ width: `${name.length || 5}ch` }}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          .eth
        </span>
        <button
          disabled={!enabled || isLoading || !isAvailable}
          className={`${common.button} ${styles.searchButton}`}
        >
          Register
        </button>
      </div>
      <span
        className={styles.status}
        data-status={
          enabled ? (isAvailable ? 'available' : 'taken') : 'disabled'
        }
      >
        {enabled ? (
          isLoading ? (
            <LoadingIcon />
          ) : isAvailable ? (
            <>Available</>
          ) : (
            <>Taken</>
          )
        ) : (
          <>Start typing</>
        )}
      </span>
    </main>
  )
}
