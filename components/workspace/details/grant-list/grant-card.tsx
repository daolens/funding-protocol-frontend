import {
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { GrantType } from '@lib/types/grants'
import { getNumberWithCommas, getTokenSymbol } from '@lib/utils/common'
import Link from 'next/link'
import React from 'react'

type InfoProps = {
  icon: 'calendar' | 'currency-dollar' | 'user'
  text: string
}

const Info = ({ icon, text }: InfoProps) => {
  const Icon =
    icon === 'calendar'
      ? CalendarIcon
      : icon === 'currency-dollar'
      ? CurrencyDollarIcon
      : UserIcon
  return (
    <div className="flex text-gray-500 text-sm items-center gap-1">
      <Icon className="w-3 h-3" />
      <span>{text}</span>
    </div>
  )
}

const GrantCard = ({
  title,
  applicantCount,
  proposalDeadline,
  treasuryAmount,
  token,
  tags,
  workspaceId,
  address,
}: GrantType) => {
  const tokenSymbol = getTokenSymbol(token)

  return (
    <Link
      href={`/workspaces/${workspaceId}/grants/${address}`}
      className="flex flex-col bg-gray-800 bg-opacity-50 border-gray-800 border hover:border-indigo-500 p-5 rounded-xl gap-3"
      type="button"
    >
      <h3>{title}</h3>
      <div className="flex items-center gap-2">
        <Info
          icon="calendar"
          text={`Accepting till ${new Date(proposalDeadline).toDateString()}`}
        />
        <span className="text-gray-500 text-xs">|</span>
        <Info
          icon="currency-dollar"
          text={`Avg grant of ${tokenSymbol} ${getNumberWithCommas(
            treasuryAmount || 0
          )}`}
        />
        <span className="text-gray-500 text-xs">|</span>
        <Info icon="user" text={`${applicantCount} Applicants`} />
      </div>
      <div className="flex items-center gap-2">
        {tags?.map((tag) => (
          <span key={tag} className="px-3 py-2 bg-gray-800 rounded-xl text-xs">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

export default GrantCard
