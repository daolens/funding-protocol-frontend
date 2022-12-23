import ApplicationCard from '@components/application/application-card'
import Background from '@components/common/background'
import Navbar from '@components/common/navbar'
import { ApplicationType } from '@lib/types/grants'
import { GetServerSideProps } from 'next'
import React from 'react'

type Props = {
  applications: ApplicationType[]
}

const MyProposals = ({ applications }: Props) => {
  return (
    <Background>
      <Navbar />
      <div className="flex flex-col gap-9 py-11 max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold">My proposals</h1>
        <div className="grid gap-5">
          {applications.map((application) => (
            <ApplicationCard application={application} key={application.id} />
          ))}
        </div>
      </div>
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
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
      seekingFunds: 100000,
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
      status: 'Submitted',
      reviewer: ['0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A'],
      owner: '0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A',
      reviewTimestamp: '2022-12-19T17:39:09.109Z',
      submissionTimestamp: '2022-12-18T17:39:09.109Z',
      workspaceTitle: 'Aave grant DAO',
      grantTitle: 'Do good season 2',
    },
    {
      workspaceTitle: 'Polygon village',
      grantTitle: "We have lot of money (but we don't give any)",
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
        {
          id: 'j5rURU1Y5W8P5nEUoungH',
          text: 'Release',
          funds: 100,
        },
        {
          id: 'j5rURU1Y5W8P5nEUoungH',
          text: 'Release',
          funds: 100,
        },
        {
          id: 'j5rURU1Y5W8P5nEUoungH',
          text: 'Release',
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
      seekingFunds: 100000,
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
      status: 'Approved',
      reviewer: ['0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A'],
      owner: '0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A',
      reviewTimestamp: '2022-12-19T17:39:09.109Z',
      completedMilestoneCount: 1,
      submissionTimestamp: '2022-12-18T17:39:09.109Z',
      fundingMethod: 'MILESTONE',
    },
  ]

  const props: Props = {
    applications,
  }

  return { props }
}

export default MyProposals
