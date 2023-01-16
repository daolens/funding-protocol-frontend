import Background from '@components/common/background'
import ForceConnectWallet from '@components/common/force-connect-wallet'
import CommunityName from '@components/workspace/create/community-name'
import SourceOfFunding from '@components/workspace/create/source-of-funding'
import Success from '@components/workspace/create/success'
import { WORKSPACE_STEPS } from '@lib/constants/workspace'
import { SupportedNetworkIdType } from '@lib/types/common'
import { CreateWorkspaceStepType } from '@lib/types/workspace'
import Image from 'next/image'
import { useState } from 'react'

const Create = () => {
  const [activeStep, setActiveStep] = useState<CreateWorkspaceStepType>('name')
  const [communityName, setCommunityName] = useState('')
  const [multisigWalletAddress, setMultisigWalletAddress] = useState('')
  const [networkId, setNetworkId] = useState<SupportedNetworkIdType | null>(
    null
  )

  return (
    <Background>
      <div className="flex flex-col" style={{ height: 'calc(100vh - 70px)' }}>
        <ForceConnectWallet />
        <div className="flex h-full my-auto items-center w-full mx-auto relative">
          <div className="w-1/2 flex items-center justify-center relative h-full">
            <Image
              src="/images/workspace/create/circles-graphic.svg"
              alt="Circles"
              width={658}
              height={759}
              className="absolute -mt-20"
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
            {activeStep === 'success' && (
              <Success
                communityName={communityName}
                multisigAddress={multisigWalletAddress}
                networkId={networkId as SupportedNetworkIdType}
              />
            )}
          </div>

          <div className="absolute w-1/2 left-[50%] bottom-0">
            <div
              className="h-2 rounded-full"
              style={{
                background: 'linear-gradient(360deg, #6366F1 0%, #8F91F6 100%)',
                width: `${Math.min(
                  ((WORKSPACE_STEPS.findIndex((step) => step === activeStep) +
                    1) *
                    100) /
                    WORKSPACE_STEPS.length,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Background>
  )
}

export default Create
