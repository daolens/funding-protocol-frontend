import { IS_PROD } from '@lib/constants/common'
import { CONTRACTS, CONTRACT_FUNCTION_NAME_MAP } from '@lib/constants/contract'
import { GrantType } from '@lib/types/grants'
import { WorkspaceType } from '@lib/types/workspace'
import { log } from '@lib/utils/common'
import {
  readSmartContractFunction,
  writeSmartContractFunction,
} from '@lib/utils/contract'
import { getFromIPFS, uploadToIPFS } from '@lib/utils/ipfs'
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

  log(`createWorkspace call successful. Hash: ${result.hash}`)
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
}

export const fetchWorkspaces = async () => {
  const response = (await readSmartContractFunction({
    contractObj: CONTRACTS.workspace,
    functionName: CONTRACT_FUNCTION_NAME_MAP.workspace.fetchWorkSpaces,
  })) as FetchWorkspaceResponseType[]

  if (!response) throw new Error('response is not defined')

  const workspaces: WorkspaceType[] = []

  for (let index = 0; index < response.length; index++) {
    const workspaceFromContract = response[index]
    const workspace: WorkspaceType = JSON.parse(
      await getFromIPFS(workspaceFromContract.metadataHash)
    )
    workspace.id = workspaceFromContract.id._hex
    workspace.adminAddresses = [workspaceFromContract.owner]
    workspaces.push(workspace)
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
    grant.status =
      new Date() < new Date(grant.proposalDeadline) ? 'open' : 'close'
    grants.push(grant)
  }

  return { workspace, grants }
}
