'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ensClient, ethEnsRegistrar } from '../../lib/ens'
import { BaseError, UserRejectedRequestError, formatEther } from 'viem'
import {
  useAccount,
  useFeeData,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
} from 'wagmi'
import { makeCommitment, randomSecret } from '@ensdomains/ensjs/utils'
import { LoadingIcon } from '../LoadingIcon'

import common from '../../common.module.css'
import styles from './TransactionSubmit.module.css'

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
  const { data, isLoading: isFeeDataLoading } = useFeeData()

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

  const gasCostInEth = useMemo<bigint>(
    () =>
      isFeeDataLoading
        ? 0n
        : (data?.maxFeePerGas! + data?.maxPriorityFeePerGas!) * contractGas,
    [isFeeDataLoading, contractGas],
  )

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
    </>
  )
}
