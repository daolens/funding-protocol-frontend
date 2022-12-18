import { DEFAULT_TOKENS } from '@lib/constants/common'
import { CONTRACTS } from '@lib/constants/contract'
import { GrantType } from '@lib/types/grants'
import { writeSmartContractFunction } from '@lib/utils/contract'
import { uploadToIPFS } from '@lib/utils/ipfs'

export const validateGrants = (grant: GrantType) => {
  const errors: Record<keyof GrantType, string> = {} as any
  if (!grant.title) errors['title'] = 'This field is required'
  if (!grant.subTitle) errors['subTitle'] = 'This field is required'
  if (grant.subTitle?.length > 300)
    errors['subTitle'] = 'Please limit description to 300 characters'
  if (!grant.selectionProcess)
    errors['selectionProcess'] = 'This field is required'
  if (!grant.fundingMethod) errors['fundingMethod'] = 'This field is required'
  if (!grant.proposalDeadline)
    errors['proposalDeadline'] = 'This field is required'
  if (grant.reviewers.length === 0)
    errors['reviewers'] = 'This field is required'
  if (
    !grant.proposalFormFields ||
    !grant.customFields ||
    grant.proposalFormFields.length + grant.customFields.length - 1 <= 0
  )
    errors['proposalFormFields'] = 'This field is required'
  return errors
}

export const postGrantDataAndCallSmartContractFn = async (data: GrantType) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify(data))).hash
  const result = await writeSmartContractFunction({
    contractObj: CONTRACTS.grant,
    args: [
      // workspace id
      1,
      ipfsHash,
      CONTRACTS.workspace.address,
      CONTRACTS.application.address,
      data.reviewers,
      // Token amount
      0,
      DEFAULT_TOKENS.find((token) => token.name === data.token)?.address,
      data.fundingMethod,
    ],
    functionName: 'createGrant',
  })

  if (!result.hash) throw new Error('createGrant smart contract call failed')
}
