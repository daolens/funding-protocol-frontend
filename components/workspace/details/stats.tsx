import { WorkspaceStatsType } from '@lib/types/workspace'
import React from 'react'

type StatProps = {
  label: string
  data: string | number
}

const Stat = ({ data, label }: StatProps) => (
  <div className="flex flex-col gap-2">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="font-semibold text-gray-300 text-2xl">{data}</span>
  </div>
)

const Stats = ({
  totalApplicants,
  totalGrantReceipients,
}: WorkspaceStatsType) => {
  return (
    <div className="bg-gray-800 border border-gray-800 bg-opacity-20 rounded-xl flex flex-col p-5 gap-6 h-fit">
      <Stat data={totalGrantReceipients} label="Total Grant receipients" />
      <Stat data={totalApplicants} label="Total Applicants" />
    </div>
  )
}

export default Stats
