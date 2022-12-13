import { SupportedNetworkIdType } from '@lib/types/common'

export type WorkspaceType = {
  communityName: string
  multisigAddress: string
  network: SupportedNetworkIdType
}

export type CreateWorkspaceStepType = 'name' | 'source-of-funding' | 'success'
