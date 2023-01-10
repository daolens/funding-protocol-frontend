import * as Chains from 'wagmi/chains'

export const Chain = (networkId: number) => {
  const chain = Object.values(Chains).find((chain) => chain.id === networkId)
  return chain
}
