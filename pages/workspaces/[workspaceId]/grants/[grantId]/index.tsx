import Background from '@components/common/background'
import Info from '@components/grants/details/info'
import { GrantTreasuryType, GrantType } from '@lib/types/grants'
import React from 'react'

type Props = {
  grant: GrantType
  workspaceName: string
  treasury: GrantTreasuryType
  isAdmin: boolean
}

const GrantDetails = ({ grant, treasury, workspaceName, isAdmin }: Props) => {
  return (
    <Background>
      <div className="grid grid-cols-3">
        <div className="col-span-2">
          <Info grant={grant} isAdmin={isAdmin} workspaceName={workspaceName} />
        </div>
        <div className='flex flex-col'></div>
      </div>
    </Background>
  )
}

export const getServerSideProps = async () => {
  const grant: GrantType = {
    status: 'open',
    title: 'Uniswap Grants - Season 02',
    subTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id est vehicula, blandit ligula in, pellentesque ante. Sed nec diam nec mauris venenatis egestas vel ultricies ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus est, auctor efficitur vestibulum et, sodales nec ex.',
    tags: ['💰 DeFi', '🌱 Ecosystem'],
    proposalDeadline: '2023-01-31T00:00:00.000Z',
    fundingMethod: 'UPFRONT',
    selectionProcess: 'committee',
    treasuryAmount: 5,
    token: 'Aave',
    reviewers: [
      '0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A',
      '0x7D04A724BCd6c0DBAf976BE9e9b89758c300E45A',
    ],
    applicantCount: 412,
  }

  const workspaceName = 'Swap Grants'

  const treasury: GrantTreasuryType = {
    left: 800,
    token: 'USDC',
    total: 1000,
  }

  const props: Props = {
    grant,
    workspaceName,
    treasury,
    isAdmin: true,
  }

  return { props }
}

export default GrantDetails
