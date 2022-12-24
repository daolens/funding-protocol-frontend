import { IS_PROD } from '@lib/constants/common'
import { ContractType } from '@lib/types/contract'
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { mainnet, polygonMumbai } from 'wagmi/chains'

type CallSmartContractFunctionOptionsType = {
  contractObj: ContractType
  functionName: string
  args?: any[]
  overrides?: any
}

export const writeSmartContractFunction = async ({
  contractObj,
  functionName,
  args,
}: CallSmartContractFunctionOptionsType) => {
  const config = await prepareWriteContract({
    address: IS_PROD ? contractObj.address : contractObj.polygonMumbaiAddress,
    abi: contractObj.abi,
    functionName,
    args,
    chainId: IS_PROD ? mainnet.id : polygonMumbai.id,
  })

  const data = await writeContract(config)

  return data
}

export const readSmartContractFunction = async ({
  contractObj,
  args,
  functionName,
  overrides,
}: CallSmartContractFunctionOptionsType) => {
  const data = await readContract({
    address: IS_PROD ? contractObj.address : contractObj.polygonMumbaiAddress,
    abi: contractObj.abi,
    functionName,
    args,
    chainId: IS_PROD ? mainnet.id : polygonMumbai.id,
    overrides,
  })

  return data
}
