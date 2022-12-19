import Background from '@components/common/background'
import DatePicker from '@components/common/date-picker'
import DynamicInputList from '@components/common/dynamic-input-list'
import Input from '@components/common/input-with-trailing-icon'
import Textarea from '@components/common/textarea'
import TokenDropdown from '@components/common/token-dropdown'
import ProposalFormDetails from '@components/grants/create/required-details'
import FundingRadioSelect from '@components/grants/create/funding-radio-buttons'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { DynamicInputItemType, WalletAddressType } from '@lib/types/common'
import {
  FundingMethodType,
  GrantType,
  ProposalGrantFormFieldType,
} from '@lib/types/grants'
import {
  postGrantDataAndCallSmartContractFn,
  validateGrants,
} from '@lib/utils/grants'
import { nanoid } from 'nanoid'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import ReviewersMultiSelect from '@components/grants/create/reviewers-multi-select'
import { useMutation } from '@tanstack/react-query'
import cogoToast from 'cogo-toast'

const Create = () => {
  const grantMutation = useMutation({
    mutationFn: (data: GrantType) => postGrantDataAndCallSmartContractFn(data),
    onSuccess: () => cogoToast.success('Grant created successfully'),
    onError: (error) => {
      console.error(error)
      cogoToast.error('Something went wrong while creating grant.')
    },
  })

  const { address } = useAccount()

  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [proposalDeadline, setProposalDeadline] = useState<string | null>(null)
  const [fundingMethod, setFundingMethod] = useState<FundingMethodType | null>(
    null
  )
  const [tokenName, setTokenName] = useState('Ethereum')
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([])
  const [milestones, setMilestones] = useState<DynamicInputItemType[]>([
    { id: nanoid(), text: '' },
  ])
  const [proposalFields, setProposalFields] = useState<
    ProposalGrantFormFieldType[]
  >(['Email', 'Name', 'Funding'])
  const [customProposalFields, setCustomProposalFields] = useState<
    DynamicInputItemType[]
  >([{ id: nanoid(), text: '' }])
  const [fieldErrors, setFieldErrors] = useState<
    Record<keyof GrantType, string>
  >({} as any)

  const onPublish = () => {
    setFieldErrors({} as any)
    const grant: GrantType = {
      title,
      subTitle,
      proposalDeadline: proposalDeadline as string,
      fundingMethod: fundingMethod as FundingMethodType,
      customFields: customProposalFields,
      milestones,
      proposalFormFields: proposalFields,
      selectionProcess: 'committee',
      treasuryAmount: 0,
      token: tokenName,
      reviewers: [address as WalletAddressType],
    }

    const errors = validateGrants(grant)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    grantMutation.mutate(grant)
  }

  return (
    <Background>
      <div className="flex flex-col gap-8 py-9 mb-24">
        <button className="text-gray-400 text-sm self-start flex items-center gap-2 hover:underline">
          <ArrowLeftIcon className="w-4 stroke-2" />
          Back
        </button>
        <Input
          label="Give your grant a title"
          placeholder="Eg. Climate Focus Grants - S1"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={fieldErrors['title']}
        />
        <Textarea
          label={`Describe what you are looking for in a good proposal (${subTitle.length}/300)`}
          placeholder="Eg. Projects that boost the ecosystem with a deep focus on the climate"
          value={subTitle}
          onChange={(e) => setSubTitle(e.currentTarget.value)}
          error={fieldErrors['subTitle']}
        />
        <div className="grid grid-cols-2 gap-4">
          <TokenDropdown setTokenName={setTokenName} tokenName={tokenName} />
          <DatePicker
            label="Accepting till"
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
            error={fieldErrors['proposalDeadline']}
          />
        </div>
        <FundingRadioSelect
          fundingMethod={fundingMethod}
          setFundingMethod={setFundingMethod}
          error={fieldErrors['fundingMethod']}
        />
        <ReviewersMultiSelect
          // TODO: update
          reviewers={['test', 'test2', 'test3']}
          selectedReviewers={selectedReviewers}
          setSelectedReviewers={setSelectedReviewers}
          error={fieldErrors['reviewers']}
        />
        <DynamicInputList
          inputProps={{ placeholder: 'Milestone' }}
          items={milestones}
          setItems={setMilestones}
          label="Define milestone (optional)"
          infoButtnDetails={{
            text: 'Learn why',
            onClick: () => alert('TODO: add content'),
          }}
        />
        <ProposalFormDetails
          customProposalFields={customProposalFields}
          proposalFields={proposalFields}
          setCustomProposalFields={setCustomProposalFields}
          setProposalFields={setProposalFields}
          error={fieldErrors['proposalFormFields']}
        />
      </div>
      <div className="w-full max-w-7xl fixed mx-auto left-0 right-0 bottom-0 mb-6 px-8">
        <div className="flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
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
