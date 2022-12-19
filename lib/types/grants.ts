import { PROPOSAL_GRANT_FORM_FIELDS } from '@lib/constants/grants'
import { DynamicInputItemType, WalletAddressType } from '@lib/types/common'

export type SelectionProcessType = 'community' | 'committee'
export type FundingMethodType = 'UPFRONT' | 'MILESTONE'

export type ProposalGrantFormFieldType =
  typeof PROPOSAL_GRANT_FORM_FIELDS[number]

export type GrantType = {
  title: string
  subTitle: string
  /** ISO date-time string */
  proposalDeadline: string
  tags?: string[]
  token: string
  treasuryAmount: number
  selectionProcess: SelectionProcessType
  fundingMethod: FundingMethodType
  reviewers: WalletAddressType[]
  milestones?: DynamicInputItemType[]
  proposalFormFields?: ProposalGrantFormFieldType[]
  customFields?: DynamicInputItemType[]
}
