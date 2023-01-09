import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { WalletAddressType } from '@lib/types/common'
import { ApplicationType } from '@lib/types/grants'
import { getListOfStatuses } from '@lib/utils/application'
import { getTruncatedWalletAddress } from '@lib/utils/common'
import React, { useState } from 'react'
import { useEnsName } from 'wagmi'

export type StatusProps = {
  title: string
  content?: string
  sender?: WalletAddressType
  timestamp?: string
  color: 'yellow' | 'green'
}

const Status = ({ timestamp, title, content, sender }: StatusProps) => {
  const { data: ensName } = useEnsName({ address: sender })
  const formatedTimestamp = timestamp
    ? `${new Date(timestamp).toLocaleTimeString()}, ${new Date(
        timestamp
      ).toLocaleDateString()}`
    : ''
  return (
    <div className="flex flex-col gap-2 items-start border-b border-gray-800 pb-3">
      <h3 className="text-gray-300 text-lg">{title}</h3>
      {content && <p className="text-xs text-gray-400">{content}</p>}
      {(sender || timestamp) && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          {sender && (
            <>
              <span>{ensName || getTruncatedWalletAddress(sender)}</span>
              <span>•</span>
            </>
          )}
          {formatedTimestamp && <span>{formatedTimestamp}</span>}
        </div>
      )}
    </div>
  )
}
type Props = {
  application: ApplicationType
  isReviewer: boolean
}

const MilestoneStatuses = ({ application }: Props) => {
  const [isShowAll, setIsShowAll] = useState(false)
  const statuses = getListOfStatuses(application.milestones)

  return (
    <div
      className="border border-gray-800 p-5 rounded-xl col-span-2 gap-3 flex flex-col"
      style={{
        background:
          statuses[0].color === 'yellow'
            ? 'linear-gradient(229.78deg, rgba(207, 144, 21, 0.12) -1.73%, rgba(0, 0, 0, 0) 86.75%)'
            : 'linear-gradient(229.78deg, rgba(84, 162, 57, 0.12) -1.73%, rgba(0, 0, 0, 0) 86.75%)',
      }}
    >
      <div className="flex flex-col gap-3">
        {statuses
          .filter((_, index) => isShowAll || index === 0)
          .map((status) => (
            <Status {...status} key={status.timestamp} />
          ))}
      </div>
      <button
        className="inline-flex text-xs text-gray-500 items-center justify-center gap-1"
        onClick={() => setIsShowAll((prev) => !prev)}
      >
        {isShowAll ? 'View current status' : 'View all status'}
        {isShowAll ? (
          <ChevronUpIcon className="text-gray-500 w-3" />
        ) : (
          <ChevronDownIcon className="text-gray-500 w-3" />
        )}
      </button>
    </div>
  )
}

export default MilestoneStatuses
