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
}

const Create = ({ workspaceTitle = 'Workspace' }: Props) => {
  const grantMutation = useMutation({
    mutationFn: (data: GrantType) => postGrantDataAndCallSmartContractFn(data),
    onSuccess: () => cogoToast.success('Grant created successfully'),
    onError: (error) => {
      console.error(error)
      cogoToast.error('Something went wrong while creating grant.')
    },
  })
  const router = useRouter()
  const workspaceId = router.query.workspaceId as string

  const onBack = () => router.push(`/workspaces/${workspaceId}`)

  return (
    <Form
      mutate={grantMutation.mutate}
      onBack={onBack}
      workspaceTitle={workspaceTitle}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const { workspaceId } = query
  const { workspace } = await fetchWorkspaceById(workspaceId as any)

  const workspaceTitle = workspace.communityName

  return { props: { workspaceTitle } as Props }
}

export default Create
