import Background from '@components/common/background'
import WorkspacesYouOwn from '@components/homepage/review-community'
import Discover from '@components/homepage/discover'
import { GetServerSideProps } from 'next'
import { WorkspaceCardType } from '@lib/types/home'
import { useAccount } from 'wagmi'
import { fetchWorkspaces } from '@lib/utils/workspace'
import ClientOnly from '@components/common/client-only'
import { getCookie } from 'cookies-next'
import { ACTIVE_CHAIN_ID_COOKIE_KEY } from '@lib/constants/common'
import { SUPPORTED_CHAINS } from '@lib/constants/contract'

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
      <ClientOnly>
        {ownedWorkspaces.length > 0 && (
          <WorkspacesYouOwn workspaceList={ownedWorkspaces} />
        )}
        <Discover workspaceList={remainingWorkspaces} />
      </ClientOnly>
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const chainId = parseInt(
    getCookie(ACTIVE_CHAIN_ID_COOKIE_KEY, { req, res }) as string
  )
  if (!chainId || !SUPPORTED_CHAINS.map((chain) => chain.id).includes(chainId))
    return { props: { workspaceCards: [] } }
  const workspaces = await fetchWorkspaces(chainId)

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
