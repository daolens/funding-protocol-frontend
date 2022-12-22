import { WorkspaceCardListType, FilterType } from '@lib/types/home'

const getSearchedCommunities = (
  searchCommunity: string,
  discoverDetailsData?: WorkspaceCardListType[]
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
  searchedCommunities?: WorkspaceCardListType[]
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
  discoverDetailsData?: WorkspaceCardListType[]
) => {
  const searchedCommunities = getSearchedCommunities(
    searchCommunity,
    discoverDetailsData
  )

  const filteredData = getFilteredData(filterType, searchedCommunities)

  return filteredData
}
