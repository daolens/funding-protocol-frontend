import Background from '@components/common/background'
import WorkspacesYouOwn from '@components/homepage/review-community'
import Discover from '@components/homepage/discover'
import { GetServerSideProps } from 'next'
import { WorkspaceCardType } from '@lib/types/home'
import { useAccount } from 'wagmi'
import { fetchWorkspaces } from '@lib/utils/workspace'

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
  const workspaces = await fetchWorkspaces()

  const workspaceCards: WorkspaceCardType[] = workspaces.map((workspace) => ({
    activeGrants: workspace.totalGrant as any,
    applicants: workspace.totalApplicants as any,
    communityName: workspace.communityName as any,
    id: workspace.id as any,
    owner: workspace.owner as any,
    sentInGrants: workspace.totalFundsSpent as any,
    treasuryAmount: workspace.totalFunds as any,
  }))

  const props: Props = {
    workspaceCards,
  }
  return { props }
}

export default HomePage
