import ApplicationCard from '@components/grants/details/sections/application-card'
import { APPLICATION_STATUS_OBJ } from '@lib/constants/grants'
import { WalletAddressType } from '@lib/types/common'
import { ApplicationStatusType, ApplicationType } from '@lib/types/grants'
import classNames from 'classnames'
import React, { useState } from 'react'

type PillProps = {
  label: string
  color?: 'yellow' | 'cyan' | 'red' | 'green'
  onClick: () => void
  isActive: boolean
}

const Pill = ({ color, label, onClick, isActive }: PillProps) => (
  <button
    onClick={onClick}
    className={classNames(
      'rounded-full bg-gray-800 flex items-center py-2 px-4 border text-sm gap-2 hover:border-indigo-800',
      {
        'border-indigo-500': isActive,
        'border-gray-800 text-gray-500': !isActive,
      }
    )}
  >
    {color && (
      <span
        className={classNames('h-2 w-2 rounded-full', {
          'bg-yellow-500': color === 'yellow',
          'bg-cyan-500': color === 'cyan',
          'bg-red-500': color === 'red',
        })}
      />
    )}
    <span>{label}</span>
  </button>
)

type Props = {
  applications: ApplicationType[]
}

const ApplicationList = ({ applications }: Props) => {
  const [activeStatus, setActiveStatus] = useState<
    ApplicationStatusType | 'All'
  >('All')

  const filteredApplications = applications.filter(
    (application) =>
      activeStatus === 'All' || application.status === activeStatus
  )

  const filters: ApplicationStatusType[] = ['Submitted', 'Approved', 'Rejected']

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Pill
          isActive={activeStatus === 'All'}
          label="All"
          onClick={() => setActiveStatus('All')}
        />
        {filters.map((status) => (
          <Pill
            key={status}
            label={APPLICATION_STATUS_OBJ[status].label}
            isActive={status === activeStatus}
            onClick={() => setActiveStatus(status)}
            color={APPLICATION_STATUS_OBJ[status].color}
          />
        ))}
      </div>
      {filteredApplications.map((application) => (
        <ApplicationCard
          title={application.name}
          status={application.status as ApplicationStatusType}
          applicantWalletAddress={
            application.walletAddress as WalletAddressType
          }
          key={application.id}
          id={application.id as string}
        />
      ))}
    </div>
  )
}

export default ApplicationList
