import AlertModal from '@components/common/alert-modal'
import { ApplicationStatusType } from '@lib/types/grants'
import {
  revertApproveDecisionSC,
  revertRejectDecisionSC,
} from '@lib/utils/application'
import cogoToast, { CTReturn } from 'cogo-toast'
import React, { Dispatch, SetStateAction, useRef } from 'react'
import { useMutation } from 'wagmi'

type Props = {
  status: ApplicationStatusType
  applicationId: string
  grantAddress: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const RevertReviewDecisionModal = ({
  applicationId,
  grantAddress,
  status,
  isOpen,
  setIsOpen,
}: Props) => {
  const loadingToastRef = useRef<CTReturn | null>(null)
  const revertDecisionMutation = useMutation({
    mutationFn: (currStatus: ApplicationStatusType) =>
      currStatus === 'Rejected'
        ? revertRejectDecisionSC(applicationId, grantAddress)
        : revertApproveDecisionSC(applicationId, grantAddress),
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        `${
          status === 'Rejected' ? 'Approving' : 'Rejecting'
        } application. This may take a while.`,
        {
          hideAfter: 0,
        }
      )
    },
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success(
        `Application ${
          status === 'Rejected' ? 'approved' : 'rejected'
        } successfully`
      )
      window.location.reload()
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while updating application status.')
    },
  })

  return (
    <AlertModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Revert decision"
      text={`Reverting the decision will ${
        status === 'Rejected' ? 'approve' : 'reject'
      } the application. Are you sure you want to continue?`}
      ctaText="Revert"
      onCtaClick={() => revertDecisionMutation.mutate(status)}
    />
  )
}

export default RevertReviewDecisionModal
