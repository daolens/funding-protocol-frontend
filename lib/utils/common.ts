import { DEFAULT_TOKENS } from '@lib/constants/common'
import { WalletAddressType } from '@lib/types/common'
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

export const getTokenSymbol = (tokenName: string) =>
  DEFAULT_TOKENS.find((currToken) => currToken.name === tokenName)?.symbol

export const getTruncatedWalletAddress = (address: WalletAddressType) =>
  address.slice(0, 4) + '...' + address.slice(-4)

// eslint-disable-next-line no-console
export const log = console.log

export const checkIsLink = (url: string) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
  const regex = new RegExp(expression)

  return url.match(regex)
}

export const checkIsEmail = (email: string) => {
  const expression =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
  const regex = new RegExp(expression)
  return email.match(regex)
}

export const addDays = (date: string | Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
