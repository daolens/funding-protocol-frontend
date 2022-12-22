import Background from '@components/common/background'
import WorkspacesYouOwn from '@components/homepage/review-community'
import Discover from '@components/homepage/discover'
import { GetServerSideProps } from 'next'
import { WorkspaceCardType } from '@lib/types/home'
import { useAccount } from 'wagmi'

type Props = {
  workspaceCards: WorkspaceCardType[]
}

const HomePage = ({ workspaceCards }: Props) => {
  const { address } = useAccount()
  const ownedWorkspaces = workspaceCards.filter(
    (workspace) => workspace.owner === address
  )
  const remainingWorkspaces = workspaceCards.filter(
    (workspace) => workspace.owner !== address
  )
  return (
    <Background>
      <WorkspacesYouOwn workspaceList={ownedWorkspaces} />
      <Discover workspaceList={remainingWorkspaces} />
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  // const workspaces = await fetchWorkspaces()

  // TODO: complete API integration
  const props: Props = {
    workspaceCards: [],
  }
  return { props }
}

export default HomePage
