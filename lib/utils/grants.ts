import { GrantType } from '@lib/types/grants'

export const validateGrants = (grant: GrantType) => {
  const errors: Record<keyof GrantType, string> = {} as any
  if (!grant.title) errors['title'] = 'This field is required'
  if (!grant.subTitle) errors['subTitle'] = 'This field is required'
  if (grant.subTitle?.length > 300)
    errors['subTitle'] = 'Please limit description to 300 characters'
  if (!grant.selectionProcess)
    errors['selectionProcess'] = 'This field is required'
  if (!grant.proposalDeadline)
    errors['proposalDeadline'] = 'This field is required'
  if (
    !grant.proposalFormFields ||
    !grant.customFields ||
    grant.proposalFormFields.length + grant.customFields.length - 1 <= 0
  )
    errors['proposalFormFields'] = 'This field is required'
  return errors
}
