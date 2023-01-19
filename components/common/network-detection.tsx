import { SUPPORTED_CHAINS } from '@lib/constants/contract'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { Chain, polygon } from 'wagmi/chains'
import { getChainDetails } from '@lib/utils/wallet'
import AlertModal from '@components/common/alert-modal'

export const DEFAULT_CHAIN_ID = polygon.id

const NetworkDetection = () => {
  const { chain } = useNetwork()
  const { address, connector } = useAccount()
  const router = useRouter()

  const [isChainMismatchModalOpen, setIsChainMismatchModalOpen] =
    useState(false)

  const chainIdFromParams = router.query?.chainId as string
  const chainIdFromWallet = chain?.id.toString()

  const activeParamChainName = getChainDetails(
    parseInt(chainIdFromParams)
  )?.name
  const activeWalletChainName = getChainDetails(
    parseInt(chainIdFromWallet || '-1')
  )?.name

  const canSwitchChains = !!connector?.switchChain

  useEffect(() => {
    // Early return is wallet not connected
    if (!address) return
    // Early return if chainId on wallet and app are the same
    if (chainIdFromWallet === chainIdFromParams) {
      setIsChainMismatchModalOpen(false)
      return
    }
    // Give user option to switch chain either on app or on wallet
    if (
      SUPPORTED_CHAINS.map((chain) => chain.id.toString()).includes(
        chainIdFromWallet || ''
      )
    ) {
      setIsChainMismatchModalOpen(true)
      return
    }

    // Last case if chainId on wallet is not supported -> handled by wallet dropdown component
    // It shows a modal asking user switch to a supported chain
  }, [address, chainIdFromWallet, chainIdFromParams, isChainMismatchModalOpen])

  const onSwitchChain = (chain: Chain) => {
    if (!canSwitchChains) return
    connector?.switchChain?.(chain.id)
  }

  return (
    <>
      <span className="inline-flex items-center gap-1 text-xs">
        <span className="h-1 w-1 rounded-full bg-green-500" />
        {activeParamChainName}
      </span>
      <AlertModal
        isCloseButtonHidden
        isOpen={isChainMismatchModalOpen}
        setIsOpen={setIsChainMismatchModalOpen}
        ctaText={`Switch wallet network to ${activeParamChainName}`}
        onCtaClick={() =>
          onSwitchChain(
            SUPPORTED_CHAINS.find(
              (chain) => chain.id.toString() === chainIdFromParams
            )!
          )
        }
        text={`Active network on your wallet is ${activeWalletChainName} but network on the app is set to ${activeParamChainName}`}
        title="Network mis-match detected"
        cancelText={`Switch app network to ${activeWalletChainName}`}
        onCancel={() => router.push(`/${chainIdFromWallet}`)}
      />
    </>
  )
}

export default NetworkDetection
