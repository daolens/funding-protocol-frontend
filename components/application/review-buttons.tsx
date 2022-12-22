import Funds from '@components/grants/details/funds'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { ApplicationStatusType } from '@lib/types/grants'
import { updateApplicationStatusSC } from '@lib/utils/application'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import cogoToast from 'cogo-toast'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
  status: ApplicationStatusType
  grantBalance: number
  isInsufficientBalance: boolean
  isAdmin: boolean
  token: string
}

// TODO: handle states
const ReviewButtons = ({
  status,
  grantBalance,
  isInsufficientBalance,
  isAdmin,
  token,
}: Props) => {
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

  return (
    <div className="grid grid-cols-2 gap-5">
      {(status === 'Submitted' || status === 'Resubmit') && (
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
        </>
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
