import { CONTRACT_NAMES } from '@lib/constants/contract'

export type ContractType = {
  address: string
  abi: any
  goerliAddress?: string
  polygonMumbaiAddress: string
  polygonAddress: string
}

export type ContractNameType = typeof CONTRACT_NAMES[number]
