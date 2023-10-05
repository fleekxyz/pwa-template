import { InputHTMLAttributes, ReactNode } from 'react'
import styles from './FormField.module.css'
import common from '../../common.module.css'

export const FormField = ({
  label,
  prefix,
  defaultOpen,
  ...props
}: {
  label: string
  prefix?: string
  name: string
  defaultOpen?: boolean
} & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <details
      className={`${styles.details} ${common.column}`}
      open={defaultOpen}
    >
      <summary className={common.summary}>
        <label htmlFor={props.name} className={`${common.row} ${styles.label}`}>
          {label}
          <img
            className={styles.chevron}
            src="/chevron-down.svg"
            alt="chevron-down"
          />
        </label>
      </summary>
      <span className={`${common.row} ${styles.inputRow}`}>
        {prefix}
        <input
          {...props}
          className={`${props.className || ''} ${common.input} ${styles.input}`}
        />
      </span>
    </details>
  )
}
