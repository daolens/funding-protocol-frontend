import SUPPORTED_SAFES_INFO, { SUPPORTED_SAFE_IDS } from '@lib/constants/common'
import { SafeDetailsType, SupportedSafeInfotype } from '@lib/types/safe'

export const getSafeDetails = async (rpcUrl: string, address: string) => {
  try {
    const url = `${rpcUrl}/api/v1/safes/${address}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(response.statusText)
    const data = await response.json()
    return data as SafeDetailsType
  } catch (error) {
    console.error(error)
  }
  return null
}

export const getListOfSupportedNetworks = async (address: string) => {
  const supportedNetworks: SupportedSafeInfotype[] = []
  for (let index = 0; index < SUPPORTED_SAFE_IDS.length; index++) {
    const safeInfo = SUPPORTED_SAFES_INFO[SUPPORTED_SAFE_IDS[index]]
    const currSafeDetails = await getSafeDetails(safeInfo.rpcURL, address)
    if (currSafeDetails) supportedNetworks.push(safeInfo)
  }
  return supportedNetworks
}
