'use client'

import common from '../../common.module.css'
import styles from './TextRecordsInput.module.css'
import { FormField } from './FormField'
import { useEffect, useState } from 'react'
import { LinkType, SetupStep } from '../../lib/types'
import { useRouter } from 'next/navigation'
import { createQueryString } from '../../lib/createQueryString'

export const TextRecordsInput = () => {
  const [textRecords, setTextRecords] = useState<Record<
    LinkType | 'description',
    string
  > | null>(null)

  const router = useRouter()

  useEffect(() => {
    const records = sessionStorage.getItem('text-records')

    if (records) {
      try {
        setTextRecords(JSON.parse(records))
      } catch {}
    }
  }, [])

  return (
    <>
      <div className={styles.placeholder} />
      <form
        className={`${styles.form} ${common.column}`}
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const entries = Object.fromEntries(fd.entries())

          if (e.currentTarget.reportValidity()) {
            sessionStorage.setItem('text-records', JSON.stringify(entries))

            router.push(
              `/setup?${createQueryString<SetupStep>('step', 'register')}`,
            )
          }
        }}
      >
        <FormField
          type="text"
          label="Bio"
          name="description"
          placeholder="Tell about yourself"
          defaultOpen
          defaultValue={textRecords?.description}
        />
        <FormField
          name="email"
          type="email"
          label="Email"
          placeholder="me@example.com"
          defaultOpen
          autoComplete="on"
          defaultValue={textRecords?.email}
        />
        <FormField
          type="url"
          label="Website"
          name="url"
          placeholder="https://example.com"
          defaultOpen
          defaultValue={textRecords?.url}
        />
        <FormField
          label="Telegram"
          name="telegram"
          placeholder="username"
          prefix="t.me/"
          defaultValue={textRecords?.telegram}
        />
        <FormField
          label="GitHub"
          name="github"
          prefix="github.com/"
          placeholder="username"
          defaultValue={textRecords?.github}
        />
        <FormField
          label="Twitter"
          name="twitter"
          prefix="twitter.com/"
          placeholder="username"
          defaultValue={textRecords?.twitter}
        />
        <FormField
          label="Reddit"
          name="reddit"
          prefix="reddit.com/u/"
          placeholder="username"
          defaultValue={textRecords?.reddit}
        />
        <FormField
          label="Discord"
          name="discord"
          prefix="discord.gg/"
          placeholder="user ID"
          defaultValue={textRecords?.discord}
        />
        <button type="submit" className={`${common.button} ${styles.submit}`}>
          Next
        </button>
      </form>
    </>
  )
}
