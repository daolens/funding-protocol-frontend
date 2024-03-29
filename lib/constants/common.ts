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
    symbol: 'AAVE',
    image: '/images/tokens/aave.png',
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    polygonAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
    pair: '0xdfc14d2af169b0d36c4eff567ada9b2e0cae044f',
  },
  {
    id: '2',
    chain: 'Ethereum',
    name: 'Compound',
    symbol: 'COMP',
    image: '/images/tokens/compound.png',
    address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    polygonAddress: '0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c',
    pair: '0xcffdded873554f362ac02f8fb1f02e5ada10516f',
  },
  {
    id: '3',
    chain: 'Ethereum',
    name: 'Uniswap',
    symbol: 'UNI',
    image: '/images/tokens/uniswap.png',
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    polygonAddress: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
    pair: '0xd3d2e2692501a5c9ca623199d38826e513033a17',
  },
  {
    id: '4',
    chain: 'Ethereum',
    name: 'Bankless DAO',
    symbol: 'BANK',
    image: '/images/tokens/bankless-dao.png',
    address: '0x2d94aa3e47d9d5024503ca8491fce9a2fb4da198',
    polygonAddress: '0xDB7Cb471dd0b49b29CAB4a1C14d070f27216a0Ab',
    pair: '0x59c1349bc6f28a427e78ddb6130ec669c2f39b48',
  },
  {
    id: '5',
    image: '/images/tokens/weth.svg',
    symbol: 'WETH',
    address: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    polygonAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    pair: '0x0',
    chain: 'Ethereum',
    name: 'Ether(Wrapped)',
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

// TODO: correct this
export const IS_PROD = false

export const ERROR_MESSAGES = {
  fieldRequired: 'This field is required',
  addressNotValid: 'Please enter a valid address',
  urlNotValid: "Please enter a valid URL. Eg. 'https://example.com'.",
  discordHandleNotValid:
    "Please enter a valid discord handle. Eg. 'username#0001'.",
  emailNotValid: 'Please enter a valid email',
}

export const ACTIVE_CHAIN_ID_COOKIE_KEY = 'active-chain-id'
