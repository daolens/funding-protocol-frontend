import ApplicationForm from '@components/application/form'
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

type Props = {
  application: ApplicationType
}

const Update = ({ application }: Props) => {
  const loadingToastRef = useRef<CTReturn | null>(null)

  const router = useRouter()
  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress as string

  const applicationMutation = useMutation({
    mutationFn: (data: ApplicationType) => updateApplicationMetadataSC(data),
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
      router.push(`/workspaces/${workspaceId}/grants/${grantAddress}/applications/${application.id}`)
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while updating.')
    },
  })

  const onBack = () =>
    router.push(
      `/workspaces/${workspaceId}/grants/${grantAddress}/applications/${application.id}`
    )

  return (
    <ApplicationForm
      onBack={onBack}
      isLoading={applicationMutation.isLoading}
      onSubmit={(application) => applicationMutation.mutate(application)}
      application={application}
      isUpdateForm
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const applicationId = query.applicationId as `0x${string}`

  const application = await fetchApplicationById(applicationId)

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
