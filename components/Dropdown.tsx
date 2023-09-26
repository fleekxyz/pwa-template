import { ReactNode } from 'react'
import styles from './Dropdown.module.css'

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
        <summary className={styles.summary}>
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
