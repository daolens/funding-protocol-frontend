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
import {
  ApplicationMilestoneType,
  ApplicationType,
  FundingMethodType,
} from '@lib/types/grants'
import {
  postApplicationDataAndCallSmartContractFn,
  validateGrantApplicationData,
} from '@lib/utils/grants'
import { fetchWorkspaceById } from '@lib/utils/workspace'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import cogoToast, { CTReturn } from 'cogo-toast'
import { nanoid } from 'nanoid'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'

type Props = {
  grantName: string
  currency?: string
  fundingMethod: FundingMethodType
}

const Apply = ({ grantName, currency = 'USDC', fundingMethod }: Props) => {
  const loadingToastRef = useRef<CTReturn | null>(null)

  const router = useRouter()
  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress as string

  const applicationMutation = useMutation({
    mutationFn: (data: ApplicationType) =>
      postApplicationDataAndCallSmartContractFn(data),
    onMutate: () => {
      loadingToastRef.current = cogoToast.loading(
        'Creating grant. This may take a while.',
        {
          hideAfter: 0,
        }
      )
    },
    onSuccess: (applicationId) => {
      loadingToastRef.current?.hide?.()
      cogoToast.success('Applied successfully')
      router.push(
        `/workspaces/${workspaceId}/grants/${grantAddress}/applications/${applicationId}`
      )
    },
    onError: (error) => {
      loadingToastRef.current?.hide?.()
      console.error(error)
      cogoToast.error('Something went wrong while applying.')
    },
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [walletAddress, setWalletAddress] = useState<WalletAddressType | ''>('')
  const [description, setDescription] = useState('')
  const [seekingFunds, setseekingFunds] = useState<number | null>(null)
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
      grantAddress: router.query.grantAddress as string,
      description,
      submissionTimestamp: new Date().toISOString(),
      email,
      expectedProjectDeadline,
      links: links.filter((item) => item.text),
      milestones: fundingMethod === 'MILESTONE' ? milestones : [],
      name,
      previousSuccessfulProposalLinks: previousSuccessfulProposalLinks.filter(
        (item) => item.text
      ),
      seekingFunds: seekingFunds,
      teamMemberDetails: teamMemberDetails.filter((item) => item.text),
      walletAddress,
    }

    const errors = validateGrantApplicationData(application, fundingMethod)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    applicationMutation.mutate(application)
  }

  const onBack = () =>
    router.push(`/workspaces/${workspaceId}/grants/${grantAddress}`)

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
            value={seekingFunds as number}
            onChange={(e) => setseekingFunds(e.currentTarget.value as any)}
            error={fieldErrors['seekingFunds']}
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
          EXPECTATIONS {fundingMethod === 'MILESTONE' && '/MILESTONES'} (3/3)
        </h2>
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
        {fundingMethod === 'MILESTONE' && (
          <Milestones
            items={milestones}
            setItems={setMilestones}
            error={fieldErrors['milestones']}
          />
        )}
      </div>
      <div className="w-full max-w-7xl fixed mx-auto left-0 right-0 bottom-0 mb-6 px-8">
        <div className="flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
          <button
            type="button"
            onClick={onApply}
            disabled={applicationMutation.isLoading}
            className={classNames(
              'inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start',
              {
                'cursor-not-allowed opacity-50': applicationMutation.isLoading,
              }
            )}
          >
            Apply
            <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Background>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx
  const { workspaceId, grantAddress } = query

  const { grants } = await fetchWorkspaceById(workspaceId as any)
  const grant = grants.find((grant) => grant.address === grantAddress)

  if (!grant) return { notFound: true }

  const props: Props = {
    fundingMethod: grant?.fundingMethod,
    grantName: grant?.title,
  }

  return { props }
}

export default Apply
