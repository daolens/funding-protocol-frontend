import WorkspaceCard from '@components/homepage/workspace-card'
import { WorkspaceCardType } from '@lib/types/home'

type Props = {
  communityDetailsData: WorkspaceCardType[]
}

const CommunitiesYouReview = ({ communityDetailsData }: Props) => {
  return (
    <section className="pt-14 text-gray-300">
      <h2 className="text-2xl font-semibold text-decoration-line pb-8 underline decoration-4 decoration-indigo-400">
        ✍️ Communities you review
      </h2>
      <div className="grid grid-cols-2 gap-5">
        <WorkspaceCard communityDetailsData={communityDetailsData} />
      </div>
    </section>
  )
}

export default CommunitiesYouReview
