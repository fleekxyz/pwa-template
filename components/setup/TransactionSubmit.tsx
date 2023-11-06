'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ensClient, ethEnsRegistrar } from '../../lib/ens'
import { formatEther } from 'viem'
import {
  useAccount,
  useFeeData,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWalletClient,
} from 'wagmi'
import { makeCommitment, randomSecret } from '@ensdomains/ensjs/utils'
import styles from '../../common.module.css'
import { LoadingIcon } from '../LoadingIcon'

const ONE_YEAR = 365 * 24 * 60 * 60

export const TransactionSubmit = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const { address, isConnected } = useAccount()

  useEffect(() => {
    const cachedName = sessionStorage.getItem('name')

    if (!cachedName) return router.push('/setup')

    setName(cachedName)
  }, [])

  const [price, setPrice] = useState(0n)

  const [ethPrice, setEthPrice] = useState(0)

  useEffect(() => {
    ensClient
      .getPrice({ nameOrNames: `${name}.eth`, duration: ONE_YEAR })
      .then(({ base }) => {
        setPrice(base)
        fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
          .then((res) => res.json())
          .then((data) => {
            setEthPrice(data.USD)
          })
      })
  }, [name])

  const secret = useMemo(() => {
    return randomSecret()
  }, [name])

  const commitmentHash = useMemo(() => {
    if (name && isConnected)
      return makeCommitment({
        name: `${name}.eth`,
        owner: address!,
        duration: 0,
        secret,
      })
    else return '0x'
  }, [isConnected])

  const { config } = usePrepareContractWrite({
    ...ethEnsRegistrar,
    functionName: 'commit',
    args: [commitmentHash],
  })

  const [contractGas, setContractGas] = useState(0n)
  const { data } = useFeeData()

  const client = usePublicClient()

  useEffect(() => {
    if (commitmentHash !== '0x')
      client
        .estimateContractGas({
          ...ethEnsRegistrar,
          functionName: 'commit',
          args: [commitmentHash],
          account: address!,
        })
        .then((gas) => setContractGas(gas))
  }, [commitmentHash])

  const { write, isLoading, error } = useContractWrite(config)

  return (
    <>
      <h1>Checkout</h1>
      <p>Your ENS profile is ready to purchase</p>
      <h2>{name}.eth</h2>
      <p>
        Price: ${(parseFloat(formatEther(price)) * ethPrice).toPrecision(3)}
      </p>
      {/* <p>Gas cost: ${(parseFloat(formatEther((data?.maxFeePerGas! + data?.maxPriorityFeePerGas!) * contractGas)) * ethPrice).toPrecision(3)}</p> */}
      {error && <p className={styles.error}>{error.message}</p>}
      <button
        className={styles.button}
        disabled={!write || isLoading}
        onClick={() => {
          write?.()
        }}
      >
        {isLoading ? <LoadingIcon /> : 'Commit name'}
      </button>
    </>
  )
}
