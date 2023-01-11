import AlertModal from '@components/common/alert-modal'
import { revertMilestoneApproveDecisionSC } from '@lib/utils/application'
import cogoToast, { CTReturn } from 'cogo-toast'
import React, { Dispatch, SetStateAction, useRef } from 'react'
import { useMutation } from 'wagmi'

type Props = {
  applicationId: string
  milestoneId: string
  grantAddress: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const RevertMilestoneApproveModal = ({
  applicationId,
  grantAddress,
  milestoneId,
  isOpen,
  setIsOpen,
}: Props) => {
  const loadingToastRef = useRef<CTReturn | null>(null)
  const revertDecisionMutation = useMutation({
    mutationFn: () =>
      revertMilestoneApproveDecisionSC(
        applicationId,
        milestoneId,
        grantAddress
      ),
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        `Rolling back decision. This may take a while.`,
        {
          hideAfter: 0,
        }
      )
    },
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success(`Milestone rolled back successfully`)
      window.location.reload()
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while updating milestone status.')
    },
  })

  const text =
    'Reverting the decision will roll back the milestone to "In review" state. Are you sure you want to continue?'

  return (
    <AlertModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Revert decision"
      text={text}
      ctaText="Revert"
      onCtaClick={() => revertDecisionMutation.mutate()}
      isLoading={revertDecisionMutation.isLoading}
    />
  )
}

export default RevertMilestoneApproveModal
