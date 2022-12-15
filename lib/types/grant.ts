import { PROPOSAL_GRANT_FORM_FIELDS } from '@lib/constants/grants'
import { DynamicInputItemType } from '@lib/types/common'

export type SelectionProcessType = 'community' | 'committee'

export type ProposalGrantFormFieldType =
  typeof PROPOSAL_GRANT_FORM_FIELDS[number]

export type GrantType = {
  title: string
  subTitle: string
  tags: string[]
  /** ISO date-time string */
  proposalDeadline: string
  maxGrantAmount: number
  grantAmountToken: string
  selectionProcess: SelectionProcessType
  milestones?: DynamicInputItemType[]
  proposalFormFields?: ProposalGrantFormFieldType[]
  customFields?: string[]
}
