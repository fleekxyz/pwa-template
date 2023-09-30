'use client'

import { NameSearch } from '../../components/setup/NameSearch'
import { NavBar } from '../../components/NavBar'
import { SetupStep } from '../../lib/types'

import styles from './page.module.css'
import common from '../../common.module.css'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const OnboardingProcess = ({ step }: { step: SetupStep }) => {
  switch (step) {
    case 'name':
    default:
      return <NameSearch />
    case 'avatar':
      return <h1>aaa</h1>
  }
}

export default function SetupPage({
  searchParams,
}: {
  searchParams: { step: SetupStep }
}) {
  const step = searchParams.step || 'name'
  const router = useRouter()

  return (
    <>
      <NavBar>
        {step === 'name' ? null : (
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
