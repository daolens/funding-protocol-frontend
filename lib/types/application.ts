import { MILESTONE_STATUSES } from '@lib/constants/application'

export type ApplicationSectionType = 'milestone-reporting' | 'application'

export type MilestoneStatusType = typeof MILESTONE_STATUSES[number]
