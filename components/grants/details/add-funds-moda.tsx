import Modal from '@components/common/modal'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import cogoToast from 'cogo-toast'
import React, { Dispatch, SetStateAction } from 'react'

type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  grantAddress: string
}

const AddFundsModal = ({ isOpen, setIsOpen, grantAddress }: Props) => {
  const onCopyAddress = () => {
    navigator.clipboard.writeText(grantAddress)
    cogoToast.success('Copied', { hideAfter: 1 })
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col text-sm gap-5">
        <h3 className="text-lg font-semibold">Deposit address</h3>
        <div className="p-4 border border-gray-700 rounded-xl flex flex-col gap-2">
          <p>{grantAddress}</p>
          <button
            className="inline-flex self-start items-center justify-center rounded-full border border-gray-700 bg-gray-800 bg-opacity-20 px-4 py-2 text-base font-medium text-gray-200 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={onCopyAddress}
          >
            <DocumentDuplicateIcon className="w-5 h-5" />
            Copy
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AddFundsModal
