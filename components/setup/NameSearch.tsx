import { usePrivy } from '@privy-io/react-auth'
import { Fragment_Mono } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { labelhash } from 'viem'
import { useContractRead } from 'wagmi'
import { createQueryString } from '../../lib/createQueryString'
import { SetupStep } from '../../lib/types'
import { LoadingIcon } from '../LoadingIcon'

import common from '../../common.module.css'
import styles from './NameSearch.module.css'

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

export const NameSearch = () => {
  const { ready, authenticated } = usePrivy()

  const [name, setName] = useState<string>('')

  const [debouncedName] = useDebounce(name, 500)

  const enabled = ready && authenticated && !!debouncedName

  const router = useRouter()

  const { data: isAvailable, isLoading } = useContractRead({
    ...ensRegistrarContract,
    functionName: 'available',
    args: [BigInt(labelhash(debouncedName))],
    enabled,
  })

  return (
    <>
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
          onClick={() =>
            router.push(
              `/setup?${createQueryString<SetupStep>('step', 'avatar')}`,
            )
          }
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
    </>
  )
}
