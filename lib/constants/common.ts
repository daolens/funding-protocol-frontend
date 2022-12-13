import { SupportedNetworkIdType } from '@lib/types/common'
import { SupportedSafeInfotype } from '@lib/types/safe'

export const SUPPORTED_SAFE_IDS = [1, 5, 137] as const

export const SUPPORTED_SAFES_INFO: Record<
  SupportedNetworkIdType,
  SupportedSafeInfotype
> = {
  1: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcURL: 'https://safe-transaction.mainnet.gnosis.io/',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
  },
  5: {
    name: 'Goerli Testnet',
    chainId: 5,
    rpcURL: 'https://safe-transaction.goerli.gnosis.io/',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
  },
  137: {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcURL: 'https://safe-transaction.polygon.gnosis.io/',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png'
  },
} as const

export default SUPPORTED_SAFES_INFO
