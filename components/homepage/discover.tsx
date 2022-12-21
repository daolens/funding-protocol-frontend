import Input from '@components/common/input-with-trailing-icon'
import CommunityCard from './community-card'

import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { CommunityDetailsType } from '@lib/types/home'
import { useState } from 'react'

type Props = {
  discoverDetailsData: CommunityDetailsType[]
}

const DiscoverApply = ({ discoverDetailsData }: Props) => {

 const [filterType, setFilterType] = useState("")

 const [searchCommunity, setSearchCommunity] = useState("")

  return (
    <section className="pt-16 text-gray-300">
      <h2 className="text-2xl font-semibold text-decoration-line pb-8">
        🔍 Discovery & Apply
      </h2>
      <div className="flex text-sm gap-2 ">
        <div className="flex gap-4">
          <Input
            placeholder="Search"
            leadingIcon={
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 " />
            }
            isLeadingIconShown={true}
            className="rounded-none w-[20rem] py-2 px-3"
            onChange={(e) => setSearchCommunity(e.target.value)}
          />
          <div className="flex gap-1 items-center">
            <p className="bg-gray-800 text-sm flex gap-2 justify-center items-center h-fit py-1 px-3 rounded-2xl" onClick={() => setFilterType("all")}>
              <span className="text-xs">✨</span>
              <span>All</span>
            </p>
            <p className="bg-gray-800 text-sm flex gap-2 justify-center items-center h-fit py-1 px-3 rounded-2xl" onClick={() => setFilterType("active")}>
              <span className="text-xs">🟢 </span>
              <span>Active</span>
            </p>
            <p className="bg-gray-800 text-sm flex gap-2 justify-center items-center h-fit py-1 px-3 rounded-2xl" onClick={() => setFilterType("expired")}>
              <span className="text-xs">🔴 </span>
              <span>Expired</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 ">
        <div className="bg-indigo-800 bg-opacity-20 flex gap-2 items-center rounded-2xl col-span-2 p-5 mb-2 mt-6">
          <PlusCircleIcon className="w-12 h-12 " />
          <p className="text-indigo-200 text-base text-center">
            List your community and reach out to thousands of builders 🚀
          </p>
        </div>
        <CommunityCard communityDetailsData={discoverDetailsData} />
      </div>
    </section>
  )
}

export default DiscoverApply
