import Background from '@components/common/background'
import GrantList from '@components/workspace/details/grant-list'
import ProfileDetails from '@components/workspace/details/profile-details'
import Stats from '@components/workspace/details/stats'
import { GrantType } from '@lib/types/grants'
import { WorkspaceStatsType, WorkspaceType } from '@lib/types/workspace'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import React from 'react'
import { useAccount } from 'wagmi'

type Props = {
  workspaceDetails: WorkspaceType
  grants: GrantType[]
  stats: WorkspaceStatsType
}

const Index = ({ workspaceDetails, grants, stats }: Props) => {
  const { address } = useAccount()
  const isAdmin = workspaceDetails.adminAddresses?.includes(address as any)

  return (
    <Background isMaxWidthDisabled>
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
          <ProfileDetails
            workspaceDetails={workspaceDetails}
            isAdmin={!!isAdmin}
          />
          <GrantList grants={grants} isAdmin={!!isAdmin} />
        </div>
        <Stats {...stats} />
      </div>
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  // TODO: replace with data fetching
  const workspaceDetails: WorkspaceType = {
    communityName: 'Aave Grants',
    multisigAddress: '0x2',
    network: 1,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id est vehicula, blandit ligula in, pellentesque ante. Sed nec diam nec mauris venenatis egestas vel ultricies ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus est, auctor efficitur vestibulum et, sodales nec ex. Mauris interdum congue aliquam. Fusce porttitor tincidunt arcu eget molestie. Vivamus non blandit massa. Donec efficitur, enim sit amet pretium laoreet, ante dui sollicitudin ipsum, eu elementum lectus neque ac massa. Maecenas in orci commodo, posuere massa eu, semper mi. Donec pretium velit dui, non mattis tellus pulvinar sed. Fusce vel est ornare lacus aliquam cursus vitae quis sem. Fusce posuere posuere massa sit amet viverra. Nullam elementum purus sed libero porta finibus. Sed quis aliquet quam. Quisque faucibus lorem enim, nec pharetra ligula faucibus non.',
    discord: 'https://www.google.com',
    twitter: 'https://www.google.com',
    website: 'https://daolens.com',
    adminAddresses: ['0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A'],
  }

  const grants: GrantType[] = [
    {
      status: 'open',
      title: 'Uniswap Grants - Season 02',
      subTitle:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id est vehicula, blandit ligula in, pellentesque ante. Sed nec diam nec mauris venenatis egestas vel ultricies ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus est, auctor efficitur vestibulum et, sodales nec ex.',
      tags: ['💰 DeFi', '🌱 Ecosystem'],
      proposalDeadline: '2023-01-31T00:00:00.000Z',
      fundingMethod: 'UPFRONT',
      selectionProcess: 'committee',
      treasuryAmount: 5,
      token: 'Aave',
      reviewers: [
        '0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A',
        '0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A',
      ],
      applicantCount: 412,
    },
    {
      status: 'open',
      title: 'Uniswap Grants - Season 01',
      subTitle:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id est vehicula, blandit ligula in, pellentesque ante. Sed nec diam nec mauris venenatis egestas vel ultricies ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus est, auctor efficitur vestibulum et, sodales nec ex.',
      tags: ['👥 Social'],
      proposalDeadline: '2022-12-28T00:00:00.000Z',
      fundingMethod: 'MILESTONE',
      selectionProcess: 'committee',
      treasuryAmount: 59082374,
      token: 'Aave',
      reviewers: [
        '0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A',
        '0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A',
      ],
      applicantCount: 100,
    },
  ]

  const stats: WorkspaceStatsType = {
    totalApplicants: 185,
    totalGrantReceipients: 4,
  }

  const props: Props = {
    grants,
    stats,
    workspaceDetails,
  }
  return { props }
}

export default Index
