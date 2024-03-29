import { DEFAULT_TOKENS } from '@lib/constants/common'
import { CONTRACTS, CONTRACT_FUNCTION_NAME_MAP } from '@lib/constants/contract'
import { WalletAddressType } from '@lib/types/common'
import { GrantType } from '@lib/types/grants'
import { WorkspaceType } from '@lib/types/workspace'
import { getNormalisedTokenValue, log } from '@lib/utils/common'
import {
  getContractAddressByNetwork,
  readSmartContractFunction,
  writeSmartContractFunction,
} from '@lib/utils/contract'
import { getFromIPFS, uploadToIPFS } from '@lib/utils/ipfs'
import { calculateUSDValue, getUSDConversionRate } from '@lib/utils/token'
import { fetchTransaction } from '@wagmi/core'
import { ethers } from 'ethers'

export const postDataAndCallSmartContractFunction = async (
  data: WorkspaceType,
  chainId: number
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
    chainId,
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

const getAggregateBalances = async (
  balance: number[][],
  balanceSpent: number[][],
  tokenAddress: WalletAddressType[][]
) => {
  const rateTokenMap: Record<WalletAddressType, number> = {}
  const result: { balances: number[]; balancesSpent: number[] } = {
    balances: [],
    balancesSpent: [],
  }
  for (
    let workspaceIndex = 0;
    workspaceIndex < balance.length;
    workspaceIndex++
  ) {
    let _balance = 0
    let _balanceSpent = 0
    for (
      let grantIndex = 0;
      grantIndex < balance[workspaceIndex].length;
      grantIndex++
    ) {
      const _tokenAddress = tokenAddress[workspaceIndex][grantIndex]
      const rate =
        rateTokenMap[_tokenAddress] ||
        (await getUSDConversionRate(
          DEFAULT_TOKENS.find((token) =>
            [token.address, token.polygonAddress].includes(_tokenAddress)
          )?.pair
        ))

      rateTokenMap[_tokenAddress] = rate

      _balance += rate * balance[workspaceIndex][grantIndex]
      _balanceSpent += rate * balanceSpent[workspaceIndex][grantIndex]
    }
    result.balances.push(_balance)
    result.balancesSpent.push(_balanceSpent)
  }
  return result
}

export const fetchWorkspaces = async (chainId: number) => {
  const args = [getContractAddressByNetwork('grant', chainId)]
  log('fetchWorkspaces called with args', args)
  const response = (await readSmartContractFunction({
    contractObj: CONTRACTS.workspace,
    functionName: CONTRACT_FUNCTION_NAME_MAP.workspace.fetchWorkSpaces,
    args,
    chainId,
  })) as [
    FetchWorkspaceResponseType[],
    /** balance[workspaceIndex][grantIndex] */
    { _hex: string }[][],
    /** balanceSpent[workspaceIndex][grantIndex] */
    { _hex: string }[][],
    WalletAddressType[][]
  ]

  if (!response) throw new Error('response is not defined')

  log('fetchWorkSpaces response:', response)

  const workspaces: WorkspaceType[] = []

  // Determining aggregate balances in USD
  const [, hexBalances, hexBalancesSpent, tokenAddress] = response

  const numBalances = hexBalances.map((grantBalances) =>
    grantBalances.map((bal) => getNormalisedTokenValue(parseInt(bal._hex, 16)))
  )
  const numBalancesSpent = hexBalancesSpent.map((grantBalances) =>
    grantBalances.map((bal) => getNormalisedTokenValue(parseInt(bal._hex, 16)))
  )

  const { balances, balancesSpent } = await getAggregateBalances(
    numBalances,
    numBalancesSpent,
    tokenAddress
  )

  for (let index = 0; index < response[0].length; index++) {
    const workspaceFromContract = response[0][index]
    const totalFunds = balances[index]
    const totalFundsSpent = balancesSpent[index]
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

export const fetchWorkspaceById = async (
  workspaceId: `0x${string}`,
  chainId: number
) => {
  const args = [
    parseInt(workspaceId, 16),
    getContractAddressByNetwork('grant', chainId),
  ]
  log('fetchWorkSpaceDetails called with args', args)
  const response = (await readSmartContractFunction({
    contractObj: CONTRACTS.workspace,
    functionName: CONTRACT_FUNCTION_NAME_MAP.workspace.fetchWorkSpaceDetails,
    args,
    chainId,
  })) as [FetchWorkspaceResponseType, GrantFetchResponseType[]]

  if (!response) throw new Error('response is not defined')
  log('fetchWorkSpaceDetails response', response)

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
    grant.balance = getNormalisedTokenValue(
      parseInt(grantFromContract.balance._hex, 16)
    )
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
