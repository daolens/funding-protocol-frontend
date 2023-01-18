import { ACTIVE_CHAIN_ID_COOKIE_KEY } from '@lib/constants/common'
import { SUPPORTED_CHAINS } from '@lib/constants/contract'
import { getCookie, setCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useNetwork } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'

const DEFAULT_CHAIN_ID = polygonMumbai.id

type UpdateCookieOptions = {
  chainId: number
  onUpdateCallback?: () => void
  onNoUpdateCallback?: () => void
}

const updateCookie = ({
  chainId,
  onNoUpdateCallback,
  onUpdateCallback,
}: UpdateCookieOptions) => {
  const onSetCookie = (cookieVal: any) => {
    if (!cookieVal) return
    setCookie(ACTIVE_CHAIN_ID_COOKIE_KEY, cookieVal, {
      maxAge: 60 * 60 * 24 * 365,
    })
    onUpdateCallback?.()
  }
  const chainIdFromCookie = getCookie(ACTIVE_CHAIN_ID_COOKIE_KEY)
  if (!chainIdFromCookie) {
    if (SUPPORTED_CHAINS.map((chain) => chain.id).includes(chainId))
      onSetCookie(chainId)
    else onSetCookie(DEFAULT_CHAIN_ID)
  } else {
    if (
      !SUPPORTED_CHAINS.map((chain) => chain.id).includes(
        parseInt(chainIdFromCookie as string)
      )
    )
      onSetCookie(DEFAULT_CHAIN_ID)
    else if (
      chainId &&
      SUPPORTED_CHAINS.map((chain) => chain.id).includes(
        parseInt(chainIdFromCookie as string)
      ) &&
      parseInt(chainIdFromCookie as string) !== chainId
    ) {
      onSetCookie(chainId)
    } else onNoUpdateCallback?.()
  }
}

const useNetworkDetection = () => {
  const { chain } = useNetwork()
  const router = useRouter()

  const exectionCount = useRef(0)
  const [isNetworkDetected, setIsNetworkDetected] = useState(false)

  // Case 1: Has cookie but current active network is different -> if supported network then switch
  // Case 2: Has no cookie but current active network is not supported -> set to polygonMumbai
  // Case 3: Has cookie and current active is same -> do nothing
  // Case 4: Has no cookie and current active is supported -> set cookie
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      isNetworkDetected ||
      exectionCount.current >= 1
    )
      return
    exectionCount.current++

    updateCookie({
      chainId: chain?.id as number,
      onUpdateCallback: () => !isNetworkDetected && router.reload(),
      onNoUpdateCallback: () => setIsNetworkDetected(true),
    })
  }, [chain?.id, router, isNetworkDetected])

  useEffect(() => {
    if (typeof window === 'undefined') return
    updateCookie({
      chainId: chain?.id as number,
    })
  }, [chain?.id])

  return { isNetworkDetected }
}

export default useNetworkDetection
