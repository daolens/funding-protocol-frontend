import { WORKSPACE_STEPS } from '@lib/constants/workspace'
import { SupportedNetworkIdType } from '@lib/types/common'

export type WorkspaceType = {
  communityName: string
  multisigAddress: string
  network: SupportedNetworkIdType
}

export type CreateWorkspaceStepType = typeof WORKSPACE_STEPS[number]
