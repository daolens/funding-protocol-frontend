import CommunityAvatar from '@components/common/community-avatar'
import {
  ArrowRightIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline'
import { SupportedNetworkIdType } from '@lib/types/common'
import Lottie from 'lottie-react'
import React from 'react'
import confettiAnimation from '@public/animations/confetti.json'

type Props = {
  communityName: string
  multisigAddress: string
  networkId: SupportedNetworkIdType
}

const Success = ({ communityName, multisigAddress, networkId }: Props) => {
  const truncatedAddress =
    multisigAddress.slice(0, 7) + '...' + multisigAddress.slice(-5)

  // TODO: handle sign
  const onSign = () => console.log('HANLDE SIGN')
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
        onClick={onSign}
        className="inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start"
      >
        Sign and verify
        <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default Success
