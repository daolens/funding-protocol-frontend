import Background from '@components/common/background'
import ClientOnly from '@components/common/client-only'
import Navbar from '@components/common/navbar'
import GrantList from '@components/workspace/details/grant-list'
import ProfileDetails from '@components/workspace/details/profile-details'
import Stats from '@components/workspace/details/stats'
import { GrantType } from '@lib/types/grants'
import { WorkspaceStatsType, WorkspaceType } from '@lib/types/workspace'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import React from 'react'
import { useAccount } from 'wagmi'

type Props = {
  workspace: WorkspaceType
  grants: GrantType[]
  stats: WorkspaceStatsType
}

const Index = ({ workspace, grants, stats }: Props) => {
  const { address } = useAccount()
  const isAdmin = workspace.adminAddresses?.includes(address as any)

  return (
    <ClientOnly>
      <Background isMaxWidthDisabled>
        <div className="px-5">
          <Navbar />
        </div>
        <div className="w-full">
          <Image
            src="/images/workspace/details/workspace-backdrop.svg"
            width={1440}
            height={146}
            className="w-full"
            alt="Community backdrop"
          />
        </div>
        <div className="grid grid-cols-3 max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto gap-6 my-5">
          <div className="col-span-2 flex flex-col">
            <ProfileDetails workspaceDetails={workspace} isAdmin={!!isAdmin} />
            <GrantList grants={grants} isAdmin={!!isAdmin} />
          </div>
          <Stats {...stats} />
        </div>
      </Background>
    </ClientOnly>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const { workspaceId } = query
  const { grants, workspace } = await fetchWorkspaceById(workspaceId as any)

  const stats: WorkspaceStatsType = {
    totalApplicants:
      grants
        .map((grant) => grant.applicantCount)
        .reduce((prev = 0, curr = 0) => prev + curr, 0) || 0,
    // TODO: update
    // totalGrantReceipients: 4,
  }

  const props: Props = {
    grants,
    stats,
    workspace,
  }
  return { props }
}

export default Index
