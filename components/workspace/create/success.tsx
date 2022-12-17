import CommunityAvatar from '@components/common/community-avatar'
import {
  ArrowRightIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline'
import { SupportedNetworkIdType } from '@lib/types/common'
import Lottie from 'lottie-react'
import React from 'react'
import confettiAnimation from '@public/animations/confetti.json'
import { WorkspaceType } from '@lib/types/workspace'
import { ethers } from 'ethers'
import { useSignMessage } from 'wagmi'
import { getSafeDetails } from '@lib/utils/safe'
import SUPPORTED_SAFES_INFO from '@lib/constants/common'
import cogoToast from 'cogo-toast'
import { useMutation } from '@tanstack/react-query'
import { postDataAndCallSmartContractFunction } from '@lib/utils/workspace'

type Props = {
  communityName: string
  multisigAddress: string
  networkId: SupportedNetworkIdType
}

const Success = ({ communityName, multisigAddress, networkId }: Props) => {
  const workspaceMutation = useMutation({
    mutationFn: (data: WorkspaceType) =>
      postDataAndCallSmartContractFunction(data),
    // TODO: update redirections
    onSuccess: () => cogoToast.success('Workspace created!'),
  })

  // Signing the message to verify the ownership of the address and then checking
  // that address is one of owners of the multisig address.
  const { signMessage, isLoading: isSignMessageLoading } = useSignMessage({
    onSuccess: async (data, variables) => {
      const signingAddress = ethers.utils.verifyMessage(variables.message, data)
      const network = SUPPORTED_SAFES_INFO[networkId]
      const safeDetails = await getSafeDetails(network.rpcURL, multisigAddress)
      if (!safeDetails?.owners?.includes(signingAddress)) {
        cogoToast.error('Failed to verify ownership of the multisig address.')
        return
      }
      workspaceMutation.mutate({
        communityName,
        multisigAddress,
        network: networkId,
      })
    },
    onError: (error) => {
      cogoToast.error('Something went wrong.')
      console.error(error)
    },
  })

  const truncatedAddress =
    multisigAddress.slice(0, 7) + '...' + multisigAddress.slice(-5)

  return (
    <div className="flex flex-col gap-11 relative">
      <Lottie
        animationData={confettiAnimation}
        className="absolute top-0 -mt-10"
        loop={false}
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl text-gray-200">
          Looking great! Let&apos;s sign and verify
        </h3>
        <p className="text-gray-500 text-sm">
          Verifying you are a signer will ensure we don&apos;t have a
          impersonation
        </p>
      </div>

      <div className="flex flex-col bg-gray-800 rounded-md p-6 gap-8">
        <div className="flex items-center gap-5">
          <CommunityAvatar communityName={communityName} />
          <p className="font-semibold text-2xl text-white">{communityName}</p>
        </div>
        <div className="flex bg-teal-900 p-2 rounded-lg">
          <BuildingLibraryIcon className="text-teal-200 w-4 h-4" />
          <p className="text-sm text-teal-200">
            Multisig: <span>{truncatedAddress}</span>
          </p>
        </div>
      </div>
      <button
        type="button"
        // TODO: update onclick to ask for connecting wallet first
        onClick={() => signMessage({ message: 'Verifying ownership' })}
        disabled={isSignMessageLoading || workspaceMutation.isLoading}
        className="inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start z-10"
      >
        Sign and verify
        <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default Success
