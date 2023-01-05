import { GraphQLClient, gql } from 'graphql-request'

export const getUSDConversionRate = async (
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
  let rate = 0

  const client = new GraphQLClient(
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    { headers: {} }
  )

  async function fetchWethPrice() {
    const data = await client.request(wethPriceQuery)
    rate = data.bundle.ethPrice
  }

  async function fetchTokenPrice() {
    const data = await client.request(priceQuery)
    rate =
      (data?.pair?.token0 ? data.pair.token0.derivedETH : 0) *
      data.bundle.ethPrice
  }

  if (tokenPair === '0x0') {
    await fetchWethPrice()
  } else if (tokenPair !== undefined) {
    await fetchTokenPrice()
  }

  return rate
}

export const calculateUSDValue = async (
  value: number | string,
  tokenPair: `0x${string}` | null | undefined
) => {
  const rate = await getUSDConversionRate(tokenPair)
  const amount = rate * (typeof value === 'string' ? parseInt(value) : value)

  return amount
}
