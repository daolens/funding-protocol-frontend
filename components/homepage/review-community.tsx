import WorkspaceCardList from '@components/homepage/workspace-card'
import { WorkspaceCardListType } from '@lib/types/home'

type Props = {
  communityDetailsData: WorkspaceCardListType[]
}

const CommunitiesYouReview = ({ communityDetailsData }: Props) => {
  return (
    <section className="pt-14 text-gray-300">
      <h2 className="text-2xl font-semibold text-decoration-line pb-8 underline decoration-4 decoration-indigo-400">
        ✍️ Communities you review
      </h2>
      <div className="grid grid-cols-2 gap-5">
        <WorkspaceCardList communityDetailsData={communityDetailsData} />
      </div>
    </section>
  )
}

export default CommunitiesYouReview
