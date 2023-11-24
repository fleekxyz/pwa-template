import { ExternalLink } from 'react-external-link'
import { Chain, Hash } from 'viem'
import styles from './TransactionStatus.module.css'

type TransactionStatusProps = {
  status: 'success' | 'error' | 'loading' | 'idle'
  hash?: Hash
  chain: Chain
}

export const TransactionStatus = ({ status, hash, chain }: TransactionStatusProps) => {
  const explorerUrl = chain ? `${chain.blockExplorers!.etherscan!.url}/tx/${hash}` : ''

  switch (status) {
    case 'error':
      return (
        <ExternalLink href={explorerUrl} className={`${styles.container} ${styles.error}`}>
          Transaction failed
        </ExternalLink>
      )
    case 'loading':
      return (
        <ExternalLink href={explorerUrl} className={`${styles.container} ${styles.loading}`}>
          Transaction pending
        </ExternalLink>
      )
    default:
      return <></>
  }
}
