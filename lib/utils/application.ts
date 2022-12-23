import { CONTRACTS, CONTRACT_FUNCTION_NAME_MAP } from '@lib/constants/contract'
import { APPLICATION_STATUSES } from '@lib/constants/grants'
import { WalletAddressType } from '@lib/types/common'
import { ApplicationStatusType, ApplicationType } from '@lib/types/grants'
import { log } from '@lib/utils/common'
import {
  readSmartContractFunction,
  writeSmartContractFunction,
} from '@lib/utils/contract'
import { getFromIPFS } from '@lib/utils/ipfs'

type UpdateApplicationStatusSCOptions = {
  applicationId: string
  workspaceId: string
  status: ApplicationStatusType
  grantAddress: string
}

// TODO: test
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
  log(`updateApplicationState call successful. Hash: ${result.hash}`)
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
  })) as FetchApplicationResponseType

  if (!response) throw new Error('response is not defined')

  log('getApplicationDetail response:', response)

  const ipfsData = await getFromIPFS(response.metadataHash)

  if (!ipfsData) throw new Error('Meta data not found')

  const application: ApplicationType = JSON.parse(ipfsData)

  application.id = response.id._hex
  application.completedMilestoneCount = parseInt(
    response.milestonesDone._hex,
    16
  )
  application.owner = response.owner as WalletAddressType
  application.status = APPLICATION_STATUSES[response.state]
  // TODO: get from API
  application.reviewTimestamp = ''
  // TODO: get from API
  application.reviewer = '0x0'
  application.grantAddress = response.grantAddress
  application.workspaceId = response.workspaceId._hex as `0x${string}`
  // TODO: get from API
  application.fundingMethod =
    application.milestones.length === 0 ? 'UPFRONT' : 'MILESTONE'

  return application
}
