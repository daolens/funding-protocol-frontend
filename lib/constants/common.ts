import { SupportedNetworkIdType, TokenType } from '@lib/types/common'
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
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  },
  5: {
    name: 'Goerli Testnet',
    chainId: 5,
    rpcURL: 'https://safe-transaction.goerli.gnosis.io/',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  },
  137: {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcURL: 'https://safe-transaction.polygon.gnosis.io/',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
  },
} as const

export default SUPPORTED_SAFES_INFO

export const DEFAULT_TOKENS: TokenType[] = [
  {
    id: '1',
    chain: 'Ethereum',
    name: 'Aave',
    image: '/images/tokens/aave.png',
  },
  {
    id: '2',
    chain: 'Ethereum',
    name: 'Compound',
    image: '/images/tokens/compound.png',
  },
  {
    id: '3',
    chain: 'Ethereum',
    name: 'Uniswap',
    image: '/images/tokens/uniswap.png',
  },
  {
    id: '4',
    chain: 'Ethereum',
    name: 'Bankless DAO',
    image: '/images/tokens/bankless-dao.png',
  },
  {
    id: '5',
    chain: 'Polygon',
    name: 'Matic Token',
    image: '/images/tokens/matic.png',
  },
  {
    id: '6',
    chain: 'Ethereum',
    name: 'Ethereum',
    image: '/images/tokens/ethereum.png',
  },
  // { chain: 'Ethereum', name: 'Matic Token', image: '' },
  // { chain: 'Ethereum', name: 'Shiba Inu', image: '' },
]

export const IRON_OPTIONS = {
  cookieName: 'siwe',
  password: process.env.IRON_SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}