import { ApplicationStatusType } from '@lib/types/grants'

export const PROPOSAL_GRANT_FORM_FIELDS = [
  'Name',
  'Email',
  'Funding',
  'Proposal Link',
  'Project goals',
  'Team details',
  'Usage of Grant',
  'Wallet address',
] as const

export const APPLICATION_STATUSES = [
  'Under review',
  'Accepted',
  'Rejected',
] as const

export const APPLICATION_STATUS_OBJ: Record<
  ApplicationStatusType,
  { color: 'yellow' | 'cyan' | 'red' }
> = {
  'Under review': { color: 'yellow' },
  Accepted: { color: 'cyan' },
  Rejected: { color: 'red' },
}
