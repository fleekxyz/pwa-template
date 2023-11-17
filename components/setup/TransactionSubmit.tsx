'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ensClient, ethEnsRegistrar } from '../../lib/ens'
import { Address, BaseError, Hash, formatEther } from 'viem'
import {
  useFeeData,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useAccount,
  useWaitForTransaction,
} from 'wagmi'
import { makeCommitment, randomSecret } from '@ensdomains/ensjs/utils'
import { LoadingIcon } from '../LoadingIcon'

import common from '../../common.module.css'
import styles from './TransactionSubmit.module.css'
import { useOnMount } from '../../lib/useOnMount'

const ONE_YEAR = 365 * 24 * 60 * 60

export const TransactionSubmit = () => {
  const router = useRouter()
  const [name, setName] = useState('')

  const isMounted = useOnMount()

  useEffect(() => {
    const cachedName = sessionStorage.getItem('name')

    if (!cachedName) return router.push('/setup')

    setName(cachedName)
  }, [])

  const [price, setPrice] = useState(0n)
  const { address, isConnected } = useAccount()
  const [ethPrice, setEthPrice] = useState(0)

  useEffect(() => {
    if (name) {
      ensClient
        .getPrice({ nameOrNames: `${name}.eth`, duration: ONE_YEAR })
        .then(({ base }) => {
          setPrice(base)
          fetch(
            'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
          )
            .then((res) => res.json())
            .then((data) => {
              setEthPrice(data.USD)
            })
        })
    }
  }, [name])

  const [commitmentHash, setCommitmentHash] = useState<Hash>('0x')

  useEffect(() => {
    if (name && address) {
      setCommitmentHash(
        makeCommitment({
          name: `${name}.eth`,
          owner: address!,
          duration: 0,
          secret: randomSecret(),
        }),
      )
    } else setCommitmentHash('0x')
  }, [name, address])

  const [contractGas, setContractGas] = useState(0n)

  const client = usePublicClient()

  useEffect(() => {
    if (address && commitmentHash !== '0x')
      client
        .estimateContractGas({
          ...ethEnsRegistrar,
          functionName: 'commit',
          args: [commitmentHash],
          account: address,
        })
        .then((gas) => {
          setContractGas(gas)
        })
  }, [commitmentHash, address])

  const { config } = usePrepareContractWrite({
    ...ethEnsRegistrar,
    functionName: 'commit',
    args: [commitmentHash],
    enabled: commitmentHash !== '0x' && isConnected,
  })

  const { write, isLoading, error, data, isSuccess } = useContractWrite({
    ...config,
    onSuccess: ({ hash }) => {
      localStorage.setItem('commit-tx-hash', hash)
    },
  })

  const { data: feeData, isLoading: isFeeDataLoading } = useFeeData()

  const gasCostInEth = isFeeDataLoading
    ? 0n
    : (feeData?.lastBaseFeePerGas! + feeData?.maxPriorityFeePerGas!) *
      contractGas

  const [commitTxHash, setCommitTxHash] = useState<Hash | undefined>(undefined)

  useEffect(() => {
    if (data?.hash) setCommitTxHash(data.hash)
    else if (isMounted) {
      const hash = localStorage.getItem('commit-tx-hash')

      if (hash) setCommitTxHash(hash as Hash)
    }
  }, [data, isMounted])

  const receipt = useWaitForTransaction({
    hash: commitTxHash,
    enabled: Boolean(commitTxHash),
  })

  useEffect(() => {
    if (receipt.isFetched) localStorage.removeItem('commit-tx-hash')
  }, [receipt])

  return (
    <>
      <h1>Checkout</h1>
      <p>Your ENS profile is ready to purchase.</p>
      <h2>{name}.eth</h2>
      <div>
        <span className={styles.price}>
          ${(parseFloat(formatEther(price)) * ethPrice).toPrecision(3)}
        </span>{' '}
        + ${(parseFloat(formatEther(gasCostInEth)) * ethPrice).toPrecision(3)}{' '}
        fees
      </div>
      {error ? (
        <p className={common.error}>{(error as BaseError).details}</p>
      ) : null}
      <button
        className={common.button}
        disabled={!write || isLoading}
        onClick={() => {
          write?.()
        }}
      >
        {isLoading ? <LoadingIcon /> : 'Commit'}
      </button>
      <h1>{receipt.status}</h1>
    </>
  )
}
