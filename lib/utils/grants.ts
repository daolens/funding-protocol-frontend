import { DEFAULT_TOKENS, ERROR_MESSAGES } from '@lib/constants/common'
import { CONTRACTS, CONTRACT_FUNCTION_NAME_MAP } from '@lib/constants/contract'
import { APPLICATION_STATUSES } from '@lib/constants/grants'
import { WalletAddressType } from '@lib/types/common'
import {
  ApplicationType,
  FundingMethodType,
  GrantType,
} from '@lib/types/grants'
import {
  checkIsEmail,
  checkIsLink,
  log,
  removeTagsFromHtmlString,
} from '@lib/utils/common'
import {
  getContractAddressByNetwork,
  readSmartContractFunction,
  writeSmartContractFunction,
} from '@lib/utils/contract'
import { getFromIPFS, uploadToIPFS } from '@lib/utils/ipfs'
import { fetchTransaction } from '@wagmi/core'
import { ethers } from 'ethers'
import { mainnet, polygon } from 'wagmi/chains'

export const validateGrantData = (grant: GrantType) => {
  const errors: Record<keyof GrantType, string> = {} as any
  if (!grant.title) errors['title'] = ERROR_MESSAGES.fieldRequired
  if (!removeTagsFromHtmlString(grant.subTitle))
    errors['subTitle'] = ERROR_MESSAGES.fieldRequired
  if (removeTagsFromHtmlString(grant.subTitle)?.length > 300)
    errors['subTitle'] = 'Please limit description to 300 characters'
  if (!grant.selectionProcess)
    errors['selectionProcess'] = ERROR_MESSAGES.fieldRequired
  if (!grant.fundingMethod)
    errors['fundingMethod'] = ERROR_MESSAGES.fieldRequired
  if (!grant.proposalDeadline)
    errors['proposalDeadline'] = ERROR_MESSAGES.fieldRequired
  if (grant.reviewers.length === 0)
    errors['reviewers'] = ERROR_MESSAGES.fieldRequired
  if (!grant.recommendedSeekingAmount)
    errors['recommendedSeekingAmount'] = ERROR_MESSAGES.fieldRequired
  if (!grant.reviewers.every((reviewer) => ethers.utils.isAddress(reviewer)))
    errors['reviewers'] = ERROR_MESSAGES.addressNotValid
  return errors
}

export const postGrantDataAndCallSmartContractFn = async (
  data: GrantType,
  chainId: number
) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify(data))).hash
  const workspaceId = parseInt(data.workspaceId!, 16)

  // token address in dev
  // Get test tokens from here: https://faucet.polygon.technology/
  // Select Mumbai & Test ERC20 PoS
  let tokenAddress = '0xfe4f5145f6e09952a5ba9e956ed0c25e3fa4c7f1'

  if (chainId === polygon.id || chainId === mainnet.id) {
    const token = DEFAULT_TOKENS.find((token) => token.name === data.token)
    if (!token) throw new Error(`Token not found with name: ${data.token}`)
    tokenAddress = chainId === polygon.id ? token.polygonAddress : token.address
  }

  const args = [
    workspaceId,
    ipfsHash,
    getContractAddressByNetwork('workspace', chainId),
    getContractAddressByNetwork('application', chainId),
    data.reviewers,
    data.recommendedSeekingAmount,
    tokenAddress,
    data.fundingMethod,
  ]

  log('createGrant called', { args })
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.grant,
    args,
    functionName: CONTRACT_FUNCTION_NAME_MAP.grant.createGrant,
    chainId,
  })

  if (!result.hash) throw new Error('createGrant smart contract call failed')

  const txnConfirmation = await result.wait()
  const hash = txnConfirmation.transactionHash
  const transaction = await fetchTransaction({
    hash: hash as `0x${string}`,
  })

  const returnValue: { _hex: string } = transaction.value
  // TODO: send correct grant address
  const grantAddress = returnValue._hex
  log(`createGrant call successful. Hash: ${result.hash}`)
  log({ transaction })
  return grantAddress
}

