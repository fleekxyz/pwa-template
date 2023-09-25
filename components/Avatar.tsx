'use client'

import { useState, useMemo } from 'react'
import { minidenticon } from 'minidenticons'
import styles from './Avatar.module.css'

export const Avatar = ({
  avatar,
  address,
  size = 20,
}: {
  avatar?: string
  address: string
  size?: number
}) => {
  const [fetchable, setFetchable] = useState(true)
  const svgURI = useMemo(
    () =>
      address &&
      'data:image/svg+xml;utf8,' +
        encodeURIComponent(minidenticon(address.slice(2, 10))),
    [address],
  )

  const handleError = () => setFetchable(false)

  console.log({ address, avatar })

  return (
    <img
      src={fetchable && avatar ? avatar : svgURI}
      alt="avatar"
      className={styles.avatar}
      onError={handleError}
      width={size}
      height={size}
    />
  )
}
