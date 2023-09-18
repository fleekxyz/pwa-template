'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Wallet } from './Wallet'

import { LoginScreen } from './LoginScreen'
import { NavBar } from './NavBar'

export const Greet = () => {
  const { ready, authenticated, login } = usePrivy()

  if (!ready) {
    return <></>
  }

  if (ready && !authenticated) {
    return <LoginScreen login={login} />
  }

  if (ready && authenticated) {
    return <NavBar />
  }
}
