import AddFundsModal from '@components/grants/details/add-funds-moda'
import { GrantTreasuryType } from '@lib/types/grants'
import { getTokenSymbol } from '@lib/utils/common'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type Props = {
  treasury: GrantTreasuryType
  isAdmin: boolean
}

const Funds = ({ treasury, isAdmin }: Props) => {
  const router = useRouter()

  const grantAddress = router.query.grantAddress

  const tokenSymbol = getTokenSymbol(treasury.token)
  const [isFundsModalOpen, setIsFundsModalOpen] = useState<boolean>(false)

  return (
    <div className="bg-gray-800 bg-opacity-20 border-gray-800 border p-5 rounded-xl flex flex-col gap-2">
      <span className="text-gray-500 text-sm">Grant Treasury Left</span>
      <div className="flex gap-2 mb-5">
        <span className="text-2xl font-semibold leading-none">
          {tokenSymbol} {treasury.left}
        </span>
        {/* <span className="text-xs text-gray-500 self-end">
          of {tokenSymbol} {treasury.total}
        </span> */}
      </div>
      {isAdmin && (
        <button
          className="w-full text-indigo-500 bg-indigo-800 hover:bg-indigo-600 hover:bg-opacity-20 bg-opacity-20 rounded-lg border-dashed border border-indigo-800 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => setIsFundsModalOpen(true)}
        >
          + Add funds
        </button>
      )}
      <AddFundsModal
        grantAddress={grantAddress as string}
        isOpen={isFundsModalOpen}
        setIsOpen={setIsFundsModalOpen}
      />
    </div>
  )
}

export default Funds
