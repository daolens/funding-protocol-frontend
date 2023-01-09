import BackButton from '@components/common/back-button'
import Background from '@components/common/background'
import Navbar from '@components/common/navbar'
import Textarea from '@components/common/textarea'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { ERROR_MESSAGES } from '@lib/constants/common'
import { ApplicationMilestoneType, ApplicationType } from '@lib/types/grants'
import {
  fetchApplicationById,
  submitMilestoneDetailsSC,
} from '@lib/utils/application'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import cogoToast, { CTReturn } from 'cogo-toast'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useAccount } from 'wagmi'

type Props = {
  application: ApplicationType
  milestone: ApplicationMilestoneType
  milestoneIndex: number
}

const MilestoneDetails = ({
  application,
  milestone,
  milestoneIndex,
}: Props) => {
  const { address } = useAccount()
  const loadingToastRef = useRef<CTReturn | null>(null)
  const router = useRouter()
  const workspaceId = router.query.workspaceId as string
  const applicationId = router.query.applicationId as string
  const grantAddress = router.query.grantAddress as string

  const milestoneSubmissionMutation = useMutation({
    mutationFn: (milestoneDetails: string) =>
      submitMilestoneDetailsSC({
        milestoneDetails: [
          ...(milestone.proofOfWorkArray || []),
          {
            text: milestoneDetails,
            timestamp: new Date().toISOString(),
            sender: address!,
          },
        ],
        applicationId,
        grantAddress,
        milestoneId: milestoneIndex.toString(),
        workspaceId,
      }),
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        'Submitting milestone. This may take a while.',
        {
          hideAfter: 0,
        }
      )
    },
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success('Milestone submitted successfully')
      router.push(
        `/workspaces/${workspaceId}/grants/${grantAddress}/applications/${application.id}`
      )
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while submitting milestone.')
    },
  })

  const [details, setDetails] = useState(
    milestone.proofOfWorkArray?.[milestone.proofOfWorkArray?.length - 1]
      ?.text || ''
  )
  const [fieldErrors, setFieldErrors] = useState<{ details: string } | null>(
    null
  )

  const onBack = () =>
    router.push(
      `/workspaces/${workspaceId}/grants/${grantAddress}/applications/${application.id}`
    )

  const onSubmit = () => {
    setFieldErrors(null)
    const milestoneDetails = details
    if (!details) {
      setFieldErrors({ details: ERROR_MESSAGES.fieldRequired })
      return
    }
    milestoneSubmissionMutation.mutate(milestoneDetails)
  }

  return (
    <Background>
      <Navbar />
      <div className="py-6 flex flex-col gap-3">
        <BackButton onBack={onBack} />
      </div>
      <div className="text-2xl font-semibold mb-2">
        Milestone {milestoneIndex + 1} report
      </div>
      <div className="text-sm text-gray-500 mb-6">Goal: {milestone.text}</div>
      <span className="text-gray-400">Proof of work</span>
      <Textarea
        placeholder="Tell us all about the goals you achieved for this milestone"
        className="h-[400px]"
        value={details}
        onChange={(e) => setDetails(e.currentTarget.value)}
        error={fieldErrors?.details}
      />
      <div className="w-full max-w-7xl fixed mx-auto left-0 right-0 bottom-0 mb-6 px-8">
        <div className="flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
          <button
            type="button"
            disabled={milestoneSubmissionMutation.isLoading}
            className={classNames(
              'inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start',
              {
                'cursor-not-allowed opacity-50':
                  milestoneSubmissionMutation.isLoading,
              }
            )}
            onClick={onSubmit}
          >
            Submit
            <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const applicationId = query.applicationId as `0x${string}`
  const milestoneId = query.milestoneId as `0x${string}`
  const application = await fetchApplicationById(applicationId)
  const milestone = application.milestones.find(
    (milestone) => milestone.id === milestoneId
  )
  const milestoneIndex = application.milestones.findIndex(
    (milestone) => milestone.id === milestoneId
  )

  if (!milestone) return { notFound: true }

  const props: Props = {
    application,
    milestone,
    milestoneIndex,
  }

  return { props }
}
export default MilestoneDetails
