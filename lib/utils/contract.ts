import { CONTRACTS } from '@lib/constants/contract'
import { ContractNameType, ContractType } from '@lib/types/contract'
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { mainnet, polygon } from 'wagmi/chains'

type CallSmartContractFunctionOptionsType = {
  contractObj: ContractType
  functionName: string
  args?: any[]
  overrides?: any
  chainId: number
}

export const writeSmartContractFunction = async ({
  contractObj,
  functionName,
  args,
  chainId,
}: CallSmartContractFunctionOptionsType) => {
  const address =
    chainId === polygon.id
      ? contractObj.polygonAddress
      : chainId === mainnet.id
      ? contractObj.address
      : contractObj.polygonMumbaiAddress
  const config = await prepareWriteContract({
    address,
    abi: contractObj.abi,
    functionName,
    args,
    chainId,
  })

  const data = await writeContract(config)

  return data
}

export const readSmartContractFunction = async ({
  contractObj,
  args,
  functionName,
  overrides,
  chainId,
}: CallSmartContractFunctionOptionsType) => {
  const address =
    chainId === polygon.id
      ? contractObj.polygonAddress
      : chainId === mainnet.id
      ? contractObj.address
      : contractObj.polygonMumbaiAddress
  const data = await readContract({
    address,
    abi: contractObj.abi,
    functionName,
    args,
    chainId,
    overrides,
  })

  return data
}

export const getContractAddressByNetwork = (
  contractName: ContractNameType,
  chainId: number
) => {
  const contract = CONTRACTS[contractName]

  switch (chainId) {
    case polygon.id:
      return contract.polygonAddress
    case mainnet.id:
      return contract.address
    default:
      return contract.polygonMumbaiAddress
  }
}
