import GrantCard from '@components/workspace/details/grant-list/grant-card'
import GrantTabs from '@components/workspace/details/grant-list/tabs'
import { GrantType } from '@lib/types/grants'
import { GrantStatusType } from '@lib/types/workspace'
import React, { useState } from 'react'

type Props = {
  grants: GrantType[]
  isAdmin: boolean
}

const GrantList = ({ grants, isAdmin }: Props) => {
  const [selectedTab, setSelectedTab] = useState<GrantStatusType>('open')
  const onAddNewGrant = () => {
    // TODO: handle this
  }

  const filteredGrants = grants.filter((grant) => grant.status === selectedTab)

  return (
    <div className="flex flex-col gap-4">
      <GrantTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {isAdmin && (
        <button
          className="w-full text-indigo-500 bg-indigo-800 hover:bg-indigo-600 hover:bg-opacity-20 bg-opacity-20 rounded-lg border-dashed border border-indigo-800 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={onAddNewGrant}
        >
          + Add new grant
        </button>
      )}
      {filteredGrants.map((grant) => (
        <GrantCard key={grant.id} {...grant} />
      ))}
    </div>
  )
}

export default GrantList
