import { ConnectedWallet } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'

export const useConnected = (wallet?: ConnectedWallet) => {
  const [isConnected, setConnected] = useState(false)

  useEffect(() => {
    if (wallet) wallet.isConnected().then(setConnected)
  }, [wallet])

  return isConnected
}
