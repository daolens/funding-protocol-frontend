import WorkspaceContractAbi from '@lib/abi/workspaceAbi.json'
import GrantContractAbi from '@lib/abi/GrantsAbi.json'
import { ContractType } from '@lib/types/contract'

export const CONTRACT_NAMES = ['']

export const CONTRACTS: Record<string, ContractType> = {
  workspace: {
    address: '0x5266679B13fc94CF9DE0818D15E60A9c225e4668',
    abi: WorkspaceContractAbi,
    goerliAddress: '0xe88F4CBDDdf04f15f17E42Bc7A60523227F3Abcf',
  },
  application: {
    address: '0xB1873E7234199E864F9619562c058465C0085ac8',
    goerliAddress: '0xbAe1FDf2a566f6db454420E522773b2063E85457',
  },
  grant: {
    address: '0x49aD31dA5B105789C8737c9c98c0D97AA69fE996',
    goerliAddress: '0x2c8d912df0Aa7b452772A029d29968AdC2ce9C05',
    abi: GrantContractAbi,
  },
}
