import BackButton from '@components/common/back-button'
import Background from '@components/common/background'
import Textarea from '@components/common/textarea'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { ApplicationSectionType } from '@lib/types/application'
import { ApplicationMilestoneType, ApplicationType } from '@lib/types/grants'
import { fetchApplicationById } from '@lib/utils/application'
import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

type Props = {
  application: ApplicationType
  milestone: ApplicationMilestoneType
  milestoneIndex: number
}

const MilestoneDetails = ({
  application,
  milestone,
  milestoneIndex,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const milestoneId = router.query.milestoneId as string
  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress as string

  const onBack = () => {
    // TODO: handle
  }
  return (
    <Background>
      <div className="py-6 flex flex-col gap-3">
        <BackButton onBack={onBack} />
      </div>
      <div className="text-2xl font-semibold mb-2">{}</div>
      <div className="text-sm text-gray-500 mb-6">
        Goal: Defining the structure and designing the whole basketball court in
        UniSwap’s theme and some more things as place
      </div>
      <span className="text-gray-400">Proof of work</span>
      <Textarea
        placeholder="Tell us all about the goals you achieved for this milestone"
        className="h-[400px]"
      />
      <div className="w-full max-w-7xl fixed mx-auto left-0 right-0 bottom-0 mb-6 px-8">
        <div className="flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
          <button
            type="button"
            disabled={isLoading}
            className={classNames(
              'inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start',
              {
                'cursor-not-allowed opacity-50': isLoading,
              }
            )}
          >
            Submit
            <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const applicationId = query.applicationId as `0x${string}`
  const milestoneId = query.milestoneId as `0x${string}`
  const application = await fetchApplicationById(applicationId)
  const milestone = application.milestones.find(
    (milestone) => milestone.id === milestoneId
  )
  const milestoneIndex = application.milestones.findIndex(
    (milestone) => milestone.id === milestoneId
  )

  if (!milestone) return { notFound: true }

  const props: Props = {
    application,
    milestone,
    milestoneIndex,
  }

  return { props }
}
export default MilestoneDetails
