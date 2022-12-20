import { RadioGroup } from '@headlessui/react'
import { ArrowUpRightIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { FundingMethodType } from '@lib/types/grants'

const FUNDING_OPTIONS = [
  {
    id: 'UPFRONT',
    title: 'Upfront',
    description: 'As soon as proposals are approved',
    icon: (
      <div className="bg-pink-200 rounded-full p-3">
        <ArrowUpRightIcon className="w-5 text-pink-800 stroke-2" />
      </div>
    ),
  },
  {
    id: 'MILESTONE',
    title: 'Milestone',
    description: 'Split into multiple progressive steps',
    icon: (
      <div className="bg-yellow-200 rounded-full p-3">
        <ListBulletIcon className="w-5 text-yellow-800 stroke-2" />
      </div>
    ),
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Props = {
  fundingMethod: FundingMethodType | null
  setFundingMethod: React.Dispatch<
    React.SetStateAction<FundingMethodType | null>
  >
  error?: string
}

export default function FundingRadioSelect({
  fundingMethod: selectionProcess,
  setFundingMethod: setSelectionProcess,
  error,
}: Props) {
  return (
    <RadioGroup value={selectionProcess} onChange={setSelectionProcess}>
      <RadioGroup.Label className="text-sm font-medium text-gray-400">
        Select funding method
      </RadioGroup.Label>

      <div className="mt-2 grid grid-cols-2 gap-y-6 gap-x-4">
        {FUNDING_OPTIONS.map((votingOption) => (
          <RadioGroup.Option
            key={votingOption.id}
            value={votingOption.id}
            className={({ checked, active }) =>
              classNames(
                checked ? 'border-indigo-500' : 'border-gray-800',
                active ? 'border-indigo-500 ring-2 ring-indigo-500' : '',
                'relative flex cursor-pointer rounded-xl border bg-gray-800 bg-opacity-20 p-4 shadow-sm focus:outline-none gap-3'
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

      <p className="mt-1 text-sm text-red-600">{error}</p>
    </RadioGroup>
  )
}
