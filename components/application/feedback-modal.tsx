import Modal from '@components/common/modal'
import Textarea from '@components/common/textarea'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import {
  sendFeedbackMilestoneSC,
  updateApplicationStatusSC,
} from '@lib/utils/application'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import cogoToast, { CTReturn } from 'cogo-toast'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'

type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  applicationId: string
  grantAddress: string
  workspaceId: string
  isMilestoneFeedback?: boolean
}

const FeedbackModal = ({
  isOpen,
  setIsOpen,
  applicationId,
  grantAddress,
  workspaceId,
  isMilestoneFeedback = false,
}: Props) => {
  const loadingToastRef = useRef<CTReturn | null>(null)
  const sendFeedbackMutation = useMutation({
    mutationFn: (feedbackData: string) =>
      isMilestoneFeedback
        ? sendFeedbackMilestoneSC({ reason: feedbackData })
        : updateApplicationStatusSC({
            applicationId,
            grantAddress,
            status: 'Resubmit',
            workspaceId,
            reason: feedbackData,
          }),
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        'Submitting feedback. This may take a while.',
        {
          hideAfter: 0,
        }
      )
    },
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success('Feedback sent successfully')
      window.location.reload()
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while sending feedback.')
    },
  })

  const [feedback, setFeedback] = useState('')

  const onSendFeedback = () => sendFeedbackMutation.mutate(feedback)

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col gap-6">
        <h3 className="text-gray-400">
          You can give feedback to the applicant on how to improve
        </h3>
        <Textarea
          label="Feedback (Optional)"
          placeholder={`Write here how the applicant can improve and redo this${
            isMilestoneFeedback ? ' milestone.' : '.'
          }`}
          value={feedback}
          onChange={(e) => setFeedback(e.currentTarget.value)}
        />
        <div className="sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={classNames(
              'inline-flex w-full gap-1 justify-center items-center rounded-md border border-transparent bg-red-900 bg-opacity-20 hover:bg-red-800 hover:bg-opacity-50 px-4 py-2 text-base font-medium text-red-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
              {
                'opacity-50 cursor-not-allowed': sendFeedbackMutation.isLoading,
              }
            )}
            onClick={onSendFeedback}
            disabled={sendFeedbackMutation.isLoading}
          >
            Reject <ArrowRightIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-800 bg-gray-800 px-4 py-2 text-base font-medium shadow-sm text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default FeedbackModal
