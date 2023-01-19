import { GrantType } from '@lib/types/grants'
import { updateGrantDataAndCallSmartContractFn } from '@lib/utils/grants'
import React, { useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import cogoToast, { CTReturn } from 'cogo-toast'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import Form from '@components/grants/form'
import ForceConnectWallet from '@components/common/force-connect-wallet'
import { useNetwork } from 'wagmi'
import { SUPPORTED_CHAINS } from '@lib/constants/contract'

type Props = {
  workspaceTitle: string
  grant: GrantType
}

const UpdateGrant = ({ workspaceTitle = 'Workspace', grant }: Props) => {
  const { chain } = useNetwork()
  const router = useRouter()

  const chainId = router.query.chainId

  const loadingToastRef = useRef<CTReturn | null>(null)
  const grantMutation = useMutation({
    mutationFn: (data: GrantType) =>
      updateGrantDataAndCallSmartContractFn(data, chain?.id as number),
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success('Grant updated successfully')
      router.push(
        `/${chainId}/workspaces/${workspaceId}/grants/${grantAddress}`
      )
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while updating grant.')
    },
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading('Updating grant', {
        hideAfter: 0,
      })
    },
  })
  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress

  const onBack = () =>
    router.push(`/${chainId}/workspaces/${workspaceId}/grants/${grantAddress}`)

  return (
    <>
      <ForceConnectWallet />
      <Form
        mutate={grantMutation.mutate}
        onBack={onBack}
        workspaceTitle={workspaceTitle}
        grant={grant}
        isLoading={grantMutation.isLoading}
        isUpdateForm
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
  const { workspace, grants } = await fetchWorkspaceById(
    workspaceId as any,
    chainId
  )
  const grant = grants.find((grant) => grant.address === grantAddress)

  const workspaceTitle = workspace.communityName

  return { props: { workspaceTitle, grant } as Props }
}

export default UpdateGrant
