import { usePrivy } from '@privy-io/react-auth'
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

const fragmentMono = Fragment_Mono({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  adjustFontFallback: false,
})

export const NameSearch = () => {
  const { ready, authenticated } = usePrivy()

  const [name, setName] = useState<string>('')

  useEffect(() => {
    const cachedName = sessionStorage.getItem('name')

    if (cachedName) setName(cachedName)
  }, [])

  const [debouncedName] = useDebounce(name, 500)

  const enabled = ready && authenticated && !!debouncedName

  const router = useRouter()

  const [isAvailable, setAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    setAvailable(null)
    ensClient
      .getAvailable({ name: `${name}.eth` })
      .then((available) => setAvailable(available))
  }, [name])

  return (
    <>
      <h1>Pick a name</h1>
      <div className={`${common.row} ${styles.searchBar}`}>
        <span className={styles.name}>
          <input
            className={`${common.input} ${fragmentMono.className} ${styles.nameInput}`}
            value={name}
            style={{ width: `${name.length || 5}ch` }}
            onChange={(e) => {
              const value = e.currentTarget.value

              if (value === '') {
                sessionStorage.removeItem('json-records')
              }

              setName(value)
            }}
          />
          .eth
        </span>
        <button
          disabled={!enabled || !isAvailable}
          className={`${common.button} ${styles.searchButton}`}
          onClick={() => {
            sessionStorage.setItem('name', name)
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
          enabled ? (isAvailable ? 'available' : 'taken') : 'disabled'
        }
      >
        {enabled ? (
          isAvailable === null ? (
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
