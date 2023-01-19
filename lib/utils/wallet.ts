import * as Chains from 'wagmi/chains'

export const getChainDetails = (networkId: number) => {
  const chain = Object.values(Chains).find((chain) => chain.id === networkId)
  return chain
}
