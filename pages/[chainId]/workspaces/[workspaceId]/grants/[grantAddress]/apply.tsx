import ApplicationForm from '@components/application/form'
import ForceConnectWallet from '@components/common/force-connect-wallet'
import { SUPPORTED_CHAINS } from '@lib/constants/contract'
import { ApplicationType, FundingMethodType } from '@lib/types/grants'
import { postApplicationDataAndCallSmartContractFn } from '@lib/utils/grants'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import { useMutation } from '@tanstack/react-query'
import cogoToast, { CTReturn } from 'cogo-toast'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { useNetwork } from 'wagmi'

type Props = {
  grantName: string
  currency?: string
  fundingMethod: FundingMethodType
}

const Apply = ({ grantName, currency = 'USDC', fundingMethod }: Props) => {
  const { chain } = useNetwork()
  const loadingToastRef = useRef<CTReturn | null>(null)

  const router = useRouter()
  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress as string
  const chainId = router.query.chainId as string

  const applicationMutation = useMutation({
    mutationFn: (data: ApplicationType) =>
      postApplicationDataAndCallSmartContractFn(data, chain?.id as number),
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        'Submitting application. This may take a while.',
        {
          hideAfter: 0,
        }
      )
    },
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success('Applied successfully')
      router.push(
        `/${chainId}/workspaces/${workspaceId}/grants/${grantAddress}`
      )
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while applying.')
    },
  })

  const onBack = () =>
    router.push(`/${chainId}/workspaces/${workspaceId}/grants/${grantAddress}`)

  return (
    <>
      <ForceConnectWallet />
      <ApplicationForm
        onBack={onBack}
        isLoading={applicationMutation.isLoading}
        onSubmit={(application) => applicationMutation.mutate(application)}
        currency={currency}
        fundingMethod={fundingMethod}
        grantName={grantName}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const chainId = parseInt(query.chainId as string)
  if (!chainId || !SUPPORTED_CHAINS.map((chain) => chain.id).includes(chainId))
    return { props: {} }
  const { workspaceId, grantAddress } = query

  const { grants } = await fetchWorkspaceById(workspaceId as any, chainId)
  const grant = grants.find((grant) => grant.address === grantAddress)

  if (!grant) return { notFound: true }

  const props: Props = {
    fundingMethod: grant?.fundingMethod,
    grantName: grant?.title,
  }

  return { props }
}

export default Apply
