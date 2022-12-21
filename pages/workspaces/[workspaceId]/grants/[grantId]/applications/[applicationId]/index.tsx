import Description from '@components/application/description'
import ReviewButtons from '@components/application/review-buttons'
import SideInfoBar from '@components/application/side-info-bar'
import TeamMembers from '@components/application/team-members'
import BackButton from '@components/common/back-button'
import Background from '@components/common/background'
import { AtSymbolIcon } from '@heroicons/react/24/outline'
import { ApplicationStatusType, ApplicationType } from '@lib/types/grants'
import { getTruncatedWalletAddress } from '@lib/utils/common'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { useEnsName } from 'wagmi'

type Props = {
  application: ApplicationType
  isReviewer: boolean
}

const ApplicationDetails = ({ application, isReviewer }: Props) => {
  const router = useRouter()
  const { data: enaName } = useEnsName({
    address: application.walletAddress as any,
  })

  const workspaceId = router.query.workspaceId as string
  const grantId = router.query.grantId as string

  return (
    <Background>
      <div className="py-6 flex flex-col gap-3">
        <BackButton
          onBack={() =>
            router.push(`/workspaces/${workspaceId}/grants/${grantId}`)
          }
        />
        <h1 className="text-2xl font-bold">{application.name}</h1>
        <div className="flex text-gray-500 items-center gap-2 text-sm">
          <span className="text-indigo-500">
            by{' '}
            {enaName ||
              getTruncatedWalletAddress(application.walletAddress as any)}
          </span>
          <span>|</span>
          <div className="flex items-center gap-1">
            <AtSymbolIcon className="w-5 h-5" />
            <a href={`mailto:${application.email}`} className="hover:underline">
              {application.email}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 flex flex-col gap-5">
            <TeamMembers teamMembers={application.teamMemberDetails} />
            <Description
              description={application.description}
              links={application.links}
              pastProposals={application.previousSuccessfulProposalLinks}
            />
          </div>
          <div className="flex flex-col gap-5">
            {isReviewer && (
              <ReviewButtons
                status={application.status as ApplicationStatusType}
              />
            )}
            <SideInfoBar
              deadline={application.expectedProjectDeadline}
              milestones={application.milestones}
              seekingFunds={application.sneekingFunds as number}
            />
          </div>
        </div>
      </div>
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  // TODO: update
  const application: ApplicationType = {
    id: '1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    email: 'vandan@daolens.com',
    expectedProjectDeadline: '2023-01-06T00:00:00.000Z',
    links: [
      {
        id: 'v3C2nZMsQGvnvoSy_JAUm',
        text: 'www.google.com',
      },
      {
        id: 'DDo7rcyVpJvWqMcp0_NRV',
        text: 'www.google.com',
      },
    ],
    milestones: [
      {
        id: 'r4Yza9n9ZmmHFTKBP6LKO',
        funds: 100,
        text: 'Design',
      },
      {
        id: '6Cwv_kxHO1tyNdH2OOYbC',
        text: 'Dev',
        funds: 100,
      },
      {
        id: 'j5rURU1Y5W8P5nEUoungH',
        text: 'Release',
        funds: 100,
      },
    ],
    name: 'Amazing Grant Proposal - Project 04 (seriously amazing, totally worth $50,000)',
    previousSuccessfulProposalLinks: [
      {
        id: 'sxWOLLwozKzWFYC2GD5YM',
        text: 'www.google.com',
      },
    ],
    sneekingFunds: 100000,
    teamMemberDetails: [
      {
        id: '9GVcxKSHkzyLg-kBZb8VR',
        text: 'Vandan',
      },
      {
        id: 'qVeKEOmFdqFICqFVCaH9E',
        text: 'Chandan',
      },
    ],
    walletAddress: '0x3512345234',
    status: 'Under review',
  }

  return { props: { application, isReviewer: true } as Props }
}

export default ApplicationDetails
