import ApplicationList from '@components/grants/details/sections/application-list'
import GrantSectionTabs from '@components/grants/details/sections/tabs'
import { ApplicationType, GrantSectionType } from '@lib/types/grants'
import React, { useState } from 'react'

type Props = {
  description: string
  applications: ApplicationType[]
}

const Sections = ({ applications, description }: Props) => {
  const [selectedTab, setSelectedTab] = useState<GrantSectionType>('about')
  return (
    <div className="flex flex-col gap-4">
      <GrantSectionTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab === 'about' && <p className="text-sm">{description}</p>}
      {selectedTab === 'applications' && (
        <ApplicationList applications={applications} />
      )}
    </div>
  )
}

export default Sections
