import { ReactNode } from 'react'
import styles from './Dropdown.module.css'
import common from '../common.module.css'

export const Dropdown = ({
  children,
  summary,
}: {
  children: ReactNode
  summary: ReactNode
}) => {
  return (
    <div className={styles.container}>
      <details className={styles.details}>
        <summary className={`${styles.summary} ${common.row}`}>
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
