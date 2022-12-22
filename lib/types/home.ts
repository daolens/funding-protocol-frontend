import { WalletAddressType } from "@lib/types/common"

export type WorkspaceCardType = {
  id: string
  image?: string
  communityName: string
  activeGrants: number
  treasuryAmount: number
  applicants: number
  sentInGrants: number
  owner: WalletAddressType
}

export type FilterType = 'all' | 'active' | 'expired'
