import BackButton from '@components/common/back-button'
import Background from '@components/common/background'
import DatePicker from '@components/common/date-picker'
import DynamicInputList from '@components/common/dynamic-input-list'
import Input from '@components/common/input-with-trailing-icon'
import Navbar from '@components/common/navbar'
import Textarea from '@components/common/textarea'
import FundsInput from '@components/grants/apply/funds-input'
import Milestones from '@components/grants/apply/milestones'
import TeamMembers from '@components/grants/apply/team-members'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { DynamicInputItemType, WalletAddressType } from '@lib/types/common'
import {
  ApplicationMilestoneType,
  ApplicationTeamMemberType,
  ApplicationType,
  FundingMethodType,
} from '@lib/types/grants'
import { validateGrantApplicationData } from '@lib/utils/grants'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type Props = {
  onBack: () => void
  isUpdateForm?: boolean
  application?: ApplicationType
  fundingMethod?: FundingMethodType
  grantName?: string
  onSubmit: (application: ApplicationType) => void
  currency?: string
  isLoading: boolean
}

const ApplicationForm = ({
  onBack,
  application,
  isLoading,
  fundingMethod,
  isUpdateForm,
  currency,
  onSubmit,
  grantName,
}: Props) => {
  const router = useRouter()
  const workspaceId = router.query.workspaceId as string
  const grantAddress = router.query.grantAddress as string

  const [name, setName] = useState(application?.name || '')
  const [email, setEmail] = useState(application?.email || '')
  const [walletAddress, setWalletAddress] = useState<WalletAddressType | ''>(
    application?.walletAddress || ''
  )
  const [description, setDescription] = useState(application?.description || '')
  const [seekingFunds, setSeekingFunds] = useState<number | null>(
    application?.seekingFunds || null
  )
  const [expectedProjectDeadline, setExpectedProjectDeadline] =
    useState<string>(application?.expectedProjectDeadline || '')
  const [links, setLinks] = useState<DynamicInputItemType[]>(
    application?.links.length === 0 || !application?.links
      ? [
          {
            id: nanoid(),
            text: '',
          },
        ]
      : application.links
  )
  const [teamMemberDetails, setTeamMemberDetails] = useState<
    ApplicationTeamMemberType[]
  >(
    application?.teamMemberDetails.length === 0 ||
      !application?.teamMemberDetails
      ? [
          {
            id: nanoid(),
            text: '',
            email: '',
          },
        ]
      : application.teamMemberDetails
  )
  const [previousSuccessfulProposalLinks, setPreviousSuccessfulProposalLinks] =
    useState<DynamicInputItemType[]>(
      application?.previousSuccessfulProposalLinks.length === 0 ||
        !application?.previousSuccessfulProposalLinks
        ? [
            {
              id: nanoid(),
              text: '',
            },
          ]
        : application.previousSuccessfulProposalLinks
    )
  const [milestones, setMilestones] = useState<ApplicationMilestoneType[]>(
    application?.milestones || [
      {
        id: nanoid(),
        funds: null,
        text: '',
        status: 'Submitted',
      },
    ]
  )
  const [discordHandle, setDiscordHandle] = useState('')
  const [fieldErrors, setFieldErrors] = useState<
    Record<keyof ApplicationType, string>
  >({} as any)

  const fundsInputValue =
    fundingMethod === 'MILESTONE'
      ? milestones
          .map((milestone) =>
            typeof milestone.funds === 'string'
              ? parseInt(milestone.funds)
              : milestone.funds || 0
          )
          .reduce((prev, curr) => prev + curr)
      : ((seekingFunds || '') as number)

  const onApply = () => {
    setFieldErrors({} as any)
    const _application: ApplicationType = {
      workspaceId,
      grantAddress,
      description,
      submissionTimestamp: new Date().toISOString(),
      email,
      expectedProjectDeadline,
      links: links.filter((item) => item.text),
      milestones:
        isUpdateForm || fundingMethod === 'MILESTONE' ? milestones : [],
      name,
      previousSuccessfulProposalLinks: previousSuccessfulProposalLinks.filter(
        (item) => item.text
      ),
      seekingFunds: fundsInputValue,
      teamMemberDetails: teamMemberDetails,
      walletAddress,
      id: application?.id,
      discordHandle,
    }

    const errors = validateGrantApplicationData(
      _application,
      fundingMethod as FundingMethodType
    )
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    onSubmit(_application)
  }

  return (
    <Background>
      <Navbar />
      <div className="flex flex-col gap-8 py-9 pb-32">
        <BackButton onBack={onBack} />
        <h1 className="text-2xl font-semibold">
          {isUpdateForm ? (
            'Update application'
          ) : (
            <>
              Application - <span className="text-gray-400">{grantName}</span>
            </>
          )}
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
        <Input
          label="Discord Handle"
          placeholder="username#0001"
          value={discordHandle}
          onChange={(e) => setDiscordHandle(e.currentTarget.value)}
          error={fieldErrors.discordHandle}
        />
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
        <div
          className={classNames('grid gap-4', !isUpdateForm && 'grid-cols-2')}
        >
          {!isUpdateForm && (
            <FundsInput
              currency={currency as string}
              label="Seeking Funds"
              value={fundsInputValue}
              onChange={(e) => setSeekingFunds(e.currentTarget.value as any)}
              error={fieldErrors['seekingFunds']}
              disabled={fundingMethod === 'MILESTONE'}
            />
          )}
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
        <TeamMembers
          items={teamMemberDetails}
          setItems={setTeamMemberDetails}
          error={fieldErrors.teamMemberDetails}
        />
        <h2 className="text-indigo-500 text-sm font-semibold">
          EXPECTATIONS{' '}
          {!isUpdateForm && fundingMethod === 'MILESTONE' && '/MILESTONES'}{' '}
          (3/3)
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
        {!isUpdateForm && fundingMethod === 'MILESTONE' && (
          <Milestones
            items={milestones}
            setItems={setMilestones}
            error={fieldErrors['milestones']}
            totalFundsSeeking={fundsInputValue}
          />
        )}
      </div>
      <div className="w-full max-w-7xl fixed mx-auto left-0 right-0 bottom-0 mb-6 px-8">
        <div className="flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
          <button
            type="button"
            onClick={onApply}
            disabled={isLoading}
            className={classNames(
              'inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start',
              {
                'cursor-not-allowed opacity-50': isLoading,
              }
            )}
          >
            {isUpdateForm ? 'Update' : 'Apply'}
            <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Background>
  )
}

export default ApplicationForm
