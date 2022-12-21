import GrantCard from '@components/workspace/details/grant-list/grant-card'
import GrantTabs from '@components/workspace/details/grant-list/tabs'
import { GrantType } from '@lib/types/grants'
import { GrantStatusType } from '@lib/types/workspace'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type Props = {
  grants: GrantType[]
  isAdmin: boolean
}

const GrantList = ({ grants, isAdmin }: Props) => {
  const router = useRouter()
  const workspaceId = router.query?.workspaceId as string
  const [selectedTab, setSelectedTab] = useState<GrantStatusType>('open')

  const filteredGrants = grants.filter((grant) => grant.status === selectedTab)

  return (
    <div className="flex flex-col gap-4">
      <GrantTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {isAdmin && (
        <Link
          href={`/workspaces/${workspaceId}/grants/create`}
          className="w-full text-center text-indigo-500 bg-indigo-800 hover:bg-indigo-600 hover:bg-opacity-20 bg-opacity-20 rounded-lg border-dashed border border-indigo-800 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          + Add new grant
        </Link>
      )}
      {filteredGrants.map((grant) => (
        <GrantCard key={grant.address} {...grant} />
      ))}
    </div>
  )
}

export default GrantList
