import RevertMilestoneApproveModal from '@components/application/milestone/revert-milestone-approve-modal'
import CountDownTimer from '@components/common/count-down-timer'
import WalletAddress from '@components/common/wallet-address'
import { WalletAddressType } from '@lib/types/common'
import React, { useState } from 'react'

type Props = {
  reviewer: WalletAddressType
  revertDeadline: string
  applicationId: string
  grantAddress: string
  milestoneId: string
}

const ApprovePending = ({
  reviewer,
  revertDeadline,
  applicationId,
  grantAddress,
  milestoneId,
}: Props) => {
  const [isRevertReviewDecisionModalOpen, setIsRevertReviewDecisionModalOpen] =
    useState(false)
  return (
    <div className="flex flex-col gap-4 border-b border-gray-800 pb-3">
      <div className="flex flex-col gap-3 border-b border-gray-800 pb-4">
        <p className="text-lg text-gray-200">
          Milestone {parseInt(milestoneId) + 1}: Pending confirmation
        </p>
        <span className="text-gray-500 text-xs">
          milestone approved by <WalletAddress address={reviewer} />
        </span>
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
      <RevertMilestoneApproveModal
        applicationId={applicationId}
        grantAddress={grantAddress}
        milestoneId={milestoneId}
        isOpen={isRevertReviewDecisionModalOpen}
        setIsOpen={setIsRevertReviewDecisionModalOpen}
      />
    </div>
  )
}

export default ApprovePending
