'use client'

import { useState, useMemo, useEffect } from 'react'
import { minidenticon } from 'minidenticons'
import styles from './Avatar.module.css'
import Image from 'next/image'
import { zeroAddress } from 'viem'

export const Avatar = ({
  ens,
  address,
  size = 32,
  sizes,
}: {
  address: string
  size?: number
  ens: string
  sizes?: string
}) => {
  const svgURI = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        minidenticon(address ? address.slice(2, 10) : zeroAddress),
      )}`,
    [address],
  )

  const [isLoadingFailed, setLoadingFailed] = useState(false)

  useEffect(() => {
    setLoadingFailed(false)
  }, [ens, address])

  const ensAvatarUrl = `https://metadata.ens.domains/mainnet/avatar/${ens}`

  return (
    <div>
      {isLoadingFailed ? (
        <div style={{ height: size, width: size }}>
          <img
            src={svgURI}
            height={size}
            width={size}
            sizes={sizes}
            className={styles.avatar}
            alt="avatar"
          />
        </div>
      ) : (
        <Image
          src={ensAvatarUrl}
          alt="avatar"
          className={styles.avatar}
          sizes={sizes}
          width={size}
          height={size}
          onLoadingComplete={(result) => {
            if (result.naturalWidth === 0) {
              setLoadingFailed(true)
            }
          }}
          onError={() => {
            setLoadingFailed(true)
          }}
        />
      )}
    </div>
  )
}
