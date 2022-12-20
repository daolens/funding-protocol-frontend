import BackButton from '@components/common/back-button'
import Background from '@components/common/background'
import Funds from '@components/grants/details/funds'
import Info from '@components/grants/details/info'
import Sections from '@components/grants/details/sections'
import Stats from '@components/grants/details/stats'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import {
  ApplicationType,
  GrantTreasuryType,
  GrantType,
} from '@lib/types/grants'
import React from 'react'

type Props = {
  grant: GrantType
  workspaceName: string
  treasury: GrantTreasuryType
  isAdmin: boolean
  applications: ApplicationType[]
}

const GrantDetails = ({
  grant,
  treasury,
  workspaceName,
  isAdmin,
  applications,
}: Props) => {
  const onBack = () => {
    // TODO: handle
  }

  const onApply = () => {
    // TODO: handle
  }

  return (
    <Background>
      <div className="py-6 flex flex-col gap-3">
        <BackButton onBack={onBack} />
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <Info
              grant={grant}
              isAdmin={isAdmin}
              workspaceName={workspaceName}
            />
            <Sections
              applications={applications}
              description={grant.subTitle}
            />
          </div>
          <div className="flex flex-col gap-5">
            <Funds isAdmin={isAdmin} treasury={treasury} />
            <Stats
              applicantCount={grant.applicantCount as number}
              approvedCount={grant.approvedCount as number}
            />
            <button
              type="button"
              onClick={onApply}
              className="inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 justify-center"
            >
              Apply for Grant
              <ArrowRightIcon
                className="ml-3 -mr-1 h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </Background>
  )
}

export const getServerSideProps = async () => {
  const grant: GrantType = {
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
    approvedCount: 4,
  }

  const workspaceName = 'Swap Grants'

  const treasury: GrantTreasuryType = {
    left: 800,
    token: 'Aave',
    total: 1000,
  }

  const applications: ApplicationType[] = [
    {
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
    },
    {
      id: '2',
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
      status: 'Accepted',
    },
    {
      id: '3',
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
      status: 'Rejected',
    },
  ]

  const props: Props = {
    grant,
    workspaceName,
    treasury,
    isAdmin: true,
    applications,
  }

  return { props }
}

export default GrantDetails
