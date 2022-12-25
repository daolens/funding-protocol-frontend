import ClientOnly from '@components/common/client-only'
import ConnectWalletModal from '@components/common/connect-wallet-modal'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

const ForceConnectWallet = () => {
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false)

  const { address } = useAccount()

  useEffect(() => {
    !address && setIsConnectWalletModalOpen(true)
  }, [address, isConnectWalletModalOpen])
  return (
    <ClientOnly>
      <ConnectWalletModal
        isOpen={isConnectWalletModalOpen}
        setIsOpen={setIsConnectWalletModalOpen}
        isCloseButtonHidden
      />
    </ClientOnly>
  )
}

export default ForceConnectWallet
