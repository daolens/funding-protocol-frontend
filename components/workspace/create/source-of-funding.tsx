import Input from '@components/common/input-with-trailing-icon'
import Spinner from '@components/common/spinner'
import NetworkDropdwon from '@components/workspace/create/network-dropdown'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { SupportedNetworkIdType } from '@lib/types/common'
import { getListOfSupportedNetworks } from '@lib/utils/safe'
import { useQuery } from '@tanstack/react-query'
import React, { Dispatch, SetStateAction } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import cogoToast from 'cogo-toast'

type Props = {
  multisigWalletAddress: string
  setMultisigWalletAddress: Dispatch<SetStateAction<string>>
  networkId: SupportedNetworkIdType | null
  setNetworkId: Dispatch<SetStateAction<SupportedNetworkIdType | null>>
  onNext: () => void
}
const SourceOfFunding = ({
  multisigWalletAddress,
  networkId,
  setMultisigWalletAddress,
  setNetworkId,
  onNext,
}: Props) => {
  const { data, isLoading, isError, refetch, isSuccess } = useQuery({
    queryKey: ['safes-for-address', multisigWalletAddress],
    refetchOnWindowFocus: false,
    queryFn: ({ queryKey }) => getListOfSupportedNetworks(queryKey[1]),
    onSuccess: (data) => {
      if (!multisigWalletAddress) return
      if (data.length === 0)
        cogoToast.error('No supported networks found for the wallet')
      else setNetworkId(data[0].chainId)
    },
    onError: (error) => {
      console.error(error)
      cogoToast.error('Something went wrong while fetching networks.')
    },
  })

  return (
    <div className="flex flex-col gap-11">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-semibold text-gray-200">
          Link your source of funding
        </h2>
        <p className="text-sm text-gray-500">
          Showing the proof will increase confidence in grant applicants
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-gray-200">Multisig address</h3>
          <p className="text-sm text-gray-500">
            {/* TODO: add tutorial link */}
            We support Gnosis for now
          </p>
        </div>
        <Input
          value={multisigWalletAddress}
          onChange={(e) => {
            setMultisigWalletAddress(e.currentTarget.value)
            refetch({ queryKey: ['safes-for-address', e.currentTarget.value] })
          }}
          placeholder="Wallet address"
          isIconShown={!!multisigWalletAddress}
          icon={
            isLoading ? (
              <Spinner />
            ) : isError || !data || data.length === 0 ? (
              <XCircleIcon className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            )
          }
        />
      </div>

      {isSuccess && data.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-gray-200">
                Wallet was found in{' '}
                {data?.length === 1
                  ? 'one network'
                  : `${data?.length} networks`}
              </h3>
              <p className="text-sm text-gray-500">
                Choose the network you will use for payout
              </p>
            </div>
            <NetworkDropdwon
              networkId={networkId}
              setNetworkId={setNetworkId}
              supportedSafes={data}
            />
          </div>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start"
          >
            Next
            <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  )
}

export default SourceOfFunding
