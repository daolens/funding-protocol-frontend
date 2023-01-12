import BackButton from '@components/common/back-button'
import Background from '@components/common/background'
import DatePicker from '@components/common/date-picker'
import DynamicInputList from '@components/common/dynamic-input-list'
import Input from '@components/common/input-with-trailing-icon'
import MultiSelect from '@components/common/multi-select'
import Navbar from '@components/common/navbar'
import RichTextEditor from '@components/common/rich-text/rich-text-editor'
import TokenAmountInput from '@components/common/token-amount-input'
import FundingRadioSelect from '@components/grants/create/funding-radio-buttons'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { DynamicInputItemType, WalletAddressType } from '@lib/types/common'
import { FundingMethodType, GrantType } from '@lib/types/grants'
import { removeTagsFromHtmlString } from '@lib/utils/common'
import { validateGrantData } from '@lib/utils/grants'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type Props = {
  onBack: () => void
  workspaceTitle: string
  mutate: (data: GrantType) => void
  grant?: GrantType
  isUpdateForm?: boolean
  isLoading?: boolean
}

const Form = ({
  onBack,
  workspaceTitle,
  mutate,
  grant,
  isUpdateForm,
  isLoading,
}: Props) => {
  const router = useRouter()

  const [title, setTitle] = useState(grant?.title || '')
  const [subTitle, setSubTitle] = useState(grant?.subTitle || '')
  const [proposalDeadline, setProposalDeadline] = useState<string | null>(
    grant?.proposalDeadline || null
  )
  const [fundingMethod, setFundingMethod] = useState<FundingMethodType | null>(
    grant?.fundingMethod || null
  )
  const [tags, setTags] = useState<string[]>(grant?.tags || [])
  const [tokenName, setTokenName] = useState(grant?.token || 'Aave')
  const [selectedReviewers, setSelectedReviewers] = useState<
    DynamicInputItemType[]
  >(
    grant?.reviewers.map((item) => ({ id: nanoid(), text: item })) || [
      { id: nanoid(), text: '' },
    ]
  )
  const [amount, setAmount] = useState<number | null>(
    grant?.recommendedSeekingAmount || null
  )
  const [fieldErrors, setFieldErrors] = useState<
    Record<keyof GrantType, string>
  >({} as any)

  const onPublish = () => {
    setFieldErrors({} as any)
    const _grant: GrantType = {
      workspaceId: router.query.workspaceId as string,
      address: grant?.address || undefined,
      title,
      subTitle,
      tags,
      proposalDeadline: proposalDeadline as string,
      fundingMethod: fundingMethod as FundingMethodType,
      selectionProcess: 'committee',
      recommendedSeekingAmount: amount || 0,
      token: tokenName,
      reviewers: selectedReviewers
        .filter((reviewrItem) => reviewrItem.text)
        .map((reviewerItem) => reviewerItem.text as WalletAddressType),
    }

    const errors = validateGrantData(_grant)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    mutate(_grant)
  }

  return (
    <Background>
      <Navbar />
      <div className="flex flex-col gap-8 py-9 pb-36">
        <BackButton onBack={onBack} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{workspaceTitle}/</span>
            <h1 className="text-2xl font-bold">
              {isUpdateForm ? 'Update Grant' : 'New Grant'}
            </h1>
          </div>
        </div>
        <Input
          label="Give your grant a title"
          placeholder="Eg. Climate Focus Grants - S1"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          error={fieldErrors['title']}
        />
        <MultiSelect
          // TODO: update
          options={['💰 DeFi', '🌱 Ecosystem', '👥 Social']}
          selected={tags}
          setSelected={setTags}
          error={fieldErrors['tags']}
          label="Add tags"
          placeholder="Select which category your grants fall under"
        />
        <RichTextEditor
          content={subTitle}
          setContent={setSubTitle}
          label={`Describe what you are looking for in a good proposal  (${
            removeTagsFromHtmlString(subTitle).length
          }/300)`}
          placeholder="Eg. Projects that boost the ecosystem with a deep focus on the climate"
          error={fieldErrors['subTitle']}
        />
        <div
          className={classNames('grid gap-4', {
            'grid-cols-1': isUpdateForm,
            'grid-cols-2': !isUpdateForm,
          })}
        >
          {!isUpdateForm && (
            <TokenAmountInput
              setTokenName={setTokenName}
              tokenName={tokenName}
              amount={amount}
              setAmount={setAmount}
              error={fieldErrors['recommendedSeekingAmount']}
            />
          )}
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
        {!isUpdateForm && (
          <FundingRadioSelect
            fundingMethod={fundingMethod}
            setFundingMethod={setFundingMethod}
            error={fieldErrors['fundingMethod']}
          />
        )}
        <DynamicInputList
          inputProps={{ placeholder: "Paste reviewer's wallet/ENS address" }}
          items={selectedReviewers}
          setItems={setSelectedReviewers}
          error={fieldErrors['reviewers']}
          label="Add reviewers"
        />
      </div>
      <div className="w-full max-w-7xl fixed mx-auto left-0 right-0 bottom-0 mb-6 px-8">
        <div className="flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
          <button
            type="button"
            onClick={onPublish}
            disabled={isLoading}
            className={classNames(
              'inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start',
              {
                'cursor-not-allowed opacity-50': isLoading,
              }
            )}
          >
            {isUpdateForm ? 'Update' : 'Publish'}
            <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Background>
  )
}

export default Form
