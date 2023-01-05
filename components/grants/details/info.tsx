import {
  ArrowUpRightIcon,
  CalendarIcon,
  ListBulletIcon,
  PencilIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import { GrantType } from '@lib/types/grants'
import { getNumberWithCommas, onCopyText } from '@lib/utils/common'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
  grant: GrantType
  workspaceName: string
  isAdmin: boolean
}

const Info = ({ grant, workspaceName, isAdmin }: Props) => {
  const router = useRouter()

  const workspaceId = router.query.workspaceId
  const grantAddress = router.query.grantAddress

  const fundingMethodData = {
    heading:
      grant.fundingMethod === 'MILESTONE'
        ? 'Milestone payout'
        : 'Upfront payout',
    subHeading:
      grant.fundingMethod === 'UPFRONT'
        ? 'As soon as proposals are approved'
        : 'Split into multiple progressive steps',
  }

  const FundingMethodIcon =
    grant.fundingMethod === 'MILESTONE' ? ListBulletIcon : ArrowUpRightIcon

  const onShare = () => onCopyText(window.location.href)

  return (
    <div className="flex flex-col border-b border-gray-800 gap-3 pb-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{grant.title}</h1>
        <div className="flex gap-2">
          <button
            className="border border-gray-800 py-2 px-3 rounded-lg hover:border-indigo-800"
            onClick={onShare}
            type="button"
          >
            <ShareIcon className="w-4 h-4 strocke-2" />
          </button>
          {isAdmin && (
            <Link
              href={`/workspaces/${workspaceId}/grants/${grantAddress}/update`}
              className="border border-gray-800 py-2 px-3 rounded-lg hover:border-indigo-800 flex items-center gap-2 text-sm"
              type="button"
            >
              <PencilIcon className="w-4 h-4 strocke-2" />
              Edit
            </Link>
          )}
        </div>
      </div>
      <div className="flex text-xs gap-2 text-gray-500 items-center">
        <p>
          by <span className="text-indigo-500">{workspaceName}</span>
        </p>
        <span>|</span>
        <p className="flex items-center gap-1">
          <CalendarIcon className="w-5 h-5" />
          <span>
            Accepting till {new Date(grant.proposalDeadline).toDateString()}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        {grant.tags?.map((tag) => (
          <span key={tag} className="px-3 py-2 bg-gray-800 rounded-xl text-xs">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex">
        <div className="flex border-r border-gray-800 gap-2 pr-4">
          <div className="bg-cyan-900 rounded-full w-11 h-11 flex justify-center items-center text-xl">
            $
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-xs">
              Avg grant amount per proposal
            </span>
            <span className="font-semibold">
              ${getNumberWithCommas(grant.recommendedSeekingAmountInUsd || 0)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-4 ">
          <div className="bg-pink-900 rounded-full w-11 h-11 flex items-center justify-center">
            <FundingMethodIcon className="w-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{fundingMethodData.heading}</span>
            <span className="text-gray-500 text-xs">
              {fundingMethodData.subHeading}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info
