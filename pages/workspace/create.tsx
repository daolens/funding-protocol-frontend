import CommunityName from '@components/workspace/create/community-name'
import SourceOfFunding from '@components/workspace/create/source-of-funding'
import { SupportedNetworkIdType } from '@lib/types/common'
import { CreateWorkspaceStepType } from '@lib/types/workspace'
import Image from 'next/image'
import { useState } from 'react'

const Create = () => {
  // TODO: revert the default state
  const [activeStep, setActiveStep] =
    useState<CreateWorkspaceStepType>('source-of-funding')
  const [communityName, setCommunityName] = useState('')
  const [multisigWalletAddress, setMultisigWalletAddress] = useState('')
  const [networkId, setNetworkId] = useState<SupportedNetworkIdType | null>(
    null
  )

  return (
    <div className="bg-gray-900 h-screen w-screen">
      <div className="flex h-screen items-center max-w-5xl mx-auto">
        <div className="w-1/2 flex items-center justify-center relative h-full">
          <Image
            src="/images/workspace/create/circles-graphic.png"
            alt="Circles"
            width={658}
            height={759}
            // fill
            // className="object-cover"
          />
        </div>
        <div className="w-1/2">
          {activeStep === 'name' && (
            <CommunityName
              communityName={communityName}
              setCommunityName={setCommunityName}
              onNext={() => setActiveStep('source-of-funding')}
            />
          )}
          {activeStep === 'source-of-funding' && (
            <SourceOfFunding
              multisigWalletAddress={multisigWalletAddress}
              setMultisigWalletAddress={setMultisigWalletAddress}
              networkId={networkId}
              onNext={() => setActiveStep('success')}
              setNetworkId={setNetworkId}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Create
