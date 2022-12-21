export type CommunityDetailsType = {
  image?: string
  communityName: string
  activeGrants: number
  treasuryAmount: number
  applicants: number
  sentInGrants: number
}

export type FilterType = 'all' | 'active' | 'expired'
