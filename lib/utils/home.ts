import { CommunityDetailsType, FilterType } from '@lib/types/home'

const getSearchedCommunities = (
  searchCommunity: string,
  discoverDetailsData?: CommunityDetailsType[]
) => {
  const communities = discoverDetailsData?.filter((comm) =>
    comm.communityName
      .toLowerCase()
      .includes(searchCommunity.toLowerCase().trim())
  )
  return communities
}

const getFilteredData = (
  filterType?: string,
  searchedCommunities?: CommunityDetailsType[]
) => {
  const communities = searchedCommunities?.filter((comm) => {
    if (filterType === 'expired') {
      return comm.activeGrants < 1
    } else if (filterType === 'active') {
      return comm.activeGrants > 1
    } else {
      return comm
    }
  })
  return communities
}

export const getFilteredCommunities = (
  filterType: FilterType,
  searchCommunity: string,
  discoverDetailsData?: CommunityDetailsType[]
) => {
  const searchedCommunities = getSearchedCommunities(
    searchCommunity,
    discoverDetailsData
  )

  const filteredData = getFilteredData(filterType, searchedCommunities)

  return filteredData
}
