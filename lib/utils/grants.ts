import { DEFAULT_TOKENS, ERROR_MESSAGES, IS_PROD } from '@lib/constants/common'
import { CONTRACTS } from '@lib/constants/contract'
import { ApplicationType, GrantType } from '@lib/types/grants'
import { writeSmartContractFunction } from '@lib/utils/contract'
import { uploadToIPFS } from '@lib/utils/ipfs'
import { ethers } from 'ethers'

export const validateGrantData = (grant: GrantType) => {
  const errors: Record<keyof GrantType, string> = {} as any
  if (!grant.title) errors['title'] = ERROR_MESSAGES.fieldRequired
  if (!grant.subTitle) errors['subTitle'] = ERROR_MESSAGES.fieldRequired
  if (grant.subTitle?.length > 300)
    errors['subTitle'] = 'Please limit description to 300 characters'
  if (!grant.selectionProcess)
    errors['selectionProcess'] = ERROR_MESSAGES.fieldRequired
  if (!grant.fundingMethod)
    errors['fundingMethod'] = ERROR_MESSAGES.fieldRequired
  if (!grant.proposalDeadline)
    errors['proposalDeadline'] = ERROR_MESSAGES.fieldRequired
  if (grant.reviewers.length === 0)
    errors['reviewers'] = ERROR_MESSAGES.fieldRequired
  if (!grant.treasuryAmount)
    errors['treasuryAmount'] = ERROR_MESSAGES.fieldRequired
  if (!grant.reviewers.every((reviewer) => ethers.utils.isAddress(reviewer)))
    errors['reviewers'] = ERROR_MESSAGES.addressNotValid
  return errors
}

export const postGrantDataAndCallSmartContractFn = async (data: GrantType) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify(data))).hash
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.grant,
    args: [
      // TODO: update workspace id
      1,
      ipfsHash,
      IS_PROD ? CONTRACTS.workspace.address : CONTRACTS.workspace.goerliAddress,
      IS_PROD
        ? CONTRACTS.application.address
        : CONTRACTS.application.goerliAddress,
      data.reviewers,
      data.treasuryAmount,
      DEFAULT_TOKENS.find((token) => token.name === data.token)?.address,
      data.fundingMethod,
    ],
    functionName: 'createGrant',
  })

  if (!result.hash) throw new Error('createGrant smart contract call failed')
}

export const validateGrantApplicationData = (data: ApplicationType) => {
  const errors: Record<keyof ApplicationType, string> = {} as any

  // Validating required text fields
  const requiredTextFields: (keyof ApplicationType)[] = [
    'name',
    'email',
    'description',
    'walletAddress',
    'sneekingFunds',
    'expectedProjectDeadline',
  ]
  requiredTextFields.forEach((key) => {
    if (!data[key]) errors[key] = ERROR_MESSAGES.fieldRequired
  })

  if (data.teamMemberDetails.length === 0)
    errors.teamMemberDetails = ERROR_MESSAGES.fieldRequired

  if (data.milestones.some((milestone) => !milestone.funds || !milestone.text))
    errors.milestones = ERROR_MESSAGES.fieldRequired

  return errors
}
