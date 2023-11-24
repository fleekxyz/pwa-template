import { Fragment_Mono } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { createQueryString } from '../../lib/createQueryString'
import { SetupStep } from '../../lib/types'
import { LoadingIcon } from '../LoadingIcon'

import common from '../../common.module.css'
import styles from './NameSearch.module.css'
import { ensClient } from '../../lib/ens'
import { useAccount } from 'wagmi'
import { validateEnsName } from '../../lib/validateEnsName'

const fragmentMono = Fragment_Mono({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  adjustFontFallback: false,
})

export const NameSearch = () => {
  const [name, setName] = useState<string>('')

  useEffect(() => {
    const cachedName = localStorage.getItem('name')

    if (cachedName) setName(cachedName)
  }, [])

  const [debouncedName] = useDebounce(name, 500)
  const { isConnected } = useAccount()

  const router = useRouter()

  const [isAvailable, setAvailable] = useState<boolean | null>(null)
  const isValid = validateEnsName(debouncedName)

  useEffect(() => {
    setAvailable(null)
    ensClient
      .getAvailable({ name: `${debouncedName}.eth` })
      .then(available => setAvailable(available))
  }, [debouncedName])

  return (
    <>
      <h1>Pick a name</h1>
      <div className={`${common.row} ${styles.searchBar}`}>
        <span className={styles.name}>
          <input
            className={`${common.input} ${fragmentMono.className} ${styles.nameInput}`}
            value={name}
            style={{ width: `${debouncedName.length || 5}ch` }}
            onChange={(e) => {
              const value = e.currentTarget.value

              if (value === '') {
                localStorage.removeItem('json-records')
              }

              setName(value)
            }}
          />
          .eth
        </span>
        <button
          disabled={!isAvailable}
          className={`${common.button} ${styles.searchButton}`}
          onClick={() => {
            localStorage.setItem('name', debouncedName)
            router.push(
              `/setup?${createQueryString<SetupStep>('step', 'avatar')}`,
            )
          }}
        >
          Register
        </button>
      </div>
      <span
        className={styles.status}
        data-status={
          isConnected
            ? isValid
              ? isAvailable
                ? 'available'
                : 'taken'
              : 'invalid'
            : 'disabled'
        }
      >
        {isConnected
          ? (
              isAvailable === null
                ? (
                  <LoadingIcon />
                  )
                : isValid
                  ? (
                      isAvailable
                        ? (
                          <>Available</>
                          )
                        : (
                          <>Taken</>
                          )
                    )
                  : (
                    <>Invalid</>
                    )
            )
          : (
            <>Start typing</>
            )}
      </span>
    </>
  )
}
