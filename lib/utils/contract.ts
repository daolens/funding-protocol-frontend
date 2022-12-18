import { IS_PROD } from '@lib/constants/common'
import { ContractType } from '@lib/types/contract'
import { prepareWriteContract, writeContract } from '@wagmi/core'

type CallSmartContractFunctionOptionsType = {
  contractObj: ContractType
  functionName: string
  args: any[]
}

export const writeSmartContractFunction = async ({
  contractObj,
  functionName,
  args,
}: CallSmartContractFunctionOptionsType) => {
  const config = await prepareWriteContract({
    address: IS_PROD ? contractObj.address : contractObj.goerliAddress,
    abi: contractObj.abi,
    functionName,
    args: args,
  })

  const data = await writeContract(config)

  return data
}
