import CommunityCard from './community-card'
import { CommunityDetailsType } from '@lib/types/home'

type Props = {
  communityDetailsData: CommunityDetailsType[]
}

const CommunitiesYouReview = ({ communityDetailsData }: Props) => {
  return (
    <section className="pt-14 text-gray-300">
      <h2 className="text-2xl font-semibold text-decoration-line pb-8">
        ✍️ Communities you review
      </h2>
      <div className="grid grid-cols-2 gap-5">
        <CommunityCard communityDetailsData={communityDetailsData} />
      </div>
    </section>
  )
}

export default CommunitiesYouReview
