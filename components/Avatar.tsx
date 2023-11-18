'use client'

import {
  useState,
  useMemo,
  useEffect,
  DetailedHTMLProps,
  ImgHTMLAttributes,
} from 'react'
import { minidenticon } from 'minidenticons'
import styles from './Avatar.module.css'
import { zeroAddress } from 'viem'

export const Avatar = ({
  ens,
  address,
  size = 32,
  useContainer = true,
  ...props
}: {
  address: string
  size?: number
  ens: string
  useContainer?: boolean
} & DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
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
  }, [address])

  const ensAvatarUrl = `https://metadata.ens.domains/mainnet/avatar/${ens}`

  return isLoadingFailed
    ? (
      <div style={{ height: size, width: size }}>
        <img
          src={svgURI}
          height={size}
          width={size}
          alt="avatar"
          {...props}
          className={`${styles.avatar} ${props.className || ''}`}
        />
      </div>
      )
    : useContainer
      ? (
        <div style={{ height: size, width: size }}>
          <img
            src={ensAvatarUrl}
            alt="avatar"
            width={size}
            height={size}
            onError={() => {
              setLoadingFailed(true)
            }}
            {...props}
            className={`${styles.avatar} ${props.className || ''}`}
          />
        </div>
        )
      : (
        <img
          src={ensAvatarUrl}
          alt="avatar"
          width={size}
          height={size}
          onError={() => {
            setLoadingFailed(true)
          }}
          {...props}
          className={`${styles.avatar} ${props.className || ''}`}
        />
        )
}
