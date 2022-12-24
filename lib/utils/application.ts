import { CONTRACTS, CONTRACT_FUNCTION_NAME_MAP } from '@lib/constants/contract'
import { APPLICATION_STATUSES } from '@lib/constants/grants'
import { WalletAddressType } from '@lib/types/common'
import {
  ApplicationStatusType,
  ApplicationType,
  FundingMethodType,
  GrantType,
} from '@lib/types/grants'
import { WorkspaceType } from '@lib/types/workspace'
import { log } from '@lib/utils/common'
import {
  readSmartContractFunction,
  writeSmartContractFunction,
} from '@lib/utils/contract'
import { getFromIPFS, uploadToIPFS } from '@lib/utils/ipfs'

type UpdateApplicationStatusSCOptions = {
  applicationId: string
  workspaceId: string
  status: ApplicationStatusType
  grantAddress: string
}

// TODO: test reject
export const updateApplicationStatusSC = async ({
  applicationId,
  grantAddress,
  status,
  workspaceId,
}: UpdateApplicationStatusSCOptions) => {
  const args = [
    applicationId,
    workspaceId,
    APPLICATION_STATUSES.findIndex((currStatus) => currStatus === status),
    // TODO: replace with ipfsHash which stores reason
    '',
    grantAddress,
  ]
  log('updateApplicationState called', { args })
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.application,
    args,
    functionName: CONTRACT_FUNCTION_NAME_MAP.application.updateApplicationState,
  })

  if (!result.hash)
    throw new Error('updateApplicationState smart contract call failed')

  const txnConfirmation = await result.wait()
  log(`updateApplicationState call successful. Hash: ${result.hash}`)
  log({ txnConfirmation })
}

type FetchApplicationResponseType = {
  grantAddress: string
  id: { _hex: string }
  metadataHash: string
  milestoneCount: { _hex: string }
  milestonePayment: { _hex: string }[]
  milestonesDone: { _hex: string }
  owner: string
  state: 0 | 1 | 2 | 3 | 4
  totalFunds: { _hex: string }
  workspaceId: { _hex: string }
}

export const fetchApplicationById = async (applicationId: `0x${string}`) => {
  const response = (await readSmartContractFunction({
    contractObj: CONTRACTS.application,
    functionName: CONTRACT_FUNCTION_NAME_MAP.application.getApplicationDetail,
    args: [applicationId],
  })) as [
    FetchApplicationResponseType,
    WalletAddressType[],
    number,
    FundingMethodType
  ]

  if (!response) throw new Error('response is not defined')

  const [applicationFromContract, reviewers, reviewTimestamp, fundingMethod] =
    response

  log('getApplicationDetail response:', response)

  const ipfsData = await getFromIPFS(applicationFromContract.metadataHash)

  if (!ipfsData) throw new Error('Meta data not found')

  const application: ApplicationType = JSON.parse(ipfsData)

  application.id = applicationFromContract.id._hex
  application.completedMilestoneCount = parseInt(
    applicationFromContract.milestonesDone._hex,
    16
  )
  application.owner = applicationFromContract.owner as WalletAddressType
  application.status = APPLICATION_STATUSES[applicationFromContract.state]
  application.reviewTimestamp = new Date(reviewTimestamp).toISOString()
  application.reviewer = reviewers
  application.grantAddress = applicationFromContract.grantAddress
  application.workspaceId = applicationFromContract.workspaceId
    ._hex as `0x${string}`
  application.fundingMethod = fundingMethod

  return application
}

type SubmitMilestoneDetailsSCOptions = {
  applicationId: string
  milestoneId: string
  milestoneDetails: string
  workspaceId: string
  grantAddress: string
}

export const submitMilestoneDetailsSC = async ({
  applicationId,
  grantAddress,
  milestoneDetails,
  milestoneId,
  workspaceId,
}: SubmitMilestoneDetailsSCOptions) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify({ milestoneDetails })))
    .hash
  const args = [applicationId, milestoneId, ipfsHash, workspaceId, grantAddress]
  log('requestMilestoneApproval called', { args })
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.application,
    args,
    functionName:
      CONTRACT_FUNCTION_NAME_MAP.application.requestMilestoneApproval,
  })

  if (!result.hash)
    throw new Error('requestMilestoneApproval smart contract call failed')

  const txnConfirmation = await result.wait()
  log(`requestMilestoneApproval call successful. Hash: ${result.hash}`)
  log({ txnConfirmation })
}

type ApproveMilestoneSCOptions = {
  applicationId: string
  milestoneId: string
  workspaceId: string
  grantAddress: string
  reason?: string
}

export const approveMilestoneSC = async ({
  applicationId,
  grantAddress,
  milestoneId,
  workspaceId,
  reason,
}: ApproveMilestoneSCOptions) => {
  const ipfsHash = (
    await uploadToIPFS(JSON.stringify({ milestoneReviewReason: reason }))
  ).hash
  const args = [applicationId, milestoneId, workspaceId, grantAddress, ipfsHash]
  log('approveMilestone called', { args })
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.application,
    args,
    functionName: CONTRACT_FUNCTION_NAME_MAP.application.approveMilestone,
  })

  if (!result.hash)
    throw new Error('approveMilestone smart contract call failed')

  const txnConfirmation = await result.wait()
  log(`approveMilestone call successful. Hash: ${result.hash}`)
  log({ txnConfirmation })
}

export const fetchCurrentUserApplications = async (
  address: WalletAddressType
) => {
  const response = (await readSmartContractFunction({
    contractObj: CONTRACTS.application,
    functionName: CONTRACT_FUNCTION_NAME_MAP.application.fetchMyApplications,
    overrides: { from: address },
  })) as [FetchApplicationResponseType[], string[], string[]]

  if (!response) throw new Error('response is not defined')

  log('fetchMyApplications response:', response)

  const applications: ApplicationType[] = []

  for (let index = 0; index < response[0].length; index++) {
    const applicationFromContract = response[0][index]

    const applicationIpfsData = await getFromIPFS(
      applicationFromContract.metadataHash
    )
    const grantIpfsData = await getFromIPFS(response[1][index])
    const worksapceIpfsData = await getFromIPFS(response[2][index])

    if (!applicationIpfsData) throw new Error('Application meta data not found')
    if (!grantIpfsData) throw new Error('Grant meta data not found')
    if (!worksapceIpfsData) throw new Error('Workspace meta data not found')

    const application: ApplicationType = JSON.parse(applicationIpfsData)
    const grant: GrantType = JSON.parse(grantIpfsData)
    const workspace: WorkspaceType = JSON.parse(worksapceIpfsData)

    application.id = applicationFromContract.id._hex
    application.completedMilestoneCount = parseInt(
      applicationFromContract.milestonesDone._hex,
      16
    )
    application.owner = applicationFromContract.owner as WalletAddressType
    application.status = APPLICATION_STATUSES[applicationFromContract.state]
    // TODO: add review timestamp
    // application.reviewTimestamp = new Date(reviewTimestamp).toISOString()
    application.grantAddress = applicationFromContract.grantAddress
    application.workspaceId = applicationFromContract.workspaceId
      ._hex as `0x${string}`
    application.workspaceTitle = workspace.communityName
    application.grantTitle = grant.title
    applications.push(application)
  }

  return applications
}
