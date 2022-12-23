import { CheckCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid'
import { ApplicationMilestoneType } from '@lib/types/grants'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'

type Props = {
  milestones: ApplicationMilestoneType[]
  completedMilestoneCount?: number
}

const MilestoneReporting = ({
  milestones,
  completedMilestoneCount = 1,
}: Props) => {
  const [milestoneId, setMilestoneId] = useState('')
  return (
    <>
      <div className="border border-solid border-gray-800 rounded-xl backdrop-blur h-12 flex items-center p-5 font-medium">
        <CurrencyDollarIcon className="w-4 mr-1.5" />
        Total funds promised for the application
        <span className="text-indigo-500 ml-auto font-medium">
          $
          {milestones?.reduce((value, milestone) => {
            return value + (milestone?.funds ? milestone.funds : 0)
          }, 0)}
        </span>
      </div>
      {completedMilestoneCount > 0 && (
        <div className="text-sm text-gray-400">COMPLETED MILESTONES</div>
      )}
      <div className="flex flex-col gap-8 relative">
        <div className="absolute h-full w-0 border border-gray-800 left-8 -z-10"></div>
        {milestones.map((milestone, id) => {
          if (completedMilestoneCount < id + 1) {
            return null
          }
          let opacity =
            id < completedMilestoneCount
              ? '50'
              : id > completedMilestoneCount
              ? '30'
              : ''
          return (
            <div className="rounded-xl border border-gray-800  bg-gray-800/20 backdrop-blur">
              <div
                className={`h-20 bg-gray-800 rounded-xl px-5 flex items-center gap-4  ${
                  id <= completedMilestoneCount
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
                }`}
                onClick={() => {
                  if (id <= completedMilestoneCount)
                    setMilestoneId((prev) =>
                      prev === milestone.id ? '' : milestone.id
                    )
                }}
              >
                <CheckCircleIcon
                  className={`w-8 text-green-500 opacity-${opacity}`}
                />

                <div
                  className={`w-4/6  overflow-hidden whitespace-pre-wrap opacity-${opacity}`}
                >
                  {milestone.text}
                </div>
                <span className={`ml-auto font-medium opacity-${opacity}`}>
                  ${milestone.funds}
                </span>
              </div>
              {milestoneId === milestone.id && (
                <div className="p-5 ">
                  {milestone.text}
                  <p className="whitespace-pre-wrap h-full break-words text-gray-500 max-h-[300px] overflow-y-auto mb-4">
                    sdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdsc
                    sdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdsc
                  </p>
                  <div className="space-x-3 flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
                    <button
                      className={classNames(
                        'inline-flex items-center rounded-xl border border-transparent bg-red-900 px-4 py-3 text-sm font-medium shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 justify-center text-red-400'
                      )}
                    >
                      Send back with feedback
                    </button>
                    <button
                      className={classNames(
                        'inline-flex items-center rounded-xl border border-transparent bg-green-900 px-4 py-3 text-sm font-medium shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 justify-center text-green-400'
                      )}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {completedMilestoneCount > 0 &&
        completedMilestoneCount < milestones.length && (
          <div className="text-sm text-gray-400">UPCOMING MILESTONES</div>
        )}
      <div className="flex flex-col gap-8 relative">
        <div className="absolute h-full w-0 border border-gray-800 left-8 -z-10"></div>
        {milestones.map((milestone, id) => {
          if (completedMilestoneCount > id) {
            return null
          }
          let opacity =
            id < completedMilestoneCount
              ? '50'
              : id > completedMilestoneCount
              ? '30'
              : ''
          console.log(opacity)
          return (
            <div className="rounded-xl border border-gray-800  bg-gray-800/20 backdrop-blur ">
              <div
                className={`h-20 bg-gray-800 rounded-xl px-5 flex items-center gap-4 ${
                  id <= completedMilestoneCount
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
                }`}
                onClick={() => {
                  if (id <= completedMilestoneCount)
                    setMilestoneId((prev) =>
                      prev === milestone.id ? '' : milestone.id
                    )
                }}
              >
                <div
                  className={`bg-indigo-500 h-6 w-6 flex items-center justify-center rounded-xl opacity-${opacity}`}
                >
                  {id + 1}
                </div>
                <div
                  className={`w-4/6  overflow-hidden whitespace-pre-wrap opacity-${opacity}`}
                >
                  {milestone.text}
                </div>
                <span className={`ml-auto font-medium opacity-${opacity}`}>
                  ${milestone.funds}
                </span>
              </div>
              {milestoneId === milestone.id && (
                <div className="p-5 ">
                  {milestone.text}
                  <p className="whitespace-pre-wrap h-full break-words text-gray-500 max-h-[300px] overflow-y-auto mb-4">
                    sdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdsc
                    sdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdscsdhjbcjhdsbcjhdsbcjhdsbcjhdsc
                  </p>
                  <div className="space-x-3 flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
                    <button
                      className={classNames(
                        'inline-flex items-center rounded-xl border border-transparent bg-red-900 px-4 py-3 text-sm font-medium shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 justify-center text-red-400'
                      )}
                    >
                      Send back with feedback
                    </button>
                    <button
                      className={classNames(
                        'inline-flex items-center rounded-xl border border-transparent bg-green-900 px-4 py-3 text-sm font-medium shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 justify-center text-green-400'
                      )}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default MilestoneReporting
