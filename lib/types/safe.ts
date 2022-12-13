import { SupportedNetworkIdType } from "@lib/types/common"

export type SafeDetailsType = {
  address: string
  nonce: number
  threshold: number
  owners: string[]
  masterCopy: string
  modules: string[]
  fallbackHandler: string
  guard: string
  version: string
}

export type SupportedSafeInfotype = {
  name: string
  chainId: SupportedNetworkIdType
  rpcURL: string
}
