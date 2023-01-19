import { ApplicationCard } from '@components/application/side-info-bar'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
  feedback: string
}

const FeedbackCard = ({ feedback }: Props) => {
  const router = useRouter()
  const { workspaceId, grantAddress, applicationId, chainId } = router.query
  return (
    <div className="grid gap-5">
      <ApplicationCard>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-2xl">Feedback</span>
          <span className="text-sm text-gray-500">{feedback}</span>
        </div>
      </ApplicationCard>
      <Link
        href={`/${chainId}/workspaces/${workspaceId}/grants/${grantAddress}/applications/${applicationId}/update`}
        className="inline-flex items-center justify-center rounded-xl border border-gray-800 bg-gray-800 bg-opacity-20 px-4 py-2 text-base font-medium text-gray-200 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Update application
        <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
      </Link>
    </div>
  )
}

export default FeedbackCard
