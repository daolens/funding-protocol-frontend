import { GrantType } from '@lib/types/grants'
import { postGrantDataAndCallSmartContractFn } from '@lib/utils/grants'
import React, { useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import cogoToast, { CTReturn } from 'cogo-toast'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import Form from '@components/grants/form'

type Props = {
  workspaceTitle: string
}

const Create = ({ workspaceTitle = 'Workspace' }: Props) => {
  const loadingToastRef = useRef<CTReturn | null>(null)
  const router = useRouter()
  const workspaceId = router.query.workspaceId as string
  const grantMutation = useMutation({
    mutationFn: (data: GrantType) => postGrantDataAndCallSmartContractFn(data),
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
    <Form
      mutate={grantMutation.mutate}
      onBack={onBack}
      workspaceTitle={workspaceTitle}
      isLoading={grantMutation.isLoading}
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
