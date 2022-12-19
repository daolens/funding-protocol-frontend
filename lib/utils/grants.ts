import { DEFAULT_TOKENS, IS_PROD } from '@lib/constants/common'
import { CONTRACTS } from '@lib/constants/contract'
import { GrantType } from '@lib/types/grants'
import { writeSmartContractFunction } from '@lib/utils/contract'
import { uploadToIPFS } from '@lib/utils/ipfs'
import { ethers } from 'ethers'

export const validateGrants = (grant: GrantType) => {
  const FIELD_REQUIRED_ERROR_MESSAGE = 'This field is required'
  const errors: Record<keyof GrantType, string> = {} as any
  if (!grant.title) errors['title'] = FIELD_REQUIRED_ERROR_MESSAGE
  if (!grant.subTitle) errors['subTitle'] = FIELD_REQUIRED_ERROR_MESSAGE
  if (grant.subTitle?.length > 300)
    errors['subTitle'] = 'Please limit description to 300 characters'
  if (!grant.selectionProcess)
    errors['selectionProcess'] = FIELD_REQUIRED_ERROR_MESSAGE
  if (!grant.fundingMethod)
    errors['fundingMethod'] = FIELD_REQUIRED_ERROR_MESSAGE
  if (!grant.proposalDeadline)
    errors['proposalDeadline'] = FIELD_REQUIRED_ERROR_MESSAGE
  if (grant.reviewers.length === 0)
    errors['reviewers'] = FIELD_REQUIRED_ERROR_MESSAGE
  if (!grant.treasuryAmount)
    errors['treasuryAmount'] = FIELD_REQUIRED_ERROR_MESSAGE
  if (!grant.reviewers.every((reviewer) => ethers.utils.isAddress(reviewer)))
    errors['reviewers'] = 'Please enter a valid address'
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
