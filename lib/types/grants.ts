import {
  APPLICATION_STATUSES,
  PROPOSAL_GRANT_FORM_FIELDS,
} from '@lib/constants/grants'
import { DynamicInputItemType, WalletAddressType } from '@lib/types/common'
import { GrantStatusType } from '@lib/types/workspace'

export type SelectionProcessType = 'community' | 'committee'
export type FundingMethodType = 'UPFRONT' | 'MILESTONE'

export type ProposalGrantFormFieldType =
  typeof PROPOSAL_GRANT_FORM_FIELDS[number]

export type GrantType = {
  id?: string
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
  status?: GrantStatusType
  applicantCount?: number
  approvedCount?: number
}

export type ApplicationMilestoneType = {
  id: string
  text: string
  funds: number | null
}

export type ApplicationStatusType = typeof APPLICATION_STATUSES[number]

export type ApplicationType = {
  id?: string
  name: string
  email: string
  walletAddress: WalletAddressType | ''
  description: string
  sneekingFunds: number | null
  /** ISO data string */
  expectedProjectDeadline: string
  links: DynamicInputItemType[]
  teamMemberDetails: DynamicInputItemType[]
  previousSuccessfulProposalLinks: DynamicInputItemType[]
  milestones: ApplicationMilestoneType[]
  status?: ApplicationStatusType
}

export type GrantTreasuryType = {
  total: number
  left: number
  token: string
}

export type GrantSectionType = 'about' | 'applications'
