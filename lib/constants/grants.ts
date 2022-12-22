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
  'Submitted',
  'Resubmit',
  'Approved',
  'Rejected',
  'Complete',
] as const

export const APPLICATION_STATUS_OBJ: Record<
  ApplicationStatusType,
  { color: 'yellow' | 'cyan' | 'red' | 'green'; label: string }
> = {
  Submitted: { color: 'yellow', label: 'Under review' },
  Resubmit: { color: 'yellow', label: 'Under review' },
  Approved: { color: 'cyan', label: 'Accepted' },
  Rejected: { color: 'red', label: 'Rejected' },
  Complete: { color: 'green', label: 'Complete' },
}
