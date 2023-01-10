import ClientOnly from '@components/common/client-only'
import ConnectWalletModal from '@components/common/connect-wallet-modal'
import WalletDropdown from '@components/common/wallet-dropdown'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

const ConnectWalletButton = () => {
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false)
  const { address } = useAccount()

  return (
    <ClientOnly>
      {!address && (
        <>
          <button
            className="inline-flex items-center gap-3 justify-center rounded-xl border border-gray-800 bg-gray-800 bg-opacity-20 px-4 py-2 text-sm font-medium text-gray-200 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
            onClick={() => setIsConnectWalletModalOpen(true)}
          >
            Connect wallet
          </button>
          <ConnectWalletModal
            isOpen={isConnectWalletModalOpen}
            setIsOpen={setIsConnectWalletModalOpen}
          />
        </>
      )}
      {address && <WalletDropdown />}
    </ClientOnly>
  )
}

export default ConnectWalletButton
