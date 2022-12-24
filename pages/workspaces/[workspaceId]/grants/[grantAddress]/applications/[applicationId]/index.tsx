import Description from '@components/application/description'
import MilestoneReporting from '@components/application/milestone-reporting'
import ReviewButtons from '@components/application/review-buttons'
import ApplicationSectionTabs from '@components/application/section-tabs'
import SideInfoBar from '@components/application/side-info-bar'
import TeamMembers from '@components/application/team-members'
import BackButton from '@components/common/back-button'
import Background from '@components/common/background'
import Navbar from '@components/common/navbar'
import { AtSymbolIcon } from '@heroicons/react/24/outline'
import { ApplicationSectionType } from '@lib/types/application'
import {
  ApplicationStatusType,
  ApplicationType,
  GrantType,
} from '@lib/types/grants'
import { WorkspaceType } from '@lib/types/workspace'
import { fetchApplicationById } from '@lib/utils/application'
import { addDays, getTruncatedWalletAddress } from '@lib/utils/common'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useAccount, useEnsName } from 'wagmi'

type Props = {
  application: ApplicationType
  grant: GrantType
  workspace: WorkspaceType
  isInsufficientBalance: boolean
}

const ApplicationDetails = ({
  application,
  isInsufficientBalance,
  grant,
  workspace,
}: Props) => {
  const { address } = useAccount()
  const { data: enaName } = useEnsName({
    address: application.owner as any,
  })
  const router = useRouter()

  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress as string

  const grantBalance = grant.balance
  const grantBalanceToken = grant.token
  const grantFundingMethod = grant.fundingMethod
  const isAdmin = workspace.owner === address
  const isReviewer = grant.reviewers.includes(address || '0x')
  const isApplicant = application.owner === address

  const isApproved =
    application.status === 'Approved' &&
    new Date() >= addDays(application.reviewTimestamp as string, 3)

  const [activeSection, setActiveSection] = useState<ApplicationSectionType>(
    isApproved && grantFundingMethod === 'MILESTONE'
      ? 'milestone-reporting'
      : 'application'
  )

  return (
    <Background>
      <Navbar />
      <div className="py-6 flex flex-col gap-3">
        <BackButton
          onBack={() =>
            router.push(`/workspaces/${workspaceId}/grants/${grantAddress}`)
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
        {isApproved && (
          <ApplicationSectionTabs
            selectedTab={activeSection}
            setSelectedTab={setActiveSection}
          />
        )}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 flex flex-col gap-5">
            {activeSection === 'application' && (
              <>
                <TeamMembers teamMembers={application.teamMemberDetails} />
                <Description
                  description={application.description}
                  links={application.links}
                  pastProposals={application.previousSuccessfulProposalLinks}
                />
              </>
            )}
            {activeSection === 'milestone-reporting' && (
              <MilestoneReporting
                milestones={application.milestones}
                completedMilestoneCount={application.completedMilestoneCount}
                isReviewer={isReviewer}
                isApplicant={isApplicant}
              />
            )}
          </div>
          <div className="flex flex-col gap-5">
            <ReviewButtons
              status={application.status as ApplicationStatusType}
              grantBalance={grantBalance || 0}
              isAdmin={isAdmin}
              isInsufficientBalance={isInsufficientBalance}
              token={grantBalanceToken}
              reviewers={application.reviewer}
              isReviewer={isReviewer}
              reviewTimestamp={application.reviewTimestamp}
            />
            <SideInfoBar
              deadline={application.expectedProjectDeadline}
              milestones={application.milestones}
              seekingFunds={application.seekingFunds as number}
            />
          </div>
        </div>
      </div>
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const applicationId = query.applicationId as `0x${string}`
  const { workspaceId, grantAddress } = query

  const { grants, workspace } = await fetchWorkspaceById(workspaceId as any)
  const grant = grants.find((grant) => grant.address === grantAddress)

  const application = await fetchApplicationById(applicationId)

  if (!grant || !workspace || !application)
    return {
      notFound: true,
    }

  const props: Props = {
    application,
    grant,
    workspace,
    // TODO: convert grant balance to USD and compare with seeking amount
    isInsufficientBalance: false,
  }

  return {
    props,
  }
}

export default ApplicationDetails
