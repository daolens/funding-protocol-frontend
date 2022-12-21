import {CommunityDetailsType} from "@lib/types/home"

const getSearchedProducts = (searchCommunity ?:string, discoverDetailsData?: CommunityDetailsType[]) => {
    const communities = discoverDetailsData?.filter(comm =>
		comm.communityName.toLowerCase().includes(searchCommunity.toLowerCase().trim())
	)
    return communities
}

const getFilteredProducts = (filterType?: string, searchedProducts?:CommunityDetailsType[]) => {
    const communities = searchedProducts?.filter(comm => {
        if(filterType === "expired"){
            return comm.activeGrants < 1
        }else if(filterType === "active"){
            return comm.activeGrants > 1
        }else{
            return comm
        }
    })
    return communities
}


export const getFilteredCommunities = (filterType?:string, searchCommunity?:string, discoverDetailsData?: CommunityDetailsType[]) => {

    const searchedProducts = getSearchedProducts(searchCommunity, discoverDetailsData)

    const filteredData = getFilteredProducts(filterType, searchedProducts)

    return filteredData
}