import FeedbackModal from '@components/application/feedback-modal'
import RevertReviewDecisionModal from '@components/application/revert-review-decision-modal'
import ClientOnly from '@components/common/client-only'
import CountDownTimer from '@components/common/count-down-timer'
import WalletAddress from '@components/common/wallet-address'
import Funds from '@components/grants/details/funds'
import {
  ArrowRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import { WalletAddressType } from '@lib/types/common'
import { ApplicationStatusType } from '@lib/types/grants'
import { updateApplicationStatusSC } from '@lib/utils/application'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import cogoToast, { CTReturn } from 'cogo-toast'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { useNetwork } from 'wagmi'

type Props = {
  status: ApplicationStatusType
  grantBalance: number
  grantBalanceInUsd: number
  isInsufficientBalance: boolean
  isAdmin: boolean
  token: string
  reviewers?: WalletAddressType[]
  revertDeadline?: string
  isReviewer?: boolean
}

const ReviewButtons = ({
  status,
  grantBalance,
  grantBalanceInUsd,
  isInsufficientBalance,
  isAdmin,
  token,
  reviewers,
  revertDeadline,
  isReviewer,
}: Props) => {
  const loadingToastRef = useRef<CTReturn | null>(null)
  const { chain } = useNetwork()
  const reviewer = reviewers?.[0]
  const router = useRouter()
  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress as string
  const applicationId = router.query.applicationId as string

  const { mutate } = useMutation({
    mutationFn: (newStatus: ApplicationStatusType) =>
      updateApplicationStatusSC({
        applicationId,
        grantAddress,
        status: newStatus,
        workspaceId,
        chainId: chain?.id as number,
      }),
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        'Submitting review. This may take a while.',
        {
          hideAfter: 0,
        }
      )
    },
    onSuccess: (_, newStatus) => {
      loadingToastRef.current?.hide?.()
      cogoToast.success(
        `Application ${
          newStatus === 'Approved' ? 'approved' : 'rejected'
        } successfully.`
      )
      window.location.reload()
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while updating application status.')
    },
  })

  const [isSuggestChangesModalOpen, setIsSuggestChangesModalOpen] =
    useState(false)
  const [isRevertReviewDecisionModalOpen, setIsRevertReviewDecisionModalOpen] =
    useState(false)

  const onApprove = () => mutate('Approved')

  const onReject = () => mutate('Rejected')

  return (
    <ClientOnly>
      <>
        {isReviewer && status === 'Submitted' && (
          <>
            <button
              onClick={onApprove}
              className={classNames(
                'inline-flex items-center rounded-xl border border-transparent bg-green-900 px-4 py-3 text-base font-medium shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 justify-center text-green-400',
                { 'opacity-50 cursor-not-allowed': isInsufficientBalance }
              )}
              disabled={isInsufficientBalance}
            >
              Approve
            </button>
            <button
              onClick={onReject}
              className={classNames(
                'inline-flex items-center rounded-xl border border-transparent bg-red-900 px-4 py-3 text-base font-medium shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 justify-center text-red-400',
                { 'opacity-50 cursor-not-allowed': isInsufficientBalance }
              )}
              disabled={isInsufficientBalance}
            >
              Reject
            </button>
            <button
              className="col-span-2 inline-flex items-center justify-center rounded-xl border border-gray-800 bg-gray-800 bg-opacity-20 px-4 py-2 text-base font-medium text-gray-200 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setIsSuggestChangesModalOpen(true)}
            >
              Suggest some changes
              <ArrowRightIcon
                className="ml-3 -mr-1 h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </>
        )}

        {isReviewer && status === 'Resubmit' && (
          <div className="col-span-2 bg-indigo-500 bg-opacity-10 border border-indigo-500 p-5 rounded-xl flex flex-col gap-3">
            <p className="text-lg text-gray-200">Sent back with feedback</p>
            {reviewer && (
              <span className="text-gray-500 text-xs">
                by <WalletAddress address={reviewer} />
              </span>
            )}
          </div>
        )}

        {status === 'Rejected' && (
          <div className="col-span-2 bg-red-500 bg-opacity-10 border border-red-800 p-5 rounded-xl flex flex-col gap-3">
            <p className="text-lg text-gray-200">Application Rejected</p>
            {reviewer && (
              <span className="text-gray-500 text-xs">
                by <WalletAddress address={reviewer} />
              </span>
            )}
          </div>
        )}

        {isReviewer &&
          (status === 'ApprovePending' || status === 'RejectPending') && (
            <div
              style={{
                background:
                  status === 'ApprovePending'
                    ? 'linear-gradient(180deg, rgba(0, 175, 117, 0.12) 0%, rgba(0, 0, 0, 0) 100%)'
                    : 'linear-gradient(180deg, rgba(220, 38, 38, 0.12) 0%, rgba(0, 0, 0, 0) 100%)',
              }}
              className="rounded-xl p-5 border border-gray-800 flex flex-col gap-4 col-span-2"
            >
              <div className="flex flex-col gap-3 border-b border-gray-800 pb-4">
                <p className="text-lg text-gray-200">Pending confirmation</p>
                {reviewer && (
                  <span className="text-gray-500 text-xs">
                    application{' '}
                    {status === 'ApprovePending' ? 'approved' : 'rejected'} by{' '}
                    <WalletAddress address={reviewer} />
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-gray-500 text-xs">
                  Made a mistake? Review the decision within
                </span>
                {revertDeadline && <CountDownTimer endTime={revertDeadline} />}
              </div>
              <button
                className="w-full text-indigo-500 bg-indigo-800 hover:bg-indigo-600 hover:bg-opacity-20 bg-opacity-20 rounded-lg border-dashed border border-indigo-800 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setIsRevertReviewDecisionModalOpen(true)}
              >
                Review Decision
              </button>
            </div>
          )}

        {status === 'Approved' && (
          <div
            style={{
              background:
                'linear-gradient(180deg, rgba(0, 175, 117, 0.12) 0%, rgba(0, 0, 0, 0) 100%)',
            }}
            className="rounded-xl p-5 border border-gray-800 flex flex-col gap-3 col-span-2"
          >
            <p className="text-lg text-gray-200">Application Approved</p>
            {reviewer && (
              <span className="text-gray-500 text-xs">
                by <WalletAddress address={reviewer} />
              </span>
            )}
          </div>
        )}
        {(isReviewer || isAdmin) && isInsufficientBalance && (
          <>
            <div className="flex col-span-2 items-center gap-2">
              <div className="w-11 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <ExclamationTriangleIcon className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-xs text-gray-500">
                You do not have sufficient funds to review this application. Add
                more funds to continue.
              </p>
            </div>
            <div className="col-span-2">
              <Funds
                isAdmin={isAdmin}
                treasury={{ left: grantBalance, token }}
                treasuryInUsd={{ left: grantBalanceInUsd, token: '$' }}
              />
            </div>
          </>
        )}
      </>
      <FeedbackModal
        applicationId={applicationId}
        grantAddress={grantAddress}
        workspaceId={workspaceId}
        isOpen={isSuggestChangesModalOpen}
        setIsOpen={setIsSuggestChangesModalOpen}
      />
      <RevertReviewDecisionModal
        applicationId={applicationId}
        grantAddress={grantAddress}
        status={status}
        isOpen={isRevertReviewDecisionModalOpen}
        setIsOpen={setIsRevertReviewDecisionModalOpen}
      />
    </ClientOnly>
  )
}

export default ReviewButtons
