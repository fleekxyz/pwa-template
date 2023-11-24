import { useEffect, useState } from 'react'
import common from '../../common.module.css'

export const Wait = () => {
  const [countdown, setCountdown] = useState<number>(0)

  useEffect(() => {
    const initialTimestamp = localStorage.getItem('commit-tx-date')
    if (initialTimestamp) {
      const initialDate = new Date(parseInt(initialTimestamp, 10))
      const fiveMinutesLater = new Date(initialDate.getTime() + 5 * 60 * 1000)
      const interval = setInterval(() => {
        const remainingTime = Math.max(fiveMinutesLater.getTime() - new Date().getTime(), 0)
        setCountdown(remainingTime)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [])

  const minutes = Math.floor(countdown / (60 * 1000))
  const seconds = Math.floor((countdown % (60 * 1000)) / 1000)

  const timeout = minutes === 0 && seconds === 0

  return (
    <>
      <h1>Wait</h1>
      <p>5 minutes have to pass to prevent others from registering the name.</p>
      {timeout
        ? <p>Last step - confirm registration</p>
        : (
          <p>
            Time remaining:
            {' '}
            {minutes}
            {' '}
            minutes
            {' '}
            {seconds}
            {' '}
            seconds
          </p>
          )}
      <button className={common.button} disabled={!timeout}>Register</button>
    </>
  )
}
