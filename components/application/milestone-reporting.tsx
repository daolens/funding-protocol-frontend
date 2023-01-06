import FeedbackModal from '@components/application/feedback-modal'
import AlertModal from '@components/common/alert-modal'
import { CheckCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid'
import { ApplicationMilestoneType } from '@lib/types/grants'
import { approveMilestoneSC } from '@lib/utils/application'
import classNames from 'classnames'
import cogoToast, { CTReturn } from 'cogo-toast'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useMutation } from 'wagmi'

type MilestoneCardProps = {
  milestone: ApplicationMilestoneType
  state: 'completed' | 'ongoing' | 'upcoming'
  onClick: () => void
  areDetailsShown: boolean
  isReviewer: boolean
  onApprove?: () => void
  onSendFeedback?: () => void
  index: number
}

const MilestoneCard = ({
  milestone,
  state,
  onClick,
  areDetailsShown,
  isReviewer,
  index,
  onApprove,
  onSendFeedback,
}: MilestoneCardProps) => (
  <div className="rounded-xl border border-gray-800  bg-gray-800/20 backdrop-blur">
    <button
      className={classNames(
        `h-20 bg-gray-800 rounded-xl px-5 flex items-center gap-4 justify-between w-full border border-transparent`,
        state === 'upcoming' ? 'cursor-not-allowed' : 'cursor-pointer',
        state === 'upcoming' && 'opacity-50',
        state === 'completed' && 'opacity-30',
        state !== 'upcoming' && 'hover:border-indigo-500'
      )}
      disabled={state === 'upcoming'}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {state === 'completed' && (
          <CheckCircleIcon className={classNames('w-6 h-6 text-green-500')} />
        )}
        {state !== 'completed' && (
          <div
            className={`bg-indigo-500 h-6 w-6 flex items-center justify-center rounded-xl`}
          >
            {index + 1}
          </div>
        )}

        <div className={`overflow-hidden whitespace-pre-wrap`}>
          {milestone.text}
        </div>
      </div>
      <span className={`ml-auto font-medium`}>${milestone.funds}</span>
    </button>
    {areDetailsShown && (
      <div className="pt-5">
        <h4 className="px-5">{milestone.text}</h4>
        <p className="whitespace-pre-wrap h-full break-words text-gray-500 max-h-[300px] overflow-y-auto mb-4 px-5">
          {milestone.details}
        </p>
        {isReviewer && state !== 'completed' && (
          <div className="space-x-2 flex w-full max-w-7xl items-end justify-end p-2 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
            <button
              className={classNames(
                // TODO: unhide this when API integrated
                'inline-flex- hidden items-center rounded-xl border border-transparent bg-red-900 bg-opacity-20 px-4 py-3 text-sm font-medium shadow-sm hover:bg-red-800 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 justify-center text-red-400'
              )}
              onClick={onSendFeedback}
            >
              Send back with feedback
            </button>
            <button
              className={classNames(
                'inline-flex items-center rounded-xl border border-transparent bg-green-900 bg-opacity-20 px-4 py-3 text-sm font-medium shadow-sm hover:bg-green-800 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 justify-center text-green-400'
              )}
              onClick={onApprove}
            >
              Approve
            </button>
          </div>
        )}
      </div>
    )}
  </div>
)

type Props = {
  milestones: ApplicationMilestoneType[]
  completedMilestoneCount?: number
  isReviewer?: boolean
  isApplicant?: boolean
}

