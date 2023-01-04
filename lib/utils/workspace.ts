import { DEFAULT_TOKENS, IS_PROD } from '@lib/constants/common'
import { CONTRACTS, CONTRACT_FUNCTION_NAME_MAP } from '@lib/constants/contract'
import { GrantType } from '@lib/types/grants'
import { WorkspaceType } from '@lib/types/workspace'
import { log } from '@lib/utils/common'
import {
  readSmartContractFunction,
  writeSmartContractFunction,
} from '@lib/utils/contract'
import { getFromIPFS, uploadToIPFS } from '@lib/utils/ipfs'
import { calculateUSDValue } from '@lib/utils/token'
import { fetchTransaction } from '@wagmi/core'
import { ethers } from 'ethers'

export const postDataAndCallSmartContractFunction = async (
  data: WorkspaceType
) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify(data))).hash
  const args = [
    ipfsHash,
    ethers.utils.hexZeroPad(data.multisigAddress, 32),
    data.network,
  ]
  log('createWorkspace called', { args })
  const result = await writeSmartContractFunction({
    args,
    contractObj: CONTRACTS.workspace,
    functionName: 'createWorkspace',
  })
  if (!result.hash)
    throw new Error('createWorkspace smart contract call failed')
  const txnConfirmation = await result.wait()
  const hash = txnConfirmation.transactionHash
  const transaction = await fetchTransaction({
    hash: hash as `0x${string}`,
  })

  const returnValue: { _hex: string } = transaction.value
  // TODO: send correct ID
  const workspaceId = returnValue._hex

  log(`createWorkspace call successful. Hash: ${result.hash}`)
  log({ transaction })
  return workspaceId
}

type FetchWorkspaceResponseType = {
  id: {
    _hex: `0x${string}`
  }
  metadataHash: string
  owner: `0x${string}`
  safe: {
    chainId: {
      _hex: `0x${string}`
    }
    _address: `0x${string}`
  }
  applicationCount: {
    _hex: string
  }
  grantCount: {
    _hex: string
  }
}

export const fetchWorkspaces = async () => {
  const args = [
    IS_PROD ? CONTRACTS.grant.address : CONTRACTS.grant.polygonMumbaiAddress,
  ]
  log('fetchWorkspaces called with args', args)
  const response = (await readSmartContractFunction({
    contractObj: CONTRACTS.workspace,
    functionName: CONTRACT_FUNCTION_NAME_MAP.workspace.fetchWorkSpaces,
    args,
  })) as [
    FetchWorkspaceResponseType[],
    /** totalAmts */
    { _hex: string }[],
    /** amtSpends */
    { _hex: string }[]
  ]

  if (!response) throw new Error('response is not defined')

  log('fetchWorkSpaces response:', response)

  const workspaces: WorkspaceType[] = []

  for (let index = 0; index < response[0].length; index++) {
    const workspaceFromContract = response[0][index]
    const totalFunds = parseInt(response[1][index]._hex, 16)
    const totalFundsSpent = parseInt(response[2][index]._hex, 16)
    const totalApplicants = parseInt(
      workspaceFromContract.applicationCount._hex,
      16
    )
    const totalGrants = parseInt(workspaceFromContract.grantCount._hex, 16)

    if (!workspaceFromContract?.id?._hex) continue
    const dataFromIpfs = await getFromIPFS(workspaceFromContract.metadataHash)
    if (!dataFromIpfs) continue
    const workspace: WorkspaceType = JSON.parse(dataFromIpfs)
    workspace.id = workspaceFromContract.id._hex
    workspace.adminAddresses = [workspaceFromContract.owner]
    workspace.totalFunds = totalFunds
    workspace.totalFundsSpent = totalFundsSpent
    workspace.totalApplicants = totalApplicants
    workspace.totalGrant = totalGrants
    workspace.owner = workspaceFromContract.owner
    workspace.totalApplicants = workspaces.push(workspace)
  }

  return workspaces
}

type GrantFetchResponseType = {
  balance: {
    _hex: string
  }
  grantAddress: `0x${string}`
  metadataHash: string
  numApplicants: {
    _hex: `0x${string}`
  }
}

export const fetchWorkspaceById = async (workspaceId: `0x${string}`) => {
  const response = (await readSmartContractFunction({
    contractObj: CONTRACTS.workspace,
    functionName: CONTRACT_FUNCTION_NAME_MAP.workspace.fetchWorkSpaceDetails,
    args: [
      parseInt(workspaceId, 16),
      IS_PROD ? CONTRACTS.grant.address : CONTRACTS.grant.polygonMumbaiAddress,
    ],
  })) as [FetchWorkspaceResponseType, GrantFetchResponseType[]]

  if (!response) throw new Error('response is not defined')

  const workspaceFromContract = response[0]
  const workspace: WorkspaceType = JSON.parse(
    await getFromIPFS(workspaceFromContract.metadataHash)
  )
  workspace.adminAddresses = [workspaceFromContract.owner]
  workspace.id = workspaceFromContract.id._hex
  workspace.owner = workspaceFromContract.owner

  const grants: GrantType[] = []

  const [, grantsFromContract] = response

  for (let index = 0; index < grantsFromContract.length; index++) {
    const grantFromContract = grantsFromContract[index]
    const grant: GrantType = JSON.parse(
      await getFromIPFS(grantFromContract.metadataHash)
    )
    grant.applicantCount = parseInt(grantFromContract.numApplicants._hex, 16)
    grant.address = grantFromContract.grantAddress
    grant.workspaceId = workspaceFromContract.id._hex
    grant.balance = parseInt(grantFromContract.balance._hex, 16)
    grant.status =
      new Date() < new Date(grant.proposalDeadline) ? 'open' : 'close'
    grant.recommendedSeekingAmountInUsd = await calculateUSDValue(
      grant.recommendedSeekingAmount,
      DEFAULT_TOKENS.find((token) => token.name === grant.token)?.pair
    )
    grant.balanceInUsd = await calculateUSDValue(
      grant.balance,
      DEFAULT_TOKENS.find((token) => token.name === grant.token)?.pair
    )
    grants.push(grant)
  }

  return { workspace, grants }
}
