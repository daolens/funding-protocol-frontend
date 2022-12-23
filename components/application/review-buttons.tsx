import CountDownTimer from '@components/common/count-down-timer'
import Funds from '@components/grants/details/funds'
import {
  ArrowRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import { WalletAddressType } from '@lib/types/common'
import { ApplicationStatusType } from '@lib/types/grants'
import { updateApplicationStatusSC } from '@lib/utils/application'
import { addDays, getTruncatedWalletAddress } from '@lib/utils/common'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import cogoToast from 'cogo-toast'
import { useRouter } from 'next/router'
import React from 'react'
import { useEnsName } from 'wagmi'

type Props = {
  status: ApplicationStatusType
  grantBalance: number
  isInsufficientBalance: boolean
  isAdmin: boolean
  token: string
  reviewers?: WalletAddressType[]
  reviewTimestamp?: string
}

// TODO: handle states
const ReviewButtons = ({
  status,
  grantBalance,
  isInsufficientBalance,
  isAdmin,
  token,
  reviewers,
  reviewTimestamp,
}: Props) => {
  const reviewer = reviewers?.[0]
  const { data: reviewerEnsName } = useEnsName({ address: reviewer })
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
      }),
    onSuccess: (_, newStatus) =>
      cogoToast.success(
        `Application ${
          newStatus === 'Approved' ? 'approved' : 'rejected'
        } successfullys.`
      ),
    onError: (error) => {
      console.error(error)
      cogoToast.error('Something went wrong while updating application status.')
    },
  })

  const onApprove = () => mutate('Approved')

  const onReject = () => mutate('Rejected')

  const onSuggestChanges = () => {
    // TODO: handle
  }

  const onReviewDecision = () => {
    // TODO: handle
  }

  return (
    <div className="grid grid-cols-2 gap-5">
      {status === 'Submitted' && (
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
            onClick={onSuggestChanges}
          >
            Suggest some changes
            <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </>
      )}

      {status === 'Resubmit' && (
        <div className="col-span-2 bg-indigo-500 bg-opacity-10 border border-indigo-500 p-5 rounded-xl flex flex-col gap-3">
          <p className="text-lg text-gray-200">Sent back with feedback</p>
          {reviewer && (
            <span className="text-gray-500 text-xs">
              by {reviewerEnsName || getTruncatedWalletAddress(reviewer)}
            </span>
          )}
        </div>
      )}

      {status === 'Rejected' && (
        <div className="col-span-2 bg-red-500 bg-opacity-10 border border-red-800 p-5 rounded-xl flex flex-col gap-3">
          <p className="text-lg text-gray-200">Application Rejected</p>
          {reviewer && (
            <span className="text-gray-500 text-xs">
              by {reviewerEnsName || getTruncatedWalletAddress(reviewer)}
            </span>
          )}
        </div>
      )}

      {status === 'Approved' &&
        new Date() < addDays(reviewTimestamp as string, 3) && (
          <div
            style={{
              background:
                'linear-gradient(180deg, rgba(0, 175, 117, 0.12) 0%, rgba(0, 0, 0, 0) 100%)',
            }}
            className="rounded-xl p-5 border border-gray-800 flex flex-col gap-4 col-span-2"
          >
            <div className="flex flex-col gap-3 border-b border-gray-800 pb-4">
              <p className="text-lg text-gray-200">Pending confirmation</p>
              {reviewer && (
                <span className="text-gray-500 text-xs">
                  application approved by{' '}
                  {reviewerEnsName || getTruncatedWalletAddress(reviewer)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-gray-500 text-xs">
                Made a mistake? Review the decision within
              </span>
              {reviewTimestamp && (
                <CountDownTimer
                  endTime={addDays(reviewTimestamp, 3).toISOString()}
                />
              )}
            </div>
            <button
              className="w-full text-indigo-500 bg-indigo-800 hover:bg-indigo-600 hover:bg-opacity-20 bg-opacity-20 rounded-lg border-dashed border border-indigo-800 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onReviewDecision}
            >
              Review Decision
            </button>
          </div>
        )}

      {status === 'Approved' &&
        new Date() >= addDays(reviewTimestamp as string, 3) && (
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
                by {reviewerEnsName || getTruncatedWalletAddress(reviewer)}
              </span>
            )}
          </div>
        )}
      {isInsufficientBalance && (
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
            <Funds isAdmin={isAdmin} treasury={{ left: grantBalance, token }} />
          </div>
        </>
      )}
    </div>
  )
}

export default ReviewButtons
