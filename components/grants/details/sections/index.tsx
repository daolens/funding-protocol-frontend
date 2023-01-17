import DisplayRichText from '@components/common/rich-text/display-rich-text'
import ApplicationList from '@components/grants/details/sections/application-list'
import GrantSectionTabs from '@components/grants/details/sections/tabs'
import useOnlyScrollableContainer from '@hooks/useOnlyScrollableContainer'
import { ApplicationType, GrantSectionType } from '@lib/types/grants'
import React, { useState } from 'react'

type Props = {
  description: string
  applications: ApplicationType[]
}

const Sections = ({ applications, description }: Props) => {
  const listContainerRef = useOnlyScrollableContainer()
  const [selectedTab, setSelectedTab] = useState<GrantSectionType>('about')
  return (
    <div className="flex flex-col">
      <GrantSectionTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <div className="flex flex-col gap-4 pt-4" ref={listContainerRef}>
        {selectedTab === 'about' && <DisplayRichText content={description} />}
        {selectedTab === 'applications' && (
          <ApplicationList applications={applications} />
        )}
      </div>
    </div>
  )
}

export default Sections
