import { CONTRACTS } from '@lib/constants/contract'
import { WorkspaceType } from '@lib/types/workspace'
import { writeSmartContractFunction } from '@lib/utils/contract'
import { uploadToIPFS } from '@lib/utils/ipfs'
import { ethers } from 'ethers'

export const postDataAndCallSmartContractFunction = async (
  data: WorkspaceType
) => {
  const ipfsHash = (await uploadToIPFS(JSON.stringify(data))).hash
  return writeSmartContractFunction({
    args: [
      ipfsHash,
      ethers.utils.hexZeroPad(data.multisigAddress, 32),
      data.network,
    ],
    contractObj: CONTRACTS.workspace,
    functionName: 'createWorkspace',
  })
}
