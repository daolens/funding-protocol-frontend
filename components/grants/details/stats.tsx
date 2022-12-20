import React from 'react'

type Props = {
  approvedCount: number
  applicantCount: number
}

const Stats = ({ applicantCount, approvedCount }: Props) => {
  return (
    <div className="bg-gray-800 bg-opacity-20 border-gray-800 border p-5 rounded-xl flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Grants Approved</span>
        <span className="text-2xl font-semibold">{approvedCount}</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Applicants</span>
        <span className="text-2xl font-semibold">{applicantCount}</span>
      </div>
    </div>
  )
}

export default Stats
