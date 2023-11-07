import { ReactNode } from 'react'
import styles from './Dropdown.module.css'
import common from '../common.module.css'

export const Dropdown = ({
  children,
  summary,
  className,
}: {
  children: ReactNode
  summary: ReactNode
  className?: string
}) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <details className={styles.details}>
        <summary
          className={`${styles.summary} ${common.row} ${common.summary}`}
        >
          {summary}
          <img
            className={styles.chevron}
            src="/chevron-down.svg"
            alt="chevron-down"
          />
        </summary>
        {children}
      </details>
    </div>
  )
}
