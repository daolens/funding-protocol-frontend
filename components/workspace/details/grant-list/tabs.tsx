import { GrantStatusType } from '@lib/types/workspace'
import { Dispatch, SetStateAction } from 'react'

const TABS: { name: string; id: GrantStatusType }[] = [
  { name: 'Open', id: 'open' },
  { name: 'Closed', id: 'close' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Props = {
  selectedTab: GrantStatusType
  setSelectedTab: Dispatch<SetStateAction<GrantStatusType>>
}

export default function GrantTabs({ selectedTab, setSelectedTab }: Props) {
  return (
    <div>
      <div className="border-b border-gray-700">
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
