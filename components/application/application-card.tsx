import CommunityAvatar from '@components/common/community-avatar'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { ApplicationType } from '@lib/types/grants'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

type PillProps = {
  state: 'Active' | 'Completed' | 'Failed' | 'Upcoming'
  label: string
  isLastPill?: boolean
}

const Pill = ({ label, state, isLastPill = false }: PillProps) => (
  <div className="flex items-center">
    <div
      className={classNames(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 bg-opacity-20 border',
        {
          'border-indigo-500': state === 'Active',
          'border-gray-800': state !== 'Active',
        }
      )}
    >
      {state === 'Upcoming' && (
        <span className="w-2 h-2 border border-gray-800 rounded-full" />
      )}
      {state === 'Active' && (
        <span className="w-2 h-2 bg-indigo-500 rounded-full" />
      )}
      {state === 'Completed' && (
        <CheckCircleIcon className="w-4 h-4 text-green-500" />
      )}
      {state === 'Failed' && <XCircleIcon className="w-4 h-4 text-red-500" />}
      <span className="text-xs whitespace-nowrap">{label}</span>
    </div>
    {!isLastPill && <div className="w-4 border border-gray-800 bg-gray-800" />}
  </div>
)

type Props = {
  application: ApplicationType
}

/** Applicant facing */
const ApplicationCard = ({ application }: Props) => {
  const router = useRouter()
  const chainId = router.query.chainId as string
  // TODO: subtract 3 days from this
  const reviewTimeString = application.revertDeadline
    ? new Date(application.revertDeadline).toDateString()
    : ''
  const workspaceId = application.workspaceId
  const grantAddress = application.grantAddress
  return (
    <Link
      href={`/${chainId}/workspaces/${workspaceId}/grants/${grantAddress}/applications/${application.id}`}
      className="p-5 bg-gray-800 bg-opacity-20 border border-gray-800 flex flex-col rounded-xl gap-5 hover:border-indigo-500"
    >
      <div className="flex gap-4 items-center">
        {application.workspaceTitle && (
          <CommunityAvatar communityName={application.workspaceTitle} />
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">{application.grantTitle}</h3>
          <p className="text-gray-500">by {application.workspaceTitle}</p>
        </div>
      </div>
      <div className="flex flex-nowrap items-center overflow-x-auto max-w-xs md:max-w-lg lg:max-w-4xl scrollbar-thin scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600 scrollbar-thumb-rounded-full pb-3">
        <Pill
          label={`Submitted on ${new Date(
            application.submissionTimestamp
          ).toDateString()}`}
          state="Completed"
        />
        <Pill
          label="In Review"
          state={
            application.status === 'Submitted' ||
            application.status === 'Resubmit' ||
            application.status === 'RejectPending' ||
            application.status === 'ApprovePending'
              ? 'Active'
              : 'Completed'
          }
        />
        {(application.status === 'Submitted' ||
          application.status === 'Resubmit' ||
          application.status === 'RejectPending' ||
          application.status === 'ApprovePending') && (
          <Pill label="Results" state="Upcoming" isLastPill />
        )}

        {application.status === 'Rejected' && (
          <Pill
            label={
              reviewTimeString ? `Rejected on ${reviewTimeString}` : 'Rejected'
            }
            state="Failed"
            isLastPill
          />
        )}

        {application.status === 'Approved' && (
          <Pill
            label={
              reviewTimeString ? `Accepted on ${reviewTimeString}` : 'Accepted'
            }
            state="Completed"
            isLastPill={application.fundingMethod === 'UPFRONT'}
          />
        )}

        {application.status === 'Approved' &&
          application.fundingMethod === 'MILESTONE' &&
          application.milestones.map((milestone, index) => (
            <Pill
              key={milestone.id}
              label={`Milestone ${index + 1}`}
              state={
                index + 1 <= (application.completedMilestoneCount as number)
                  ? 'Completed'
                  : index === application.completedMilestoneCount
                  ? 'Active'
                  : 'Upcoming'
              }
              isLastPill={index === application.milestones.length - 1}
            />
          ))}
      </div>
    </Link>
  )
}

export default ApplicationCard
