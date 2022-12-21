import BackButton from '@components/common/back-button'
import Background from '@components/common/background'
import DatePicker from '@components/common/date-picker'
import DynamicInputList from '@components/common/dynamic-input-list'
import Input from '@components/common/input-with-trailing-icon'
import Textarea from '@components/common/textarea'
import FundsInput from '@components/grants/apply/funds-input'
import Milestones from '@components/grants/apply/milestones'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { DynamicInputItemType, WalletAddressType } from '@lib/types/common'
import { ApplicationMilestoneType, ApplicationType } from '@lib/types/grants'
import {
  postApplicationDataAndCallSmartContractFn,
  validateGrantApplicationData,
} from '@lib/utils/grants'
import { useMutation } from '@tanstack/react-query'
import cogoToast from 'cogo-toast'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type Props = {
  grantName: string
  currency: string
}

const Apply = ({
  grantName = 'Uniswap Grants: Season 02',
  currency = 'USDC',
}: Props) => {
  const applicationMutation = useMutation({
    mutationFn: (data: ApplicationType) =>
      postApplicationDataAndCallSmartContractFn(data),
    onSuccess: () => cogoToast.success('Applied successfully'),
    onError: (error) => {
      console.error(error)
      cogoToast.error('Something went wrong while applying.')
    },
  })
  const router = useRouter()
  const workspaceId = router.query.workspaceId as string
  const grantId = router.query.grantId as string

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [walletAddress, setWalletAddress] = useState<WalletAddressType | ''>('')
  const [description, setDescription] = useState('')
  const [sneekingFunds, setSneekingFunds] = useState<number | null>(null)
  const [expectedProjectDeadline, setExpectedProjectDeadline] =
    useState<string>('')
  const [links, setLinks] = useState<DynamicInputItemType[]>([
    { id: nanoid(), text: '' },
  ])
  const [teamMemberDetails, setTeamMemberDetails] = useState<
    DynamicInputItemType[]
  >([
    {
      id: nanoid(),
      text: '',
    },
  ])
  const [previousSuccessfulProposalLinks, setPreviousSuccessfulProposalLinks] =
    useState<DynamicInputItemType[]>([
      {
        id: nanoid(),
        text: '',
      },
    ])
  const [milestones, setMilestones] = useState<ApplicationMilestoneType[]>([
    {
      id: nanoid(),
      funds: null,
      text: '',
    },
  ])
  const [fieldErrors, setFieldErrors] = useState<
    Record<keyof ApplicationType, string>
  >({} as any)

  const onApply = () => {
    setFieldErrors({} as any)
    const application: ApplicationType = {
      workspaceId: router.query.workspaceId as string,
      grantAddress: router.query.grantId as string,
      description,
      email,
      expectedProjectDeadline,
      links: links.filter((item) => item.text),
      milestones,
      name,
      previousSuccessfulProposalLinks: previousSuccessfulProposalLinks.filter(
        (item) => item.text
      ),
      sneekingFunds,
      teamMemberDetails: teamMemberDetails.filter((item) => item.text),
      walletAddress,
    }

    const errors = validateGrantApplicationData(application)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    applicationMutation.mutate(application)
  }

  const onBack = () =>
    router.push(`/workspaces/${workspaceId}/grants/${grantId}`)

  return (
    <Background>
      <div className="flex flex-col gap-8 py-9 mb-24">
        <BackButton onBack={onBack} />
        <h1 className="text-2xl font-semibold">
          Application - <span className="text-gray-400">{grantName}</span>
        </h1>
        <h2 className="text-indigo-500 text-sm font-semibold">
          PROFILE SECTION (1/3)
        </h2>
        <Input
          label="Application Name"
          placeholder="Eg. 💸 Requesting 200 ETH to cross the DeFi Bridge"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          error={fieldErrors['name']}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Your Email"
            type="email"
            placeholder="Eg. Aavegrants.protocol@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            error={fieldErrors['email']}
          />
          <Input
            label="Wallet Address"
            placeholder="All wallets supported"
            value={walletAddress}
            onChange={(e) =>
              setWalletAddress(e.currentTarget.value as WalletAddressType)
            }
            error={fieldErrors['walletAddress']}
          />
        </div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          label="Description"
          placeholder="Eg. Project that boost the ecosystem with a deep focus on the ReFi with an attached link"
          error={fieldErrors['description']}
        />
        <h2 className="text-indigo-500 text-sm font-semibold">
          PROJECT DETAILS (2/3)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <FundsInput
            currency={currency}
            label="Seeking Funds"
            value={sneekingFunds as number}
            onChange={(e) => setSneekingFunds(e.currentTarget.value as any)}
            error={fieldErrors['sneekingFunds']}
          />
          <DatePicker
            value={
              expectedProjectDeadline
                ? new Date(expectedProjectDeadline as string)
                    ?.toISOString()
                    ?.split('T')[0]
                : ''
            }
            onChange={(e) =>
              setExpectedProjectDeadline(
                new Date(e.currentTarget.value).toISOString()
              )
            }
            label="Expected Project Deadline"
            min={new Date().toISOString()?.split('T')[0]}
            error={fieldErrors['expectedProjectDeadline']}
          />
        </div>
        {/* TODO: add validation for links */}
        <DynamicInputList
          inputProps={{ placeholder: 'Eg. A Drive/Notion link to some docs' }}
          items={links}
          setItems={setLinks}
          error={fieldErrors['links']}
          label="Proposal Links/Docs (optional)"
          areNumbersHidden
        />
        <DynamicInputList
          inputProps={{
            placeholder:
              'Eg. Elon Tusk, our team member is a professional tweeter',
          }}
          items={teamMemberDetails}
          setItems={setTeamMemberDetails}
          error={fieldErrors['teamMemberDetails']}
          label="Team member details"
          areNumbersHidden
        />
        <h2 className="text-indigo-500 text-sm font-semibold">
          EXPECTATIONS/MILESTONES (3/3)
        </h2>
        {/* TODO: add validations for link */}
        <DynamicInputList
          inputProps={{
            placeholder: 'Eg. A google drive link to some docs',
          }}
          items={previousSuccessfulProposalLinks}
          setItems={setPreviousSuccessfulProposalLinks}
          error={fieldErrors['previousSuccessfulProposalLinks']}
          label="Attach previous successful proposals (optional)"
          areNumbersHidden
        />
        {/* TODO: add info to show how many funds are remaining after each milestone */}
        {/* TODO: funds field will be hiden for upfront funding method right? */}
        <Milestones
          items={milestones}
          setItems={setMilestones}
          error={fieldErrors['milestones']}
        />
      </div>
      <div className="w-full max-w-7xl fixed mx-auto left-0 right-0 bottom-0 mb-6 px-8">
        <div className="flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start"
          >
            Apply
            <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Background>
  )
}

export default Apply
