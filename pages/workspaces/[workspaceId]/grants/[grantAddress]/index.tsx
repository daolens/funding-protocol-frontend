import BackButton from '@components/common/back-button'
import Background from '@components/common/background'
import ClientOnly from '@components/common/client-only'
import Navbar from '@components/common/navbar'
import Funds from '@components/grants/details/funds'
import Info from '@components/grants/details/info'
import Sections from '@components/grants/details/sections'
import Stats from '@components/grants/details/stats'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { WalletAddressType } from '@lib/types/common'
import {
  ApplicationType,
  GrantTreasuryType,
  GrantType,
} from '@lib/types/grants'
import { fetchApplications } from '@lib/utils/grants'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useAccount } from 'wagmi'

type Props = {
  grant: GrantType
  workspaceName: string
  treasury: GrantTreasuryType
  workspaceOwner: WalletAddressType
  applications: ApplicationType[]
}

const GrantDetails = ({
  grant,
  treasury,
  workspaceName,
  workspaceOwner,
  applications,
}: Props) => {
  const { address } = useAccount()
  const router = useRouter()

  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress as string

  const isApplied = applications.some(
    (application) => application.owner === address
  )

  const onBack = () => router.push(`/workspaces/${workspaceId}`)
  const isAdmin = workspaceOwner === address

  return (
    <ClientOnly>
      <Background>
        <Navbar />
        <div className="py-6 flex flex-col gap-3">
          <BackButton onBack={onBack} />
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <Info
                grant={grant}
                isAdmin={isAdmin}
                workspaceName={workspaceName}
              />
              <Sections
                applications={applications}
                description={grant.subTitle}
              />
            </div>
            <div className="flex flex-col gap-5">
              <Funds isAdmin={isAdmin} treasury={treasury} />
              <Stats
                applicantCount={grant.applicantCount as number}
                approvedCount={grant.approvedCount as number}
              />
              <Link
                href={
                  isApplied
                    ? '#'
                    : `/workspaces/${workspaceId}/grants/${grantAddress}/apply`
                }
                className={classNames(
                  'inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 justify-center',
                  { 'cursor-not-allowed opacity-50': isApplied }
                )}
              >
                {isApplied ? (
                  'Applied'
                ) : (
                  <>
                    Apply for Grant
                    <ArrowRightIcon
                      className="ml-3 -mr-1 h-5 w-5"
                      aria-hidden="true"
                    />
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>
      </Background>
    </ClientOnly>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const { workspaceId, grantAddress } = query

  const { grants, workspace } = await fetchWorkspaceById(workspaceId as any)
  const grant = grants.find((grant) => grant.address === grantAddress)

  if (!grant || !workspace)
    return {
      notFound: true,
    }

  const workspaceName = workspace.communityName

  const treasury: GrantTreasuryType = {
    left: grant.balance as number,
    // TODO: add correct token symbol
    token: grant.token,
  }

  const applications = await fetchApplications(
    grant.address!,
    grant.applicantCount!
  )

  const approvedCount = applications
    .map((application) =>
      application.status === 'Approved' ? (1 as number) : (0 as number)
    )
    .reduce((prev = 0, curr = 0) => prev + curr, 0)

  grant.approvedCount = approvedCount

  const props: Props = {
    grant,
    workspaceName,
    treasury,
    workspaceOwner: workspace.owner as WalletAddressType,
    applications,
  }

  return { props }
}

export default GrantDetails
