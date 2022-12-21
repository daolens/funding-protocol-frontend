import Background from '@components/common/background'
import CommunitiesYouReview from '@components/homepage/review-community'
import Discover from '@components/homepage/discover'
import { GetServerSideProps } from 'next'
import { WorkspaceCardType } from '@lib/types/home'

type Props = {
  communityDetailsData: WorkspaceCardType[]
  discoverDetailsData: WorkspaceCardType[]
}

const HomePage = ({ communityDetailsData, discoverDetailsData }: Props) => {
  return (
    <Background>
      <CommunitiesYouReview communityDetailsData={communityDetailsData} />
      <Discover discoverDetailsData={discoverDetailsData} />
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const communityDetailsData: WorkspaceCardType[] = [
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
      communityName: 'Aave',
      activeGrants: 5,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
    {
      image: '/images/tokens/aave.png',
      communityName: 'Daolens',
      activeGrants: 5,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
    {
      image: '/images/tokens/aave.png',
      communityName: 'Uniswap',
      activeGrants: 0,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
  ]
  const discoverDetailsData: WorkspaceCardType[] = [
    {
      image: '/images/tokens/aave.png',
      communityName: 'Daolens',
      activeGrants: 3,
      treasuryAmount: 250000,
      applicants: 22,
      sentInGrants: 30000,
    },
    {
      image: '/images/tokens/aave.png',
      communityName: 'Uniswap',
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
      communityName: 'Aave',
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
