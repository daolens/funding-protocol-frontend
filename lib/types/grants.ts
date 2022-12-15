import { PROPOSAL_GRANT_FORM_FIELDS } from '@lib/constants/grants'
import { DynamicInputItemType } from '@lib/types/common'

export type SelectionProcessType = 'community' | 'committee'

export type ProposalGrantFormFieldType =
  typeof PROPOSAL_GRANT_FORM_FIELDS[number]

export type GrantType = {
  title: string
  subTitle: string
  /** ISO date-time string */
  proposalDeadline: string
  treasuryAmount: number
  selectionProcess: SelectionProcessType
  milestones?: DynamicInputItemType[]
  proposalFormFields?: ProposalGrantFormFieldType[]
  customFields?: DynamicInputItemType[]
}