export const validateGrantApplicationData = (
  data: ApplicationType,
  fundingMethod: FundingMethodType
) => {
  const errors: Record<keyof ApplicationType, string> = {} as any

  // Validating required text fields
  const requiredTextFields: (keyof ApplicationType)[] = [
    'name',
    'email',
    'walletAddress',
    'seekingFunds',
    'expectedProjectDeadline',
  ]
  requiredTextFields.forEach((key) => {
    if (!data[key]) errors[key] = ERROR_MESSAGES.fieldRequired
  })

  if (!removeTagsFromHtmlString(data.description))
    errors['description'] = ERROR_MESSAGES.fieldRequired

  if (
    data.teamMemberDetails.some(
      (teamMember) => !teamMember.email || !teamMember.text
    )
  )
    errors.teamMemberDetails = ERROR_MESSAGES.fieldRequired
  else if (
    data.teamMemberDetails.some((teamMember) => !checkIsEmail(teamMember.email))
  )
    errors.teamMemberDetails = ERROR_MESSAGES.emailNotValid

  if (
    fundingMethod === 'MILESTONE' &&
    data.milestones.some((milestone) => !milestone.funds || !milestone.text)
  )
    errors.milestones = ERROR_MESSAGES.fieldRequired

  if (
    data.links.length > 0 &&
    data.links.some((link) => !checkIsLink(link.text))
  )
    errors.links = ERROR_MESSAGES.urlNotValid

  if (
    data.previousSuccessfulProposalLinks.some((link) => !checkIsLink(link.text))
  )
    errors.previousSuccessfulProposalLinks = ERROR_MESSAGES.urlNotValid

  if (!checkIsEmail(data.email)) errors.email = ERROR_MESSAGES.emailNotValid

  if (
    fundingMethod === 'MILESTONE' &&
    data.milestones
      .map((milestone) =>
        typeof milestone.funds === 'string'
          ? parseInt(milestone.funds)
          : milestone.funds
      )
      .reduce((prev = 0, curr = 0) => (prev || 0) + (curr || 0), 0) !==
      (typeof data.seekingFunds === 'string'
        ? parseInt(data.seekingFunds)
        : data.seekingFunds)
  )
    errors.milestones =
      'Seeking funds and sum of funds in milestone are not equal'

  if (!data.discordHandle.match(/^((.+?)#\d{4})/))
    errors.discordHandle = ERROR_MESSAGES.discordHandleNotValid

  return errors
}

export const postApplicationDataAndCallSmartContractFn = async (
  data: ApplicationType,
  chainId: number
) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify(data))).hash
  const workspaceId = parseInt(data.workspaceId!, 16)
  const args = [
    data.grantAddress,
    workspaceId,
    ipfsHash,
    data.milestones.length,
    data.milestones.map((milestone) => milestone.funds),
    data.seekingFunds,
  ]
  log('submitApplication called', { args })
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.application,
    args,
    functionName: CONTRACT_FUNCTION_NAME_MAP.application.submitApplication,
    chainId,
  })

  if (!result.hash)
    throw new Error('sumbitApplication smart contract call failed')

  const txnConfirmation = await result.wait()
  const hash = txnConfirmation.transactionHash
  const transaction = await fetchTransaction({
    hash: hash as `0x${string}`,
  })

  const returnValue: { _hex: string } = transaction.value
  // TODO: send correct application id
  const applicationId = returnValue._hex
  log(`submitApplication call successful. Hash: ${result.hash}`)
  log({ transaction })
  return applicationId
}

type ApplicationFetchResponseType = {
  id: { _hex: string }
  workspaceId: { _hex: string }
  grantAddress: string
  owner: WalletAddressType
  milestoneCount: { _hex: string }
  milestonesDone: { _hex: string }
  metadataHash: string
  state: 0 | 1 | 2 | 3 | 4
  milestonePayment: { _hex: string }[]
}

export const fetchApplications = async (
  grantAddress: string,
  applicationCount: number,
  chainId: number
) => {
  const response = (await readSmartContractFunction({
    contractObj: CONTRACTS.application,
    functionName: CONTRACT_FUNCTION_NAME_MAP.application.getGrantApplications,
    args: [grantAddress, applicationCount],
    chainId,
  })) as ApplicationFetchResponseType[]

  if (!response) throw new Error('response is not defined')

  log('getGrantApplications response', response)

  const applications: ApplicationType[] = []

  for (let index = 0; index < response.length; index++) {
    const applicationFromContract = response[index]
    if (!applicationFromContract.metadataHash) {
      console.error(
        'metadata hash not found for application: ',
        applicationFromContract.id
      )
      continue
    }

    const metadata = await getFromIPFS(applicationFromContract.metadataHash)
    if (!metadata) {
      console.error(
        'metadata not found for application: ',
        applicationFromContract.id
      )
      continue
    }

    const application: ApplicationType = JSON.parse(metadata)
    application.status = APPLICATION_STATUSES[applicationFromContract.state]
    application.completedMilestoneCount = parseInt(
      applicationFromContract.milestoneCount._hex,
      16
    )
    application.id = applicationFromContract.id._hex
    application.owner = applicationFromContract.owner

    applications.push(application)
  }

  return applications
}

export const updateGrantDataAndCallSmartContractFn = async (
  data: GrantType,
  chainId: number
) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify(data))).hash
  const workspaceId = parseInt(data.workspaceId!, 16)

  const args = [
    // Grant address
    data.address,
    workspaceId,
    getContractAddressByNetwork('workspace', chainId),
    ipfsHash,
    data.reviewers,
  ]

  log('updateGrant called', { args })
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.grant,
    args,
    functionName: CONTRACT_FUNCTION_NAME_MAP.grant.updateGrant,
    chainId,
  })

  if (!result.hash) throw new Error('createGrant smart contract call failed')
  log(`updateGrant call successful. Hash: ${result.hash}`)
}
