import { useState, useMemo, useRef, useLayoutEffect } from 'react'
import jazzicon from '@metamask/jazzicon'
import styles from './Avatar.module.css'

export const Avatar = ({
  avatar,
  address,
}: {
  avatar: string
  address: string
}) => {
  const [fetchable, setFetchable] = useState(true)
  const icon = useMemo(
    () => address && jazzicon(20, parseInt(address.slice(2, 10), 16)),
    [address],
  )
  const iconRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const current = iconRef.current
    if (icon) {
      current?.appendChild(icon)
      return () => {
        try {
          current?.removeChild(icon)
        } catch (e) {
          console.error('Avatar icon not found')
        }
      }
    }
    return
  }, [icon, iconRef])

  const handleError = () => setFetchable(false)

  return avatar && fetchable ? (
    <img
      src={avatar}
      alt="avatar"
      className={styles.avatar || jazzicon(20)}
      onError={handleError}
    />
  ) : (
    <span className={styles.iconRef} ref={iconRef} />
  )
}
