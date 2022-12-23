import { ApplicationSectionType } from '@lib/types/application'
import { Dispatch, SetStateAction } from 'react'

const TABS: { name: string; id: ApplicationSectionType }[] = [
  { name: 'Milestone Reporting', id: 'milestone-reporting' },
  { name: 'Applications', id: 'application' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Props = {
  selectedTab: ApplicationSectionType
  setSelectedTab: Dispatch<SetStateAction<ApplicationSectionType>>
}

export default function ApplicationSectionTabs({
  selectedTab,
  setSelectedTab,
}: Props) {
  return (
    <div>
      <div className="border-b border-gray-800">
        <nav className="-mb-px flex space-x-0" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              onClick={() => setSelectedTab(tab.id)}
              key={tab.name}
              className={classNames(
                selectedTab === tab.id
                  ? 'border-indigo-500 text-indigo-500'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300',
                'whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm'
              )}
              aria-current={selectedTab === tab.id ? 'page' : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
