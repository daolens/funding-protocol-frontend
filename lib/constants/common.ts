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
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  },
  {
    id: '2',
    chain: 'Ethereum',
    name: 'Compound',
    image: '/images/tokens/compound.png',
    address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
  },
  {
    id: '3',
    chain: 'Ethereum',
    name: 'Uniswap',
    image: '/images/tokens/uniswap.png',
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  },
  {
    id: '4',
    chain: 'Ethereum',
    name: 'Bankless DAO',
    image: '/images/tokens/bankless-dao.png',
    address: '0x2d94aa3e47d9d5024503ca8491fce9a2fb4da198',
  },
  // {
  //   id: '5',
  //   chain: 'Polygon',
  //   name: 'Matic Token',
  //   image: '/images/tokens/matic.png',
  //   // TODO: find address
  // },

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

export const IS_PROD = process.env.NODE_ENV === 'production'

export const ERROR_MESSAGES = {
  fieldRequired: 'This field is required',
  addressNotValid: 'Please enter a valid address',
}
