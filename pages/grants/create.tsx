import Background from '@components/common/background'
import DatePicker from '@components/common/date-picker'
import Input from '@components/common/input-with-trailing-icon'
import TokenAmountInput from '@components/common/token-amount-input'
import VotingRadioSelect from '@components/grants/create/voting-radio-buttons'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { SelectionProcessType } from '@lib/types/grant'
import React, { useState } from 'react'

const Create = () => {
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [proposalDeadline, setProposalDeadline] = useState<string | null>(null)
  const [selectionProcess, setSelectionProcess] =
    useState<SelectionProcessType | null>(null)
  const [treasuryAmount, setTreasuryAmount] = useState<number | null>(null)
  const [tokenName, setTokenName] = useState('Ethereum')

  const onPublish = () => {
    console.log('publish')
  }

  return (
    <Background>
      <div className="flex flex-col gap-8 py-9">
        <button className="text-gray-400 text-sm self-start flex items-center gap-2 hover:underline">
          <ArrowLeftIcon className="w-4 stroke-2" />
          Back
        </button>
        <Input
          label="Give your grant a title"
          placeholder="Eg. Climate Focus Grants - S1"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          className="bg-opacity-20 border border-gray-800"
        />
        <Input
          label="Describe what you are looking for in a good proposal"
          placeholder="Eg. Projects that boost the ecosystem with a deep focus on the climate"
          value={subTitle}
          onChange={(e) => setSubTitle(e.currentTarget.value)}
          className="bg-opacity-20 border border-gray-800"
        />
        <VotingRadioSelect
          selectionProcess={selectionProcess}
          setSelectionProcess={setSelectionProcess}
        />
        <div className="grid grid-cols-2 gap-4">
          <TokenAmountInput
            amount={treasuryAmount}
            setAmount={setTreasuryAmount}
            setTokenName={setTokenName}
            tokenName={tokenName}
          />
          <DatePicker
            label="Accepting till"
            className="bg-opacity-20 border border-gray-800"
            value={
              proposalDeadline
                ? new Date(proposalDeadline as string)
                    ?.toISOString()
                    ?.split('T')[0]
                : ''
            }
            onChange={(e) =>
              setProposalDeadline(new Date(e.currentTarget.value).toISOString())
            }
            min={new Date().toISOString()?.split('T')[0]}
          />
        </div>
      </div>
      <div className="w-full max-w-7xl fixed mx-auto left-0 right-0 bottom-0 mb-6 px-4">
        <div className="flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 ">
          <button
            type="button"
            onClick={onPublish}
            className="inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start"
          >
            Publish
            <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Background>
  )
}

export default Create
