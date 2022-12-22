import Background from '@components/common/background'
import DatePicker from '@components/common/date-picker'
import DynamicInputList from '@components/common/dynamic-input-list'
import Input from '@components/common/input-with-trailing-icon'
import Textarea from '@components/common/textarea'
import FundingRadioSelect from '@components/grants/create/funding-radio-buttons'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { DynamicInputItemType, WalletAddressType } from '@lib/types/common'
import { FundingMethodType, GrantType } from '@lib/types/grants'
import {
  postGrantDataAndCallSmartContractFn,
  validateGrantData,
} from '@lib/utils/grants'
import { nanoid } from 'nanoid'
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import cogoToast from 'cogo-toast'
import TokenAmountInput from '@components/common/token-amount-input'
import MultiSelect from '@components/common/multi-select'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import BackButton from '@components/common/back-button'

type Props = {
  workspaceTitle: string
}

const Create = ({ workspaceTitle = 'Workspace' }: Props) => {
  const grantMutation = useMutation({
    mutationFn: (data: GrantType) => postGrantDataAndCallSmartContractFn(data),
    onSuccess: () => cogoToast.success('Grant created successfully'),
    onError: (error) => {
      console.error(error)
      cogoToast.error('Something went wrong while creating grant.')
    },
  })
  const router = useRouter()
  const workspaceId = router.query.workspaceId as string

  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [proposalDeadline, setProposalDeadline] = useState<string | null>(null)
  const [fundingMethod, setFundingMethod] = useState<FundingMethodType | null>(
    null
  )
  const [tags, setTags] = useState<string[]>([])
  const [tokenName, setTokenName] = useState('Aave')
  const [selectedReviewers, setSelectedReviewers] = useState<
    DynamicInputItemType[]
  >([{ id: nanoid(), text: '' }])
  const [fieldErrors, setFieldErrors] = useState<
    Record<keyof GrantType, string>
  >({} as any)
  const [amount, setAmount] = useState<number | null>(null)

  const onPublish = () => {
    setFieldErrors({} as any)
    const grant: GrantType = {
      workspaceId: router.query.workspaceId as string,
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

    const errors = validateGrantData(grant)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    grantMutation.mutate(grant)
  }

  const onBack = () => router.push(`/workspaces/${workspaceId}`)

  return (
    <Background>
      <div className="flex flex-col gap-8 py-9 mb-24">
        <BackButton onBack={onBack} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{workspaceTitle}/</span>
            <h1 className="text-2xl font-bold">New Grant</h1>
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
        <Textarea
          label={`Describe what you are looking for in a good proposal (${subTitle.length}/300)`}
          placeholder="Eg. Projects that boost the ecosystem with a deep focus on the climate"
          value={subTitle}
          onChange={(e) => setSubTitle(e.currentTarget.value)}
          error={fieldErrors['subTitle']}
        />
        <div className="grid grid-cols-2 gap-4">
          <TokenAmountInput
            setTokenName={setTokenName}
            tokenName={tokenName}
            amount={amount}
            setAmount={setAmount}
            error={fieldErrors['recommendedSeekingAmount']}
          />
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
        <DynamicInputList
          inputProps={{ placeholder: 'Paste reviewer’s wallet/ENS address' }}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const { workspaceId } = query
  const { workspace } = await fetchWorkspaceById(workspaceId as any)

  const workspaceTitle = workspace.communityName

  return { props: { workspaceTitle } as Props }
}

export default Create
