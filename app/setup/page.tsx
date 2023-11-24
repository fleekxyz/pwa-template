'use client'

import { NameSearch } from '../../components/setup/NameSearch'
import { NavBar } from '../../components/NavBar'
import { SetupStep } from '../../lib/types'

import styles from './page.module.css'
import common from '../../common.module.css'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { AvatarUpload } from '../../components/setup/AvatarUpload'
import { TextRecordsInput } from '../../components/setup/TextRecordsInput'
import { Commit } from '../../components/setup/Commit'
import { Wait } from '../../components/setup/Wait'

const OnboardingProcess = ({ step }: { step: SetupStep }) => {
  switch (step) {
    case 'name':
    default:
      return <NameSearch />
    case 'avatar':
      return <AvatarUpload />
    case 'social':
      return <TextRecordsInput />
    case 'commit':
      return <Commit />
    case 'wait':
      return <Wait />
  }
}

export default function SetupPage() {
  const searchParams = useSearchParams()
  const step = (searchParams.get('step') as SetupStep) || 'name'
  const router = useRouter()

  return (
    <>
      <NavBar>
        {step === 'name'
          ? null
          : (
            <button className={common.button} onClick={() => router.back()}>
              <Image height={32} width={32} src="/icons/undo.svg" alt="Back" />
            </button>
            )}
      </NavBar>
      <main className={`${styles.main} ${common.center}`}>
        <OnboardingProcess step={step} />
      </main>
    </>
  )
}
