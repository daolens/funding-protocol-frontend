import ApplicationForm from '@components/application/form'
import ClientOnly from '@components/common/client-only'
import ForceConnectWallet from '@components/common/force-connect-wallet'
import { SUPPORTED_CHAINS } from '@lib/constants/contract'
import { ApplicationType } from '@lib/types/grants'
import {
  fetchApplicationById,
  updateApplicationMetadataSC,
} from '@lib/utils/application'
import { useMutation } from '@tanstack/react-query'
import cogoToast, { CTReturn } from 'cogo-toast'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { useNetwork } from 'wagmi'

type Props = {
  application: ApplicationType
}

const Update = ({ application }: Props) => {
  const { chain } = useNetwork()
  const router = useRouter()
  const loadingToastRef = useRef<CTReturn | null>(null)

  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress as string
  const chainId = router.query.chainId as string

  const applicationMutation = useMutation({
    mutationFn: (data: ApplicationType) =>
      updateApplicationMetadataSC(data, chain?.id as number),
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        'Updating application. This may take a while.',
        {
          hideAfter: 0,
        }
      )
    },
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success('Updated successfully')
      router.push(
        `/${chainId}/workspaces/${workspaceId}/grants/${grantAddress}/applications/${application.id}`
      )
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while updating.')
    },
  })

  const onBack = () =>
    router.push(
      `/${chainId}/workspaces/${workspaceId}/grants/${grantAddress}/applications/${application.id}`
    )

  return (
    <ClientOnly>
      <ForceConnectWallet />
      <ApplicationForm
        onBack={onBack}
        isLoading={applicationMutation.isLoading}
        onSubmit={(application) => applicationMutation.mutate(application)}
        application={application}
        isUpdateForm
      />
    </ClientOnly>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const chainId = parseInt(query.chainId as string)
  if (!chainId || !SUPPORTED_CHAINS.map((chain) => chain.id).includes(chainId))
    return { props: {} }
  const applicationId = query.applicationId as `0x${string}`

  const application = await fetchApplicationById(applicationId, chainId)

  if (!application)
    return {
      notFound: true,
    }

  const props: Props = {
    application,
  }

  return {
    props,
  }
}

export default Update
