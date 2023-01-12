import ClientOnly from '@components/common/client-only'
import { WalletAddressType } from '@lib/types/common'
import { getTruncatedWalletAddress, onCopyText } from '@lib/utils/common'
import classNames from 'classnames'
import React from 'react'
import { useEnsName } from 'wagmi'

type Props = JSX.IntrinsicElements['button'] & {
  address: WalletAddressType
}

const WalletAddress = ({ address, ...buttonProps }: Props) => {
  const { data: ensName } = useEnsName({ address })
  const label = ensName || getTruncatedWalletAddress(address)
  const value = ensName || address
  return (
    <ClientOnly>
      <button
        {...buttonProps}
        onClick={() => onCopyText(value)}
        className={classNames(buttonProps.className, 'hover:underline inline')}
      >
        {label}
      </button>
    </ClientOnly>
  )
}

export default WalletAddress
