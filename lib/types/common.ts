import { SUPPORTED_SAFE_IDS } from '@lib/constants/common'

export type SupportedNetworkIdType = typeof SUPPORTED_SAFE_IDS[number]

export type TokenType = {
  id: string
  name: string
  chain: 'Ethereum' | 'Polygon'
  image: string
  address: `0x${string}`
}

export type DynamicInputItemType = {
  id: string
  text: string
}

export type WalletAddressType = `0x${string}`