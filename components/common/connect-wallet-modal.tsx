import Modal from '@components/common/modal'
import cogoToast from 'cogo-toast'
import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import { Connector, useConnect } from 'wagmi'

type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  isCloseButtonHidden?: boolean
}

const ConnectWalletModal = ({
  isOpen,
  setIsOpen,
  isCloseButtonHidden,
}: Props) => {
  const { connectors, connect, isLoading, pendingConnector } = useConnect({
    onSuccess: () => {
      setIsOpen(false)
    },
    onError: (error) => {
      console.error(error)
      if (error.name === 'ConnectorAlreadyConnectedError') {
        setIsOpen(false)
        return
      }
      cogoToast.error('Something went wrong while connecting to your wallet')
    },
  })

  const metaMaskConnector = connectors.find(
    (connector) => connector.name === 'MetaMask'
  )
  const walletConnectConnector = connectors.find(
    (connector) => connector.name === 'WalletConnect'
  )

  const onConnect = (connector: Connector<any, any, any> | undefined) => {
    if (!connector) return
    connect({ connector })
  }

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isCloseButtonHidden={isCloseButtonHidden}
    >
      <div className="flex flex-col gap-7 px-16 py-5">
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-xl font-semibold">Connect your wallet</h2>
          <span className="text-gray-500 text-xs">
            All your transactions are on-chain
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <button
            className="inline-flex items-center gap-3 justify-center rounded-xl border border-gray-800 bg-gray-800 bg-opacity-20 px-4 py-2 text-base font-medium text-gray-200 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
            onClick={() => onConnect(metaMaskConnector)}
          >
            <Image
              src="/images/common/metamask.svg"
              width={36}
              height={36}
              alt="metamask"
            />
            <span>
              Metamask{' '}
              {pendingConnector?.id === metaMaskConnector?.id &&
                isLoading &&
                '(connecting)'}
              {!metaMaskConnector?.ready && ' (unsupported)'}
            </span>
          </button>
          <button
            className="inline-flex items-center gap-3 justify-center rounded-xl border border-gray-800 bg-gray-800 bg-opacity-20 px-4 py-2 text-base font-medium text-gray-200 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
            onClick={() => onConnect(walletConnectConnector)}
          >
            <Image
              src="/images/common/wallet-connect.svg"
              width={36}
              height={36}
              alt="Wallet connect"
            />
            <span>
              Wallet connect{' '}
              {pendingConnector?.id === walletConnectConnector?.id &&
                isLoading &&
                '(connecting)'}
              {!walletConnectConnector?.ready && ' (unsupported)'}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConnectWalletModal
