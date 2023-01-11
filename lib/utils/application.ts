import { StatusProps } from '@components/application/milestone-statuses'
import { MILESTONE_STATUSES } from '@lib/constants/application'
import { CONTRACTS, CONTRACT_FUNCTION_NAME_MAP } from '@lib/constants/contract'
import { APPLICATION_STATUSES } from '@lib/constants/grants'
import { WalletAddressType } from '@lib/types/common'
import {
  ApplicationMilestoneStateDetailType,
  ApplicationMilestoneType,
  ApplicationStatusType,
  ApplicationType,
  FundingMethodType,
  GrantType,
} from '@lib/types/grants'
import { WorkspaceType } from '@lib/types/workspace'
import { addDays, log } from '@lib/utils/common'
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
  reason?: string
}

export const updateApplicationStatusSC = async ({
  applicationId,
  grantAddress,
  status,
  workspaceId,
  reason,
}: UpdateApplicationStatusSCOptions) => {
  const ipfsHash = reason
    ? (await uploadToIPFS(JSON.stringify({ reason }))).hash
    : ''
  const args = [
    applicationId,
    workspaceId,
    APPLICATION_STATUSES.findIndex((currStatus) => currStatus === status),
    ipfsHash,
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

type FetchMilestoneResponseType = {
  state: number
  reviewersHash: string
  applicantHash: string
}

export const fetchApplicationById = async (applicationId: `0x${string}`) => {
  const response = (await readSmartContractFunction({
    contractObj: CONTRACTS.application,
    functionName: CONTRACT_FUNCTION_NAME_MAP.application.getApplicationDetail,
    args: [applicationId],
  })) as [
    FetchApplicationResponseType,
    WalletAddressType[],
    // Timestamp when transcation will be done
    { _hex: string },
    FundingMethodType,
    FetchMilestoneResponseType[],
    // Feedback hash
    string
  ]

  if (!response) throw new Error('response is not defined')

  const [
    applicationFromContract,
    reviewers,
    reviewTimestamp,
    fundingMethod,
    ,
    feedbackHash,
  ] = response

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
  application.revertDeadline = new Date(
    parseInt(reviewTimestamp._hex, 16) * 1000
  ).toISOString()
  application.reviewer = reviewers
  application.grantAddress = applicationFromContract.grantAddress
  application.workspaceId = applicationFromContract.workspaceId
    ._hex as `0x${string}`
  application.fundingMethod = fundingMethod
  if (feedbackHash) {
    const feedbackData = await getFromIPFS(feedbackHash)
    if (feedbackData) {
      application.feedback = JSON.parse(feedbackData)?.reason || ''
    }
  }

  const milestonesFromSC = response[4]

  for (let index = 0; index < milestonesFromSC.length; index++) {
    const milestone = application.milestones[index]
    const milestoneFromSC = milestonesFromSC[index]

    milestone.status = MILESTONE_STATUSES[milestoneFromSC.state]
    milestone.id = index.toString()

    // Populating proof of work
    if (milestoneFromSC.applicantHash) {
      const milestoneDetailsJsonString = await getFromIPFS(
        milestoneFromSC.applicantHash
      )
      if (milestoneDetailsJsonString) {
        const milestoneDetails = JSON.parse(
          milestoneDetailsJsonString
        ).milestoneDetails
        milestone.proofOfWorkArray = milestoneDetails || []
      }
    }

    // Populating feedback
    if (milestoneFromSC.reviewersHash) {
      const milestoneFeedbackJsonString = await getFromIPFS(
        milestoneFromSC.reviewersHash
      )
      if (milestoneFeedbackJsonString) {
        const milestoneFeedbacks = JSON.parse(
          milestoneFeedbackJsonString
        ).milestoneFeedbacks
        milestone.feedbacks = milestoneFeedbacks || []
      }
    }
    application.milestones[index] = milestone
  }

  return application
}

type SubmitMilestoneDetailsSCOptions = {
  applicationId: string
  milestoneId: string
  milestoneDetails: ApplicationMilestoneStateDetailType[]
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
  milestoneFeedbacks?: ApplicationMilestoneStateDetailType[]
}

export const approveMilestoneSC = async ({
  applicationId,
  grantAddress,
  milestoneId,
  workspaceId,
  milestoneFeedbacks,
}: ApproveMilestoneSCOptions) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify({ milestoneFeedbacks })))
    .hash
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

export const sendFeedbackMilestoneSC = async ({
  applicationId,
  grantAddress,
  milestoneId,
  workspaceId,
  milestoneFeedbacks,
}: ApproveMilestoneSCOptions) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify({ milestoneFeedbacks })))
    .hash
  const args = [applicationId, milestoneId, workspaceId, grantAddress, ipfsHash]
  log('submitMilestoneFeedback called', { args })
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.application,
    args,
    functionName:
      CONTRACT_FUNCTION_NAME_MAP.application.submitMilestoneFeedback,
  })

  if (!result.hash)
    throw new Error('submitMilestoneFeedback smart contract call failed')

  const txnConfirmation = await result.wait()
  log(`submitMilestoneFeedback call successful. Hash: ${result.hash}`)
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
    application.fundingMethod = grant.fundingMethod
    applications.push(application)
  }

  return applications
}

export const updateApplicationMetadataSC = async (data: ApplicationType) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify(data))).hash
  const args = [data.id, ipfsHash, data.milestones.length]
  log('updateApplicationMetadata called', { args })
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.application,
    args,
    functionName:
      CONTRACT_FUNCTION_NAME_MAP.application.updateApplicationMetadata,
  })

  if (!result.hash)
    throw new Error('updateApplicationMetadata smart contract call failed')

  const txnConfirmation = await result.wait()
  log(`updateApplicationMetadata call successful. Hash: ${result.hash}`)
  log({ txnConfirmation })
}

export const revertRejectDecisionSC = async (
  applicationId: string,
  grantAddress: string
) => {
  const args = [applicationId, grantAddress]
  log('application.revertTransactions called', { args })
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.application,
    args,
    functionName: CONTRACT_FUNCTION_NAME_MAP.application.revertTransactions,
  })

  if (!result.hash)
    throw new Error('application.revertTransactions smart contract call failed')

  const txnConfirmation = await result.wait()
  log(`application.revertTransactions call successful. Hash: ${result.hash}`)
  log({ txnConfirmation })
}

export const revertApproveDecisionSC = async (
  applicationId: string,
  grantAddress: string
) => {
  const args = [applicationId]
  log('individualGrant.revertTransactions called', { args })
  const result = await writeSmartContractFunction({
    contractObj: {
      abi: CONTRACTS.individualGrant.abi,
      address: grantAddress,
      polygonMumbaiAddress: grantAddress,
      goerliAddress: grantAddress,
    },
    args,
    functionName: CONTRACT_FUNCTION_NAME_MAP.individualGrant.revertTransactions,
  })

  if (!result.hash)
    throw new Error(
      'individualGrant.revertTransactions smart contract call failed'
    )

  const txnConfirmation = await result.wait()
  log(
    `individualGrant.revertTransactions call successful. Hash: ${result.hash}`
  )
  log({ txnConfirmation })
}

export const revertMilestoneApproveDecisionSC = async (
  applicationId: string,
  milestoneId: string,
  grantAddress: string
) => {
  const args = [applicationId, milestoneId]
  log('individualGrant.revertMilestoneTransactions called', { args })
  const result = await writeSmartContractFunction({
    contractObj: {
      abi: CONTRACTS.individualGrant.abi,
      address: grantAddress,
      polygonMumbaiAddress: grantAddress,
      goerliAddress: grantAddress,
    },
    args,
    functionName:
      CONTRACT_FUNCTION_NAME_MAP.individualGrant.revertMilestoneTransactions,
  })

  if (!result.hash)
    throw new Error(
      'individualGrant.revertMilestoneTransactions smart contract call failed'
    )

  const txnConfirmation = await result.wait()
  log(
    `individualGrant.revertMilestoneTransactions call successful. Hash: ${result.hash}`
  )
  log({ txnConfirmation })
}

export const getListOfStatuses = (milestones: ApplicationMilestoneType[]) => {
  // Initial default status
  let statuses: StatusProps[] = [
    { title: 'Application Approved', color: 'green', isTimerShown: false },
  ]

  for (
    let milestoneIndex = 0;
    milestoneIndex < milestones.length;
    milestoneIndex++
  ) {
    const milestone = milestones[milestoneIndex]

    const proofOfWorkArray: StatusProps[] =
      milestone?.proofOfWorkArray?.map(
        (item, index) =>
          ({
            color: 'yellow',
            title: `Milestone ${milestoneIndex + 1}: In Review`,
            sender: item.sender,
            timestamp: item.timestamp,
            isTimerShown: false,
            milestoneId: index.toString(),
          } as StatusProps)
      ) || []

    let lastApproveFeedback = -1
    milestone.feedbacks?.forEach(
      (item, index) =>
        item.text === MILESTONE_STATUSES[2] && (lastApproveFeedback = index)
    )
    const feedbacks: StatusProps[] =
      milestone?.feedbacks
        // Keeping only last approval feedback, filtering out the rest.
        // This case happens when approval is reverted and milestone is eventually approved again
        ?.filter((item, index) => {
          if (item.text !== MILESTONE_STATUSES[2]) return true
          if (index === lastApproveFeedback) return true
          return false
        })
        // Filtering out approval feedbacks if the milestone is not approved
        // This case happens when approval is reverted
        ?.filter(
          (item) =>
            item.text !== MILESTONE_STATUSES[2] ||
            milestone.status === 'ApprovePending' ||
            milestone.status === 'Approved'
        )
        ?.map(
          (item) =>
            ({
              color: item.text === MILESTONE_STATUSES[2] ? 'green' : 'yellow',
              title: `Milestone ${milestoneIndex + 1}: ${
                item.text === MILESTONE_STATUSES[2] ? 'Approved' : 'Feedback'
              }`,
              content:
                item.text === MILESTONE_STATUSES[2] ? undefined : item.text,
              sender: item.sender,
              timestamp: item.timestamp,
              milestoneId: milestone.id,
              isTimerShown:
                item.text === MILESTONE_STATUSES[2] &&
                addDays(item.timestamp, 3) > new Date(),
            } as StatusProps)
        ) || []

    const currStatus: StatusProps[] = [...proofOfWorkArray, ...feedbacks].sort(
      (statusA, statusB) =>
        new Date(statusB.timestamp!).getTime() -
        new Date(statusA.timestamp!).getTime()
    )

    statuses = [...currStatus, ...statuses]

    const isComplete =
      milestone.status === 'Approved' || milestone.status === 'ApprovePending'
    // Current milestone is incomplete so next milestones are incomplete too. Skipping them.
    if (!isComplete) break
  }
  return statuses
}
