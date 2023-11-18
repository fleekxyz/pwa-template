'use client'

import Image from 'next/image'
import common from '../common.module.css'

export const ShareProfile = () => {
  return (
    <button
      className={common.button}
      onClick={async () => {
        if (typeof navigator.share !== 'undefined') {
          await navigator.share({
            title: 'Share your ENS profile',
            text: location.href,
          })
        }
        else await navigator.clipboard.writeText(location.href)
      }}
    >
      <Image src="/icons/share.svg" height={32} width={32} alt="Share" />
    </button>
  )
}
