import Modal from '@components/common/modal'
import { Dialog } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React, { Dispatch, SetStateAction } from 'react'

type Props = {
  title: string
  text: string
  onCtaClick: () => void
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  ctaText: string
  isLoading?: boolean
}

const AlertModal = ({
  isOpen,
  onCtaClick,
  setIsOpen,
  title,
  text,
  ctaText,
  isLoading,
}: Props) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-800 bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationTriangleIcon
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6">
              {title}
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{text}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={classNames(
              'inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
              {
                'opacity-50 cursor-not-allowed': isLoading,
              }
            )}
            onClick={onCtaClick}
            disabled={isLoading}
          >
            {ctaText}
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

export default AlertModal
