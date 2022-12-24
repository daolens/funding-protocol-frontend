import Input from '@components/common/input-with-trailing-icon'
import WorkspaceCardList from '@components/homepage/workspace-card'
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { WorkspaceCardType, FilterType } from '@lib/types/home'
import { useState } from 'react'
import { getFilteredCommunities } from '@lib/utils/home'
import classNames from 'classnames'
import Link from 'next/link'

type Props = {
  workspaceList: WorkspaceCardType[]
}

const Discover = ({ workspaceList }: Props) => {
  const [filterType, setFilterType] = useState<FilterType>('all')

  const [searchCommunity, setSearchCommunity] = useState('')

  const filteredCommunities = getFilteredCommunities(
    filterType,
    searchCommunity,
    workspaceList
  ) as WorkspaceCardType[]

  return (
    <section className="pt-16 pb-14 text-gray-300">
      <h2 className="text-2xl font-semibold text-decoration-line pb-8 underline decoration-pink-500 decoration-4">
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
            className="rounded-md w-80 h-8"
            onChange={(e) => setSearchCommunity(e.currentTarget.value)}
          />
          <div className="flex gap-1 items-center">
            <p
              className={classNames(
                'bg-gray-800 text-sm flex gap-2 justify-center cursor-pointer items-center h-fit py-1 px-3 rounded-2xl',
                {
                  'bg-indigo-900 bg-opacity-40 border border-indigo-900':
                    filterType === 'all',
                }
              )}
              onClick={() => setFilterType('all')}
            >
              <span className="text-xs">✨</span>
              <span>All</span>
            </p>
            <p
              className={classNames(
                'bg-gray-800 text-sm flex gap-2 justify-center cursor-pointer items-center h-fit py-1 px-3 rounded-2xl',
                {
                  'bg-indigo-900 bg-opacity-40 border border-indigo-900':
                    filterType === 'active',
                }
              )}
              onClick={() => setFilterType('active')}
            >
              <span className="text-xs">🟢 </span>
              <span>Active</span>
            </p>
            <p
              className={classNames(
                'bg-gray-800 text-sm flex gap-2 justify-center cursor-pointer items-center h-fit py-1 px-3 rounded-2xl',
                {
                  'bg-indigo-900 bg-opacity-40 border border-indigo-900':
                    filterType === 'expired',
                }
              )}
              onClick={() => setFilterType('expired')}
            >
              <span className="text-xs">🔴 </span>
              <span>Expired</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 ">
        <Link
          href="/workspaces/create"
          className="bg-indigo-800 hover:bg-indigo-700 hover:bg-opacity-20 bg-opacity-20 flex gap-2 items-center rounded-2xl col-span-2 p-5 mb-2 mt-6 border border-dashed border-indigo-500"
        >
          <PlusCircleIcon className="w-12 h-12 text-indigo-400 " />
          <p className="text-indigo-200 text-base text-center">
            List your community and reach out to thousands of builders 🚀
          </p>
        </Link>
        <WorkspaceCardList workspaceList={filteredCommunities} />
      </div>
    </section>
  )
}

export default Discover
