import { GrantType } from '@lib/types/grants'
import { postGrantDataAndCallSmartContractFn } from '@lib/utils/grants'
import React, { useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import cogoToast, { CTReturn } from 'cogo-toast'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import Form from '@components/grants/form'
import ForceConnectWallet from '@components/common/force-connect-wallet'
import { useNetwork } from 'wagmi'
import { ACTIVE_CHAIN_ID_COOKIE_KEY } from '@lib/constants/common'
import { getCookie } from 'cookies-next'
import { SUPPORTED_CHAINS } from '@lib/constants/contract'

type Props = {
  workspaceTitle: string
}

const Create = ({ workspaceTitle = 'Workspace' }: Props) => {
  const loadingToastRef = useRef<CTReturn | null>(null)
  const router = useRouter()
  const { chain } = useNetwork()
  const workspaceId = router.query.workspaceId as string
  const grantMutation = useMutation({
    mutationFn: (data: GrantType) =>
      postGrantDataAndCallSmartContractFn(data, chain?.id as number),
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success('Grant created successfully')
      router.push(`/workspaces/${workspaceId}`)
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while creating grant.')
    },
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        'Creating grant. This may take a while.',
        {
          hideAfter: 0,
        }
      )
    },
  })

  const onBack = () => router.push(`/workspaces/${workspaceId}`)

  return (
    <>
      <ForceConnectWallet />
      <Form
        mutate={grantMutation.mutate}
        onBack={onBack}
        workspaceTitle={workspaceTitle}
        isLoading={grantMutation.isLoading}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query, req, res } = ctx
  const chainId = parseInt(
    getCookie(ACTIVE_CHAIN_ID_COOKIE_KEY, { req, res }) as string
  )
  if (!chainId || !SUPPORTED_CHAINS.map((chain) => chain.id).includes(chainId))
    return { props: {} }
  const { workspaceId } = query
  const { workspace } = await fetchWorkspaceById(workspaceId as any, chainId)

  const workspaceTitle = workspace.communityName

  return { props: { workspaceTitle } as Props }
}

export default Create
