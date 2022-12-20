import { WORKSPACE_STEPS } from '@lib/constants/workspace'
import { SupportedNetworkIdType, WalletAddressType } from '@lib/types/common'

export type WorkspaceType = {
  communityName: string
  multisigAddress: string
  network: SupportedNetworkIdType
  description?: string
  website?: string
  discord?: string
  twitter?: string
  adminAddresses?: WalletAddressType[]
}

export type CreateWorkspaceStepType = typeof WORKSPACE_STEPS[number]

export type WorkspaceStatsType = {
  totalGrantReceipients: number
  totalApplicants: number
}

export type GrantStatusType = 'open' | 'close'