const MilestoneReporting = ({
  milestones,
  completedMilestoneCount = 1,
  isReviewer,
  isApplicant,
}: Props) => {
  const loadingToastRef = useRef<CTReturn | null>(null)
  const router = useRouter()
  const { workspaceId, grantAddress, applicationId } = router.query

  const approveMilestoneMutation = useMutation({
    mutationFn: (milestoneId: string) =>
      approveMilestoneSC({
        applicationId: applicationId as string,
        grantAddress: grantAddress as string,
        milestoneId,
        workspaceId: workspaceId as string,
      }),
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        'Approving milestone. This may take a while.',
        {
          hideAfter: 0,
        }
      )
    },
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success('Milestone approved')
      window.location.reload()
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while approving milestone.')
    },
  })

  const [activeMilestoneId, setActiveMilestoneId] = useState('')
  const [isApproveMilestoneModalOpen, setIsApproveMilestoneModalOpen] =
    useState(false)
  const [isSendFeedbackModalOpen, setIsSendFeedbackModalOpen] = useState(false)

  const completedMilestones = milestones.filter(
    (_, index) => index < completedMilestoneCount
  )
  const pendingMilestones = milestones.filter(
    (_, index) => index >= completedMilestoneCount
  )

  const activeMilestoneIndex = milestones.findIndex(
    (milestone) => milestone.id === activeMilestoneId
  )

  const onMilestoneClick = (milestone: ApplicationMilestoneType) => {
    if (!milestone.details) {
      isReviewer
        ? cogoToast.error('Please wait for applicant to submit proof of work')
        : isApplicant
        ? router.push(
            `/workspaces/${workspaceId}/grants/${grantAddress}/applications/${applicationId}/milestones/${milestone.id}`
          )
        : null
      return
    }
    setActiveMilestoneId((prev) => (prev === milestone.id ? '' : milestone.id))
  }

  const onApproveMilestoneById = (milestoneId: string) => {
    const milestoneIndex = milestones.findIndex(
      (milestone) => milestone.id === milestoneId
    )
    setIsApproveMilestoneModalOpen(false)
    approveMilestoneMutation.mutate(milestoneIndex.toString())
  }

  return (
    <>
      <div className="border border-solid border-gray-800 rounded-xl backdrop-blur h-12 flex items-center p-5 font-medium">
        <CurrencyDollarIcon className="w-4 mr-1.5" />
        Total funds promised for the application
        <span className="text-indigo-500 ml-auto font-medium">
          $
          {milestones?.reduce(
            (value, milestone) =>
              value +
              (typeof milestone.funds === 'string'
                ? parseInt(milestone?.funds || '0')
                : milestone?.funds || 0),
            0
          )}
        </span>
      </div>
      {completedMilestoneCount > 0 && (
        <div className="text-sm text-gray-400">COMPLETED MILESTONES</div>
      )}
      <div className="flex flex-col gap-8 relative">
        <div className="absolute h-full w-0 border border-gray-800 left-8 -z-10"></div>
        {completedMilestones.map((milestone, index) => (
          <MilestoneCard
            key={milestone.id}
            areDetailsShown={activeMilestoneId === milestone.id}
            index={index}
            isReviewer={!!isReviewer}
            milestone={milestone}
            onClick={() => onMilestoneClick(milestone)}
            state="completed"
          />
        ))}
      </div>
      {completedMilestoneCount > 0 &&
        completedMilestoneCount < milestones.length && (
          <div className="text-sm text-gray-400">UPCOMING MILESTONES</div>
        )}
      <div className="flex flex-col gap-8 relative">
        <div className="absolute h-full w-0 border border-gray-800 left-8 -z-10"></div>
        {pendingMilestones.map((milestone, index) => (
          <MilestoneCard
            key={milestone.id}
            areDetailsShown={activeMilestoneId === milestone.id}
            index={index + completedMilestones.length}
            isReviewer={!!isReviewer}
            milestone={milestone}
            onApprove={() => setIsApproveMilestoneModalOpen(true)}
            onSendFeedback={() => setIsSendFeedbackModalOpen(true)}
            onClick={() => onMilestoneClick(milestone)}
            state={
              index + completedMilestones.length === completedMilestoneCount
                ? 'ongoing'
                : 'upcoming'
            }
          />
        ))}
      </div>
      <AlertModal
        onCtaClick={() => onApproveMilestoneById(activeMilestoneId)}
        isOpen={isApproveMilestoneModalOpen}
        setIsOpen={setIsApproveMilestoneModalOpen}
        ctaText="Approve"
        title={`Approve Milestone ${activeMilestoneIndex + 1}`}
        text="Approving this milestone will credit the requested funds to applicant's wallet."
      />
      <FeedbackModal
        isMilestoneFeedback
        isOpen={isSendFeedbackModalOpen}
        setIsOpen={setIsSendFeedbackModalOpen}
        applicationId={applicationId as string}
        grantAddress={grantAddress as string}
        workspaceId={workspaceId as string}
      />
    </>
  )
}

export default MilestoneReporting
