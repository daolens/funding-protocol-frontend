import { GraphQLClient, gql } from 'graphql-request'

export const calculateUSDValue = async (
  value: number | string,
  tokenPair: `0x${string}` | null | undefined
) => {
  const wethPriceQuery = gql`
    {
      bundle(id: "1") {
        ethPrice
      }
    }
  `
  const priceQuery = gql`
    {
      bundle(id: "1" ) {
      ethPrice
      }
      pair(id: "${tokenPair}") {
        token0 {
        derivedETH
        }
      }
    }
  `
  let amount = 0

  const client = new GraphQLClient(
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    { headers: {} }
  )

  async function fetchWethPrice() {
    const data = await client.request(wethPriceQuery)
    amount =
      data.bundle.ethPrice *
      (typeof value === 'string' ? parseInt(value) : value)
  }

  async function fetchTokenPrice() {
    const data = await client.request(priceQuery)
    amount =
      (data?.pair?.token0 ? data.pair.token0.derivedETH : 0) *
      data.bundle.ethPrice *
      (typeof value === 'string' ? parseInt(value) : value)
  }

  if (tokenPair === '0x0') {
    await fetchWethPrice()
  } else if (tokenPair !== undefined) {
    await fetchTokenPrice()
  }
  return amount
}
