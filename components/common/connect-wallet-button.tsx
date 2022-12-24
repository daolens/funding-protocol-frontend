import ClientOnly from '@components/common/client-only'
import ConnectWalletModal from '@components/common/connect-wallet-modal'
import { CreditCardIcon } from '@heroicons/react/24/solid'
import { getTruncatedWalletAddress } from '@lib/utils/common'
import React, { useState } from 'react'
import { useAccount, useDisconnect, useEnsName } from 'wagmi'

const ConnectWalletButton = () => {
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false)
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })

  const { disconnect } = useDisconnect()

  return (
    <ClientOnly>
      <button
        className="inline-flex items-center gap-3 justify-center rounded-xl border border-gray-800 bg-gray-800 bg-opacity-20 px-4 py-2 text-sm font-medium text-gray-200 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer group"
        onClick={() =>
          address ? disconnect() : setIsConnectWalletModalOpen(true)
        }
      >
        {address ? (
          <>
            <CreditCardIcon className="w-5 h-5" />
            <span className="group-hover:hidden w-20">
              {ensName || getTruncatedWalletAddress(address)}
            </span>
            <span className="hidden group-hover:flex w-20">Disconnect</span>
          </>
        ) : (
          'Connect wallet'
        )}
      </button>
      {!address && (
        <ConnectWalletModal
          isOpen={isConnectWalletModalOpen}
          setIsOpen={setIsConnectWalletModalOpen}
        />
      )}
    </ClientOnly>
  )
}

export default ConnectWalletButton
