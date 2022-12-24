import { GrantType } from '@lib/types/grants'
import { updateGrantDataAndCallSmartContractFn } from '@lib/utils/grants'
import React, { useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import cogoToast, { CTReturn } from 'cogo-toast'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import Form from '@components/grants/form'

type Props = {
  workspaceTitle: string
  grant: GrantType
}

const UpdateGrant = ({ workspaceTitle = 'Workspace', grant }: Props) => {
  const loadingToastRef = useRef<CTReturn | null>(null)
  const grantMutation = useMutation({
    mutationFn: (data: GrantType) =>
      updateGrantDataAndCallSmartContractFn(data),
    onSuccess: () => {
      loadingToastRef.current?.hide?.()
      cogoToast.success('Grant updated successfully')
      router.push(`/workspaces/${workspaceId}/grants/${grantAddress}`)
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
  const router = useRouter()
  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress

  const onBack = () =>
    router.push(`/workspaces/${workspaceId}/grants/${grantAddress}`)

  return (
    <Form
      mutate={grantMutation.mutate}
      onBack={onBack}
      workspaceTitle={workspaceTitle}
      grant={grant}
      isLoading={grantMutation.isLoading}
      isUpdateForm
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const { workspaceId, grantAddress } = query
  const { workspace, grants } = await fetchWorkspaceById(workspaceId as any)
  const grant = grants.find((grant) => grant.address === grantAddress)

  const workspaceTitle = workspace.communityName

  return { props: { workspaceTitle, grant } as Props }
}

export default UpdateGrant
