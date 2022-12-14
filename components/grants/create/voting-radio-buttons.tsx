import { RadioGroup } from '@headlessui/react'
import { BuildingLibraryIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { SelectionProcessType } from '@lib/types/grant'

const VOTING_OPTIONS = [
  {
    id: 'community',
    title: 'Community voting',
    description: 'DAO members can vote on the proposal',
    icon: (
      <div className="bg-pink-200 rounded-full p-3">
        <BuildingLibraryIcon className="w-5 text-pink-800" />
      </div>
    ),
  },
  {
    id: 'committee',
    title: 'Committee voting',
    description: 'Assigned to a certain set of people',
    icon: (
      <div className="bg-yellow-200 rounded-full p-3">
        <UserGroupIcon className="w-5 text-yellow-800" />
      </div>
    ),
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Props = {
  selectionProcess: SelectionProcessType | null
  setSelectionProcess: React.Dispatch<
    React.SetStateAction<SelectionProcessType | null>
  >
}

export default function VotingRadioSelect({
  selectionProcess,
  setSelectionProcess,
}: Props) {
  return (
    <RadioGroup value={selectionProcess} onChange={setSelectionProcess}>
      <RadioGroup.Label className="text-sm font-medium text-gray-400">
        Select a mailing list
      </RadioGroup.Label>

      <div className="mt-2 grid grid-cols-2 gap-y-6 gap-x-4">
        {VOTING_OPTIONS.map((votingOption) => (
          <RadioGroup.Option
            key={votingOption.id}
            value={votingOption.id}
            className={({ checked, active }) =>
              classNames(
                checked ? 'border-indigo-500' : 'border-gray-800',
                active ? 'border-indigo-500 ring-2 ring-indigo-500' : '',
                'relative flex cursor-pointer rounded-lg border bg-gray-800 bg-opacity-20 p-4 shadow-sm focus:outline-none gap-3'
              )
            }
          >
            {() => (
              <>
                {votingOption.icon}
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="block font-medium text-white"
                    >
                      {votingOption.title}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-xs text-gray-500"
                    >
                      {votingOption.description}
                    </RadioGroup.Description>
                  </span>
                </span>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
