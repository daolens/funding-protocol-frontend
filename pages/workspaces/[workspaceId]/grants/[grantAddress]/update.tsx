import { GrantType } from '@lib/types/grants'
import { postGrantDataAndCallSmartContractFn } from '@lib/utils/grants'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import cogoToast from 'cogo-toast'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import Form from '@components/grants/form'

type Props = {
  workspaceTitle: string
  grant: GrantType
}

const UpdateGrant = ({ workspaceTitle = 'Workspace', grant }: Props) => {
  const grantMutation = useMutation({
    mutationFn: (data: GrantType) => postGrantDataAndCallSmartContractFn(data),
    onSuccess: () => cogoToast.success('Grant updated successfully'),
    onError: (error) => {
      console.error(error)
      cogoToast.error('Something went wrong while updating grant.')
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
