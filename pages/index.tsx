import Background from '@components/common/background'
import CommunitiesYouReview from '@components/homepage/review-community'
import DiscoverApply from '@components/homepage/discover'
import { GetServerSideProps } from 'next'

type Props = {
  communityDetailsData: CommunityDetailsType[]
  discoverDetailsData: CommunityDetailsType[]
}

const HomePage = ({ communityDetailsData, discoverDetailsData }: Props) => {
  return (
    <Background>
      <CommunitiesYouReview communityDetailsData={communityDetailsData} />
      <DiscoverApply discoverDetailsData={discoverDetailsData} />
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const communityDetailsData: CommunityDetailsType[] = [
    {
      image: '/images/tokens/aave.png',
      communityName: 'Polygon DAO',
      activeGrants: 0,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
    {
      image: '/images/tokens/aave.png',
      communityName: 'Polygon DAO',
      activeGrants: 5,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
    {
      image: '/images/tokens/aave.png',
      communityName: 'Polygon DAO',
      activeGrants: 5,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
    {
      image: '/images/tokens/aave.png',
      communityName: 'Polygon DAO',
      activeGrants: 0,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
  ]
  const discoverDetailsData: CommunityDetailsType[] = [
    {
      image: '/images/tokens/aave.png',
      communityName: 'Polygon DAO',
      activeGrants: 0,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
    {
      image: '/images/tokens/aave.png',
      communityName: 'Polygon DAO',
      activeGrants: 5,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
    {
      image: '/images/tokens/aave.png',
      communityName: 'Polygon DAO',
      activeGrants: 0,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
    {
      image: '/images/tokens/aave.png',
      communityName: 'Polygon DAO',
      activeGrants: 5,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
  ]
  const props: Props = {
    communityDetailsData,
    discoverDetailsData,
  }
  return { props }
}

export default HomePage
