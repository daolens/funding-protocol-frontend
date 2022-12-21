import { ApplicationStatusType } from '@lib/types/grants'
import React from 'react'

type Props = {
  status: ApplicationStatusType
}

// TODO: handle states
const ReviewButtons = ({ status }: Props) => {
  const onApprove = () => {
    // TODO: handle
  }

  const onReject = () => {
    // TODO: handle
  }

  return (
    <div className="grid grid-cols-1 gap-5">
      {status === 'Under review' && (
        <>
          <button
            onClick={onApprove}
            className="inline-flex items-center rounded-xl border border-transparent bg-green-900 px-4 py-3 text-base font-medium shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 justify-center text-green-400"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="inline-flex items-center rounded-xl border border-transparent bg-red-900 px-4 py-3 text-base font-medium shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 justify-center text-red-400"
          >
            Reject
          </button>
        </>
      )}
    </div>
  )
}

export default ReviewButtons
