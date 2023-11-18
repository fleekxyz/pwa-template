type TransactionStatusProps = {
  status: 'success' | 'error' | 'idle' | 'loading'
}

export const TransactionStatus = ({ status }: TransactionStatusProps) => {
  switch (status) {
    case 'success':
      // Handle success case
      break
    case 'error':
      // Handle error case
      break
    case 'idle':
      // Handle idle case
      break
    case 'loading':
      // Handle loading case
      break
    default:
            // Handle default case
  }
}
