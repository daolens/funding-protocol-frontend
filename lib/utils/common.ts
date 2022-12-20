import { ContractType } from '@lib/types/contract'
import { writeSmartContractFunction } from '@lib/utils/contract'
import { uploadToIPFS } from '@lib/utils/ipfs'

type WriteDataOptionsType = {
  data: string
  contractObj: ContractType
  contractFunction: string
  contractFunctionArgs: any[]
}

export const writeData = async ({
  contractFunction,
  contractFunctionArgs,
  contractObj: contractObj,
  data,
}: WriteDataOptionsType) => {
  const ipfsHash = (await uploadToIPFS(data)).hash
  const result = await writeSmartContractFunction({
    contractObj,
    args: [ipfsHash, ...contractFunctionArgs],
    functionName: contractFunction,
  })

  return result
}

export const getNumberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
