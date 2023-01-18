import AlertModal from '@components/common/alert-modal'
import { ApplicationStatusType } from '@lib/types/grants'
import {
  revertApproveDecisionSC,
  revertRejectDecisionSC,
} from '@lib/utils/application'
import cogoToast, { CTReturn } from 'cogo-toast'
import React, { Dispatch, SetStateAction, useRef } from 'react'
import { useMutation, useNetwork } from 'wagmi'

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
  const { chain } = useNetwork()
  const revertDecisionMutation = useMutation({
    mutationFn: (currStatus: ApplicationStatusType) =>
      currStatus === 'RejectPending'
        ? revertRejectDecisionSC(
            applicationId,
            grantAddress,
            chain?.id as number
          )
        : revertApproveDecisionSC(
            applicationId,
            grantAddress,
            chain?.id as number
          ),
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        `${
          status === 'RejectPending'
            ? 'Rolling back decision.'
            : 'Rejecting application.'
        } This may take a while.`,
        {
          hideAfter: 0,
        }
      )
    },
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success(
        status === 'RejectPending'
          ? `Application rolled back successfully`
          : `Application rejected successfully`
      )
      window.location.reload()
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while updating application status.')
    },
  })

  const text =
    status === 'RejectPending'
      ? 'Reverting the decision will roll back the application to "Under review" state. Are you sure you want to continue?'
      : 'Reverting the decision will reject the application. Are you sure you want to continue?'

  return (
    <AlertModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Revert decision"
      text={text}
      ctaText="Revert"
      onCtaClick={() => revertDecisionMutation.mutate(status)}
      isLoading={revertDecisionMutation.isLoading}
    />
  )
}

export default RevertReviewDecisionModal
