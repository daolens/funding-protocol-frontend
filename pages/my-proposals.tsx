import ApplicationCard from '@components/application/application-card'
import Background from '@components/common/background'
import ForceConnectWallet from '@components/common/force-connect-wallet'
import Navbar from '@components/common/navbar'
import Spinner from '@components/common/spinner'
import { WalletAddressType } from '@lib/types/common'
import { fetchCurrentUserApplications } from '@lib/utils/application'
import { useQuery } from '@tanstack/react-query'
import cogoToast from 'cogo-toast'
import React from 'react'
import { useAccount } from 'wagmi'

const MyProposals = () => {
  const { address } = useAccount()
  const { data, isLoading } = useQuery({
    queryKey: ['fetch-my-applications', address],
    queryFn: () => fetchCurrentUserApplications(address as WalletAddressType),
    enabled: !!address,
    onError: (error) => {
      console.error(error)
      cogoToast.error('Something went wrong while fetching your proposals')
    },
  })

  return (
    <Background>
      <ForceConnectWallet />
      <Navbar />
      <div className="flex flex-col gap-9 py-11 max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold">My proposals</h1>
        {isLoading && (
          <div className="h-[70vh] flex justify-center items-center">
            <Spinner className="w-10 h-10" />
          </div>
        )}
        <div className="grid gap-5">
          {data?.map((application) => (
            <ApplicationCard application={application} key={application.id} />
          ))}
        </div>
      </div>
    </Background>
  )
}

export default MyProposals
