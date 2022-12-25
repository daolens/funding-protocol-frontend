import { CalendarIcon } from '@heroicons/react/24/solid'
import { ApplicationMilestoneType, FundingMethodType } from '@lib/types/grants'
import { getNumberWithCommas } from '@lib/utils/common'
import classNames from 'classnames'
import React from 'react'

export const ApplicationCard = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <div className="bg-gray-800 bg-opacity-20 border border-gray-800 p-5 rounded-xl">
    {children}
  </div>
)

type Props = {
  seekingFunds: number
  deadline: string
  milestones: ApplicationMilestoneType[]
  fundingMethod: FundingMethodType
}

const SideInfoBar = ({
  deadline,
  milestones,
  seekingFunds,
  fundingMethod,
}: Props) => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <ApplicationCard>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-500">Seeking Funds</span>
          <span className="font-semibold text-2xl">
            ${getNumberWithCommas(seekingFunds)}
          </span>
        </div>
      </ApplicationCard>
      <ApplicationCard>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          <p className="text-sm">
            Project Deadline:{' '}
            <span className="text-indigo-500">
              {new Date(deadline).toDateString()}
            </span>
          </p>
        </div>
      </ApplicationCard>
      {fundingMethod === 'MILESTONE' && milestones.length > 0 && (
        <ApplicationCard>
          <div className="flex flex-col">
            {milestones.map((milestone, index) => (
              <div
                className={classNames(
                  'flex flex-col gap-4',
                  index !== milestones.length - 1 &&
                    'pb-6 border-b border-gray-800',
                  index !== 0 && 'pt-6'
                )}
                key={milestone.id}
              >
                <p className="text-xs font-semibold text-gray-500">
                  MILESTONE {index + 1} -{' '}
                  <span className="text-indigo-500 font-bold">
                    ${getNumberWithCommas((milestone.funds as number) || 0)}
                  </span>
                </p>
                <p className="font-semibold">{milestone.text}</p>
              </div>
            ))}
          </div>
        </ApplicationCard>
      )}
    </div>
  )
}

export default SideInfoBar
