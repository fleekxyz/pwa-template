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
} from 'wagmi'
import { makeCommitment, randomSecret } from '@ensdomains/ensjs/utils'
import { LoadingIcon } from '../LoadingIcon'

import common from '../../common.module.css'
import styles from './TransactionSubmit.module.css'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'

const ONE_YEAR = 365 * 24 * 60 * 60

export const TransactionSubmit = () => {
  const router = useRouter()
  const [name, setName] = useState('')

  const { wallet } = usePrivyWagmi()

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

  const [commitmentHash, setCommitmentHash] = useState<Hash>('0x')

  useEffect(() => {
    if (name && wallet && wallet.address) {
      setCommitmentHash(
        makeCommitment({
          name: `${name}.eth`,
          owner: wallet.address as Address,
          duration: 0,
          secret: randomSecret(),
        }),
      )
    } else setCommitmentHash('0x')
  }, [name, wallet])

  const [contractGas, setContractGas] = useState(0n)

  const client = usePublicClient()

  useEffect(() => {
    if (wallet && commitmentHash !== '0x')
      client
        .estimateContractGas({
          ...ethEnsRegistrar,
          functionName: 'commit',
          args: [commitmentHash],
          account: wallet.address as Address,
        })
        .then((gas) => {
          setContractGas(gas)
        })
  }, [commitmentHash, wallet])

  const { config } = usePrepareContractWrite({
    ...ethEnsRegistrar,
    functionName: 'commit',
    args: [commitmentHash],
    enabled: commitmentHash !== '0x' && !wallet,
  })

  const { write, isLoading, error } = useContractWrite(config)

  const { data: feeData, isLoading: isFeeDataLoading } = useFeeData()

  const gasCostInEth = isFeeDataLoading
    ? 0n
    : (feeData?.maxFeePerGas! + feeData?.maxPriorityFeePerGas!) * contractGas

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
