import DynamicInputList from '@components/common/dynamic-input-list'
import { PROPOSAL_GRANT_FORM_FIELDS } from '@lib/constants/grants'
import { DynamicInputItemType } from '@lib/types/common'
import { ProposalGrantFormFieldType } from '@lib/types/grants'
import classNames from 'classnames'
import { Dispatch, SetStateAction, useState } from 'react'

type Props = {
  proposalFields: ProposalGrantFormFieldType[]
  setProposalFields: Dispatch<SetStateAction<ProposalGrantFormFieldType[]>>
  customProposalFields: DynamicInputItemType[]
  setCustomProposalFields: Dispatch<SetStateAction<DynamicInputItemType[]>>
  error?: string
}

const ProposalFormDetails = ({
  customProposalFields,
  proposalFields,
  setCustomProposalFields,
  setProposalFields,
  error,
}: Props) => {
  const [isModify, setIsModify] = useState(false)

  const toggleField = (field: ProposalGrantFormFieldType) => {
    if (proposalFields.includes(field))
      setProposalFields((prev) =>
        prev.filter((currField) => currField !== field)
      )
    else setProposalFields((prev) => [...prev, field])
  }

  const selectedFields = [
    ...proposalFields,
    ...customProposalFields.map((field) => field.text),
  ].filter((field) => field)

  return (
    <div className="flex flex-col bg-gray-800 bg-opacity-20 border border-gray-800 px-3 py-4 rounded-xl gap-3">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-400">
          What details are required in the proposal?
        </label>
        {isModify && (
          <button
            className="text-indigo-500 text-sm hover:underline"
            onClick={() => setIsModify(false)}
          >
            Save Form
          </button>
        )}
      </div>

      {!isModify && (
        <div className="flex gap-1 flex-wrap">
          {selectedFields.map((field) => (
            <span
              key={field}
              className="text-xs text-white px-3 py-2 bg-gray-800 bg-opacity-20 border border-gray-800 rounded-xl"
            >
              {field}
            </span>
          ))}
          <button
            className="text-indigo-500 text-sm hover:underline"
            onClick={() => setIsModify(true)}
          >
            + Modify Form
          </button>
        </div>
      )}
      {isModify && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-3 gap-3">
            {PROPOSAL_GRANT_FORM_FIELDS.map((field) => (
              <button
                key={field}
                className="flex justify-between border border-gray-800 rounded-xl px-3 py-2 items-center"
                onClick={() => toggleField(field)}
              >
                <span
                  className={classNames({
                    'text-white': proposalFields.includes(field),
                    'text-gray-600': !proposalFields.includes(field),
                  })}
                >
                  {field}
                </span>
                <input
                  id={field}
                  aria-describedby={field}
                  name={field}
                  type="checkbox"
                  className="h-4 w-4 rounded bg-gray-800 bg-opacity-20 border-gray-800 text-indigo-600 focus:ring-indigo-500"
                  checked={proposalFields.includes(field)}
                />
              </button>
            ))}
          </div>
          <DynamicInputList
            items={customProposalFields}
            setItems={setCustomProposalFields}
            inputProps={{ placeholder: 'Custom Question Field' }}
          />
        </div>
      )}

      <p className="mt-1 text-sm text-red-600" >
        {error}
      </p>
    </div>
  )
}

export default ProposalFormDetails
